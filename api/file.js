// Download proxy: streams a media file from the CDN with Content-Disposition: attachment
// so the browser saves it directly (and the <video> player can use it as a fallback source).
const { Readable } = require('stream');

const hits = new Map();
const LIMIT = 40;
const WINDOW = 60 * 1000;

function hostOf(v) { try { return new URL(v).host; } catch { return ''; } }

function originAllowed(req) {
  if (req.headers['sec-fetch-site'] === 'same-origin') return true;
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = [req.headers.host, ...extra];
  const h = hostOf(req.headers.origin || '') || hostOf(req.headers.referer || '');
  return !!h && allowed.includes(h);
}

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > LIMIT;
}

// Block localhost / private / IP-literal targets (SSRF protection)
function safeTarget(u) {
  try {
    const x = new URL(u);
    if (x.protocol !== 'https:' && x.protocol !== 'http:') return false;
    const h = x.hostname.toLowerCase();
    if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':')) return false;
    return h.includes('.');
  } catch { return false; }
}

function cleanName(n, ext) {
  let s = String(n || 'video').replace(/[\\/:*?"<>|\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80) || 'video';
  ext = String(ext || 'mp4').replace(/[^a-z0-9]/gi, '').slice(0, 5) || 'mp4';
  return `${s}.${ext}`;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ message: 'Forbidden' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ message: 'Too many requests. Try again in a minute.' });

  const target = String(req.query.u || '').trim();
  if (!target || target.length > 4000 || !safeTarget(target)) {
    return res.status(400).json({ message: 'Invalid file URL' });
  }

  try {
    const h = { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' };
    if (req.headers.range) h.Range = req.headers.range;

    const up = await fetch(target, { headers: h, redirect: 'follow', signal: AbortSignal.timeout(55000) });
    if (!up.ok && up.status !== 206) return res.status(502).json({ message: 'Source refused the file (' + up.status + ')' });

    let ct = (up.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!/^(video|audio)\//.test(ct)) ct = 'application/octet-stream';

    const ext = String(req.query.e || '') || (ct.startsWith('audio/') ? 'mp3' : 'mp4');
    const name = cleanName(req.query.n, ext);

    res.statusCode = up.status;
    res.setHeader('Content-Type', ct);
    res.setHeader('Content-Disposition', `attachment; filename="download.${ext.replace(/[^a-z0-9]/gi, '') || 'mp4'}"; filename*=UTF-8''${encodeURIComponent(name)}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Accept-Ranges', 'bytes');
    for (const k of ['content-length', 'content-range']) {
      const v = up.headers.get(k);
      if (v) res.setHeader(k, v);
    }
    if (!up.body) return res.end();
    Readable.fromWeb(up.body).on('error', () => res.destroy()).pipe(res);
  } catch (e) {
    if (!res.headersSent) return res.status(502).json({ message: 'Download failed. Please try again.' });
    res.destroy();
  }
};
