// Vercel serverless function: /api/file
//   /api/file?ping=1                 -> "ok"
//   /api/file?u=<url>&n=<filename>   -> download (attachment), resumable
//   /api/file?inline=1&u=<url>       -> for the in-page player (Range supported)
//
// The source file is pulled in small Range chunks (YouTube throttles / cuts long single
// requests) and sent to the phone with an exact Content-Length, Accept-Ranges and ETag,
// so Android's download manager can finish it and resume it if the connection drops.
const { Readable } = require("stream");
const crypto = require("crypto");

const CHUNK = 4 * 1024 * 1024;
const PRIVATE = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|\[?f[cd][0-9a-f]{2}:)/i;
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";

function parseRange(h, total) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(h || "").trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  let start, end;
  if (m[1] === "") { const n = +m[2]; start = Math.max(0, total - n); end = total - 1; }
  else { start = +m[1]; end = m[2] === "" ? total - 1 : Math.min(+m[2], total - 1); }
  return start <= end && start < total ? { start, end } : false;
}

async function probe(url, headers) {
  const r = await fetch(url, { headers: Object.assign({}, headers, { Range: "bytes=0-0" }), redirect: "follow" });
  const info = { status: r.status, type: r.headers.get("content-type") || "", url: r.url || url, total: 0, ranged: false };
  if (r.status === 206) {
    const m = /\/(\d+)\s*$/.exec(r.headers.get("content-range") || "");
    if (m) { info.total = +m[1]; info.ranged = true; }
  } else if (r.status === 200) {
    info.total = +r.headers.get("content-length") || 0;
  }
  try { if (r.body) await r.body.cancel(); } catch (e) {}
  return info;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Range, If-Range");
  res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
  if (req.method === "OPTIONS") return res.status(204).end();

  const q = req.query || {};
  if (q.ping) { res.setHeader("Cache-Control", "no-store"); return res.status(200).send("ok"); }

  let target;
  try { target = new URL(String(q.u || "")); } catch (e) { return res.status(400).send("Bad url"); }
  if (!/^https?:$/.test(target.protocol) || PRIVATE.test(target.hostname)) return res.status(400).send("Blocked url");

  const base = { "User-Agent": UA, "Accept": "*/*" };
  if (/tiktok/i.test(target.hostname)) base.Referer = "https://www.tiktok.com/";
  if (/googlevideo\.com$/i.test(target.hostname)) { base.Referer = "https://www.youtube.com/"; base.Origin = "https://www.youtube.com"; }

  let closed = false;
  res.on("close", () => { closed = true; });

  try {
    const info = await probe(target.href, base);
    if (info.status >= 400) return res.status(502).send("Source returned HTTP " + info.status);
    if (/^(text\/html|application\/json|text\/plain)/i.test(info.type) && info.total < 50000) return res.status(502).send("Source returned a web page or error, not a video");

    // Source can't do ranges or size is unknown: plain pass-through.
    if (!info.ranged || !info.total) {
      const h = Object.assign({}, base); if (req.headers.range) h.Range = req.headers.range;
      const up = await fetch(target.href, { headers: h, redirect: "follow" });
      if (!up.ok && up.status !== 206) return res.status(502).send("Source returned HTTP " + up.status);
      res.status(up.status === 206 ? 206 : 200);
      for (const k of ["content-type", "content-length", "content-range", "accept-ranges"]) { const v = up.headers.get(k); if (v) res.setHeader(k, v); }
      if (!q.inline) res.setHeader("Content-Disposition", 'attachment; filename="' + (String(q.n || "video").replace(/[^\w.\- ]+/g, "").trim() || "video") + '"');
      res.setHeader("Cache-Control", "no-store");
      if (!up.body) return res.end();
      return Readable.fromWeb(up.body).on("error", () => res.end()).pipe(res);
    }

    const total = info.total;
    let start = 0, end = total - 1, partial = false;
    if (req.headers.range) {
      const r = parseRange(req.headers.range, total);
      if (r === false) { res.setHeader("Content-Range", "bytes */" + total); return res.status(416).end(); }
      if (r) { start = r.start; end = r.end; partial = true; }
    }

    // Open the first chunk now: if the source refuses (e.g. YouTube 403), answer with a clean error instead of a broken download.
    const firstTo = Math.min(start + CHUNK - 1, end);
    let firstUp;
    try { firstUp = await fetch(info.url, { headers: Object.assign({}, base, { Range: "bytes=" + start + "-" + firstTo }), redirect: "follow" }); } catch (e) { firstUp = null; }
    if (!firstUp || firstUp.status !== 206 || !firstUp.body) return res.status(502).send("Source refused the video (HTTP " + (firstUp ? firstUp.status : "network") + ")");

    const etag = '"' + crypto.createHash("sha1").update(target.origin + target.pathname + total).digest("hex").slice(0, 20) + '"';
    res.status(partial ? 206 : 200);
    res.setHeader("Content-Type", info.type || "application/octet-stream");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("ETag", etag);
    res.setHeader("Content-Length", String(end - start + 1));
    if (partial) res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
    if (!q.inline) {
      const name = String(q.n || "video").replace(/[^\w.\- ]+/g, "").trim() || "video";
      res.setHeader("Content-Disposition", 'attachment; filename="' + name + '"');
    }
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "HEAD") return res.end();

    let pos = start, fails = 0, pending = firstUp;
    while (pos <= end && !closed) {
      const to = Math.min(pos + CHUNK - 1, end);
      try {
        const up = pending || await fetch(info.url, { headers: Object.assign({}, base, { Range: "bytes=" + pos + "-" + to }), redirect: "follow" });
        pending = null;
        if (up.status !== 206 || !up.body) throw new Error("chunk HTTP " + up.status);
        for await (const buf of Readable.fromWeb(up.body)) {
          if (closed) break;
          pos += buf.length;
          if (!res.write(buf)) await new Promise(ok => {
            const done = () => { res.off("drain", done); res.off("close", done); ok(); };
            res.once("drain", done); res.once("close", done);
          });
        }
      } catch (e) {
        pending = null;
        if (++fails > 3) return res.destroy();   // length already promised: abort so the client can resume
      }
    }
    if (!closed) res.end();
  } catch (e) {
    if (!res.headersSent) res.status(502).send("Fetch failed"); else res.destroy();
  }
};
