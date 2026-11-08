// Vercel serverless proxy: /api/file?u=<file url>&n=<filename>
// Streams the file with Content-Disposition: attachment so it downloads directly.
const { Readable } = require("stream");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.query.ping) return res.status(200).end("ok");
  const n = String(req.query.n || "video.mp4").replace(/[^\w.\- ]/g, "_").slice(0, 80);
  let t;
  try { t = new URL(req.query.u); } catch (e) { return res.status(400).end("bad url"); }
  const h = t.hostname;
  if (t.protocol !== "https:" || !h.includes(".") || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(h))
    return res.status(400).end("blocked");
  try {
    const headers = { "User-Agent": "Mozilla/5.0", Referer: t.origin + "/" };
    if (req.headers.range) headers.Range = req.headers.range;
    const r = await fetch(t, { headers });
    if (!(r.ok || r.status === 206) || !r.body) return res.status(502).end("upstream " + r.status);
    res.status(r.status === 206 ? 206 : 200);
    const cr = r.headers.get("content-range"); if (cr) res.setHeader("Content-Range", cr);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/octet-stream");
    const len = r.headers.get("content-length"); if (len) res.setHeader("Content-Length", len);
    res.setHeader("Content-Disposition", (req.query.inline ? "inline" : "attachment") + '; filename="' + n + '"');
    Readable.fromWeb(r.body).pipe(res);
  } catch (e) { res.status(502).end("fetch failed"); }
};
module.exports.config = { maxDuration: 60 };
