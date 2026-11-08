// Vercel serverless proxy: /api/download?url=<link>
// Picks the right eliteprotech API for the link, reads whatever JSON comes back,
// and returns one clean format:
// { status, data: { title, thumbnail, duration, medias:[{url,quality,extension,type,data_size}] } }
const API_BASE = "https://eliteprotech-apis.zone.id/download/";
const UA = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

const ROUTES = [
  [/youtu\.?be/i, [{ ep: "ytmp4", kind: "video", label: "MP4" }, { ep: "ytmp3", kind: "audio" }]],
  [/tiktok\.com/i, [{ ep: "tiktok" }]],
  [/instagram\.com/i, [{ ep: "instagram" }]],
  [/facebook\.com|fb\.watch|fb\.com/i, [{ ep: "facebook" }]],
  [/(?:\/\/|\.)x\.com|twitter\.com/i, [{ ep: "x" }]],
  [/threads\.(net|com)/i, [{ ep: "threads" }]],
  [/spotify\.com/i, [{ ep: "spotify", kind: "audio" }]],
  [/mediafire\.com/i, [{ ep: "mediafire", kind: "file", label: "File" }]]
];

const THUMB = /thumb|cover|poster|avatar|profile|icon|preview|banner/i;
const SKIP_KEY = /^(original_url|source|source_url|webpage_url|permalink|share_url|page_url|author_url|profile_url)$/i;
const IMG = /\.(jpe?g|png|webp|gif)(\?|#|$)/i;
const AUD = /\.(mp3|m4a|aac|ogg|opus|wav)(\?|#|$)/i;
const VID = /\.(mp4|webm|mov|mkv)(\?|#|$)/i;
const isUrl = v => typeof v === "string" && /^https?:\/\//i.test(v);

async function get(url) {
  try {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return null;
    return JSON.parse(await r.text());
  } catch (e) { return null; }
}

async function callEndpoint(ep, link) {
  for (const p of ["url", "link"]) {
    const j = await get(API_BASE + ep + "?" + p + "=" + encodeURIComponent(link));
    if (j) return j;
  }
  return null;
}

// Walk any JSON and gather URL strings with the object that owns them.
function walk(node, out, seen) {
  if (Array.isArray(node)) return node.forEach(n => walk(n, out, seen));
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node)) {
    if (isUrl(v)) {
      if (seen.has(v) || SKIP_KEY.test(k)) continue;
      if (k === "url" && Array.isArray(node.medias)) continue;
      seen.add(v);
      if (THUMB.test(k) && !VID.test(v) && !AUD.test(v)) out.thumbs.push(v);
      else out.items.push({ url: v, key: k, node });
    } else if (v && typeof v === "object") walk(v, out, seen);
  }
}

function first(node, keys, test) {
  if (Array.isArray(node)) { for (const n of node) { const r = first(n, keys, test); if (r !== undefined) return r; } return; }
  if (!node || typeof node !== "object") return;
  for (const k of keys) if (k in node && test(node[k])) return node[k];
  for (const v of Object.values(node)) if (v && typeof v === "object") { const r = first(v, keys, test); if (r !== undefined) return r; }
}

const pretty = k => String(k).replace(/[_\-]+/g, " ").replace(/^./, c => c.toUpperCase());
const extOf = u => { try { const m = new URL(u).pathname.match(/\.([a-z0-9]{2,4})$/i); return m ? m[1].toLowerCase() : ""; } catch (e) { return ""; } };

function gather(out, json, route, link) {
  const tmp = { items: [], thumbs: [] };
  walk(json, tmp, new Set([link]));
  out.thumbs.push(...tmp.thumbs);
  const title = first(json, ["title", "caption", "description", "desc", "text", "filename", "file_name", "name"], v => typeof v === "string" && v.trim() && !isUrl(v));
  if (title && !out.title) out.title = title.trim();
  const dur = first(json, ["duration", "length"], v => typeof v === "number" || (typeof v === "string" && v && !isUrl(v)));
  if (dur !== undefined && !out.duration) out.duration = dur;
  for (const it of tmp.items) {
    const n = it.node, u = it.url;
    const hint = (it.key + " " + (n.type || "") + " " + (n.quality || "") + " " + (n.format || "") + " " + (n.extension || n.ext || "")).toLowerCase();
    let kind = route.kind || "video";
    if (AUD.test(u) || /audio|mp3|m4a/.test(hint)) kind = "audio";
    else if (IMG.test(u) && !VID.test(u)) kind = "image";
    else if (VID.test(u) || /video|mp4/.test(hint)) kind = route.kind === "file" ? "file" : "video";
    const ext = String(n.extension || n.ext || extOf(u) || (kind === "audio" ? "mp3" : kind === "image" ? "jpg" : kind === "file" ? "bin" : "mp4")).replace(/^\./, "").toLowerCase();
    let label;
    if (kind === "audio") label = "Audio only";
    else if (kind === "image") label = "Image";
    else if (kind === "file") label = "File";
    else {
      label = n.quality || n.resolution || n.label || (n.height ? n.height + "p" : "") ||
        (/^(url|link|download|download_url|downloadurl|src|video|media|file)$/i.test(it.key) ? (route.label || "Video") : pretty(it.key));
    }
    out.media.push({ url: u, quality: String(label), extension: ext, type: kind, data_size: n.data_size || n.size || n.filesize || undefined });
  }
}

async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const link = req.query.url;
  if (!link) return res.status(400).json({ error: "url is required" });
  const out = { media: [], thumbs: [], title: "", duration: "" };
  const routes = (ROUTES.find(r => r[0].test(link)) || [null, []])[1];
  const done = await Promise.all(routes.map(r => callEndpoint(r.ep, link).then(j => ({ r, j }))));
  done.forEach(({ r, j }) => { if (j) gather(out, j, r, link); });
  if (!out.media.length) return res.status(502).json({ error: "No downloadable media found for this link." });
  const seen = new Set();
  out.media = out.media.filter(m => !seen.has(m.url) && seen.add(m.url));
  res.status(200).json({ status: "success", data: { title: out.title, thumbnail: out.thumbs[0] || "", duration: out.duration, medias: out.media } });
}
module.exports = handler;
module.exports.config = { maxDuration: 30 };
module.exports.__test = { gather, ROUTES };
