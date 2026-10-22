
// Secure proxy: real API URL/key live only in Vercel Environment Variables.
// Env vars: UPSTREAM_URL (required), UPSTREAM_KEY (optional), ALLOWED_ORIGINS (optional, comma-separated hosts)

const hits = new Map();
const LIMIT = 10;          // requests
const WINDOW = 60 * 1000;  // per minute, per IP (best-effort, per serverless instance)

const ALLOWED_SITES = [
  'tiktok.com', 'youtube.com', 'youtu.be', 'facebook.com', 'fb.watch',
  'instagram.com', 'pinterest.com', 'pin.it'
];

function hostOf(v) {
  try { return new URL(v).host; } catch { return ''; }
}

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

function siteAllowed(u) {
  try {
    const h = new URL(u).hostname.replace(/^www\./, '').toLowerCase();
    return ALLOWED_SITES.some(d => h === d || h.endsWith('.' + d));
  } catch { return false; }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ message: 'Forbidden' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ message: 'Too many requests. Try again in a minute.' });

  const url = String(req.query.url || '').trim();
  if (!url || url.length > 500 || !/^https?:\/\//i.test(url) || !siteAllowed(url)) {
    return res.status(400).json({ message: 'Invalid or unsupported URL' });
  }

  if (!process.env.UPSTREAM_URL) return res.status(500).json({ message: 'Server not configured' });

  try {
    const headers = {};
    if (process.env.UPSTREAM_KEY) headers['x-api-key'] = process.env.UPSTREAM_KEY;

    const r = await fetch(`${process.env.UPSTREAM_URL}?url=${encodeURIComponent(url)}`, {
      headers,
      signal: AbortSignal.timeout(25000)
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(502).json({ message: 'Upstream error. Please try again.' });
  }
};
