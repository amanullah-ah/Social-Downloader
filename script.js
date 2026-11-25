let viaProxy = false;
// Optional fallback proxy (only used if the browser blocks the direct API call).
// Leave empty to call the APIs directly, or set e.g. "https://YOUR-PROXY.vercel.app/api"
const PROXY_BASE = "/api";
/* Simplified redraws of platform logos */
const IC = {
link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
youtube:'<svg viewBox="0 0 24 24"><rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#F00"/><path d="M10 9l5.5 3-5.5 3z" fill="#fff"/></svg>',
instagram:'<svg viewBox="0 0 24 24"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".3" stop-color="#FA7E1E"/><stop offset=".55" stop-color="#D62976"/><stop offset=".8" stop-color="#962FBF"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect x="1.5" y="1.5" width="21" height="21" rx="6.2" fill="url(#ig)"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="17.5" cy="6.5" r="1.25" fill="#fff"/></svg>',
facebook:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877F2"/><path fill="#fff" d="M13.6 22v-8h2.5l.4-3.1h-2.9V8.9c0-.9.3-1.5 1.5-1.5h1.6V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.5H8v3.1h2.6v8z"/></svg>',
tiktok:'<svg viewBox="-1 -1 26 26"><g id="tk"><path id="tkp" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#25F4EE" transform="translate(-.8 -.8)"/><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#FE2C55" transform="translate(.8 .8)"/><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#fff"/></g></svg>',
x:'<svg viewBox="0 0 24 24"><path fill="#fff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
threads:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#111" stroke="#555"/><path d="M15.6 9.2c-.5-1.6-1.6-2.4-3.5-2.4-2.5 0-4 1.7-4 5.2s1.5 5.2 4 5.2c2.1 0 3.4-1.1 3.4-2.7 0-1.8-1.4-2.5-3.1-2.5-1.3 0-2.2.6-2.2 1.5 0 .8.6 1.3 1.5 1.3 1.3 0 2-.9 2-2.5V9.2" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
spotify:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1DB954"/><g fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round"><path d="M6 9.3c4-1.2 8.6-.9 12 1.1"/><path d="M6.9 12.6c3.2-.9 6.4-.6 9.2.9"/><path d="M7.7 15.6c2.4-.6 4.8-.4 6.9.7"/></g></svg>',
mediafire:'<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="6" fill="#1D96F2"/><path d="M6.5 16.5V9.5M12 16.5V7.5M17.5 16.5V11.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
pinterest:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#E60023"/><g fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.7 14.7c-.9-.8-1.3-2-.9-3.2.5-1.7 2.1-2.6 3.8-2.4 1.9.2 3 1.7 2.7 3.5-.3 1.7-1.6 2.9-3.1 2.7-.5-.1-.9-.3-1.2-.7"/><path d="M11.1 12.6l-1.5 6"/></g></svg>'
};
const SITES = [
["youtube",/youtu\.?be/i,"YouTube"],["instagram",/instagram\.com/i,"Instagram"],
["facebook",/facebook\.com|fb\.watch|fb\.com/i,"Facebook"],["tiktok",/tiktok\.com/i,"TikTok"],
["x",/(?:\/\/|\.)x\.com|twitter\.com/i,"X"],["threads",/threads\.(net|com)/i,"Threads"],["spotify",/spotify\.com/i,"Spotify"],["mediafire",/mediafire\.com/i,"Mediafire"],["pinterest",/pinterest\.[a-z.]+\/|pin\.it/i,"Pinterest"]
];
const detect = u => SITES.find(s => s[1].test(u)) || null;
function nice(q){
q = String(q);
if (/^audio/i.test(q)) return "Audio only";
return q.replace(/_/g," ").replace(/\bhd\b/i,"HD").replace(/\bno watermark\b/i,"No watermark").replace(/^./,c=>c.toUpperCase());
}
function fmtSize(n){
if (typeof n !== "number") return n || "";
return n >= 1048576 ? (n/1048576).toFixed(1)+" MB" : Math.max(1,Math.round(n/1024))+" KB";
}
function fmtDur(d){
if (typeof d !== "number") return d || "";
const sec = Math.round(d > 1000 ? d/1000 : d);
return Math.floor(sec/60) + ":" + String(sec%60).padStart(2,"0");
}
function normalize(r){
const d = r.data || r.result || r;
const list = d.formats || d.links || d.medias || d.downloads || d.videos || (Array.isArray(d) ? d : []);
let formats = list.map(f => typeof f === "string" ? {label:"Video",type:"mp4",size:"",url:f} : ({
label: nice(f.quality || f.label || f.resolution || f.format || "Video"),
type: f.ext || f.extension || (f.type !== "video" && f.type !== "audio" ? f.type : "") || "mp4",
size: fmtSize(f.size || f.filesize || f.data_size || ""),
url: f.url || f.link || f.download_url
}));
const single = d.download_url || d.downloadUrl || d.video_url || d.videoUrl || d.video || d.url;
if (!formats.length && typeof single === "string") formats = [{label:"Video",type:"mp4",size:"",url:single}];
return { title: d.title || d.caption || "Video", thumbnail: d.thumbnail || d.thumb || d.cover || "", duration: fmtDur(d.duration), formats: formats.filter(f => f.url) };
}
const $ = id => document.getElementById(id);
const msg = (t, c) => { $("msg").textContent = t; $("msg").className = "msg " + (c || ""); };
Object.assign(IC, {
whatsapp:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25D366"/><path d="M12 5.2a6.8 6.8 0 0 0-5.8 10.3L5.2 18.8l3.4-.9A6.8 6.8 0 1 0 12 5.2z" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 8.9c.2-.4.5-.4.7-.3l.6 1.2c0 .2 0 .4-.2.6l-.3.4c.5 1 1.3 1.8 2.3 2.3l.4-.3c.2-.2.4-.2.6-.1l1.2.6c.2.1.2.4 0 .8-.3.7-1.2 1-2 .8-2.2-.6-3.9-2.3-4.4-4.4-.1-.6.1-1.1.1-1.6z" fill="#fff"/></svg>',
telegram:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#229ED9"/><path fill="#fff" d="M5.6 11.9l10.9-4.2c.5-.2.9.1.8.8l-1.9 8.7c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.3-.1L8.2 13l-2.8-.9c-.6-.2-.6-.6.2-.9z"/></svg>',
toolkit:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-2.2-.6-.6-2.2z"/></svg>',
portfolio:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18"/></svg>'
});
document.querySelectorAll("[data-ic]").forEach(e => e.innerHTML = IC[e.dataset.ic]);
$("slot").innerHTML = IC.link;
function setPlat(link){
const s = detect(link);
$("slot").innerHTML = s ? (IC[s[0]] || IC.link) : IC.link;
$("hint").textContent = s ? "Detected: " + s[2] : "";
}
$("url").addEventListener("input", e => setPlat(e.target.value));
const EP = "https://eliteprotech-apis.zone.id/download/";
(function () { // every request gets a timeout so the page never "fetches" forever; it stops counting once the reply starts
const _f = window.fetch.bind(window);
window.fetch = function (u, o) {
o = o || {};
if (o.signal) return _f(u, o);
const c = new AbortController(), t = setTimeout(() => c.abort(), o.timeout || 20000);
return _f(u, Object.assign({}, o, { signal: c.signal })).finally(() => clearTimeout(t));
};
})();
const why = e => (e && e.name === "AbortError") ? "timed out" : "blocked or offline";
const FREE = "https://freeapi.pro/api/alldl?url="; // primary API for every platform
const ALL = "https://allmediasaver.ftgmhacks.workers.dev/?url="; // TikTok fallback
// Browser-side fallback for YouTube/TikTok: used only when /api/download (the server) is not reachable.
// NOTE: this key is visible to anyone who opens the page. Deploying the whole project and relying on the server keeps it private.
const RAPID_KEY2 = "2c2a3756a8msh39767963d656be3p18cbc1jsn58e5136d96c4";
const YT_HOST = "youtube-media-downloader.p.rapidapi.com", TT_HOST = "tt-video-downloader1.p.rapidapi.com";
function normYT(j) {
const L = x => Array.isArray(x) ? x : (x && Array.isArray(x.items) ? x.items : []);
const vids = L(j.videos).filter(v => v && isUrl(v.url)), auds = L(j.audios).filter(a => a && isUrl(a.url));
if (!vids.length && !auds.length) return null;
const hOf = v => Number(v.height) || parseInt(v.quality) || 0;
vids.sort((a, b) => (b.hasAudio === true) - (a.hasAudio === true) || hOf(b) - hOf(a));
const medias = vids.map(v => { const q = v.quality || (hOf(v) ? hOf(v) + "p" : "Video"); return { url: v.url, quality: v.hasAudio === false ? q + " · no sound" : q, extension: String(v.extension || "mp4").toLowerCase(), type: "video", data_size: v.size || undefined }; });
const seen = new Set();
auds.sort((a, b) => (Number(b.size) || 0) - (Number(a.size) || 0)).forEach(a => { const e = String(a.extension || "m4a").toLowerCase(); if (seen.has(e)) return; seen.add(e); medias.push({ url: a.url, quality: "Audio only", extension: e, type: "audio", data_size: a.size || undefined }); });
const th = L(j.thumbnails).filter(t => t && isUrl(t.url)).sort((a, b) => (b.width || 0) - (a.width || 0))[0];
return { data: { title: j.title || "", thumbnail: th ? th.url : "", duration: Number(j.lengthSeconds || j.duration) || "", medias } };
}
const RAPID_KEY = "3116c68f86mshc5d8138b5269a15p17f0bajsne1cfdd6c8e8d"; // RapidAPI key (visible to anyone who opens this page)
const RAPID_FB = { name: "rapidapi-facebook", host: "facebook-media-downloader1.p.rapidapi.com", path: "/get_media", method: "POST" };
const RAPID_SP = { name: "rapidapi-spotify", host: "spotify-downloader9.p.rapidapi.com", path: "/tracks", ids: true };
const RAPID_PIN = { name: "rapidapi-pinterest", host: "pinterest-video-and-image-downloader.p.rapidapi.com", path: "/pinterest" };
const RAPID_IG = { name: "rapidapi-instagram", host: "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com", path: "/convert" };
const ROUTES = [
[/youtu\.?be/i, [{ free: true }, { server: true, fallback: 1 }, { ytdirect: true, fallback: 1 }]],
[/tiktok\.com/i, [{ free: true }, { server: true, fallback: 1 }, { twdirect: true, fallback: 1 }, { tkdirect: true, fallback: 2 }, { tmdirect: true, fallback: 3 }, { ttdirect: true, fallback: 4 }, { all: true, fallback: 5 }, { ep: "tiktok", fallback: 6 }]],
[/instagram\.com/i, [{ free: true }, { rapid: RAPID_IG, fallback: 1 }, { ep: "instagram", fallback: true }]],
[/facebook\.com|fb\.watch|fb\.com/i, [{ free: true }, { rapid: RAPID_FB, fallback: 1 }, { ep: "facebook", fallback: true }]],
[/(?:\/\/|\.)x\.com|twitter\.com/i, [{ free: true }, { ep: "x", fallback: 1 }]],
[/threads\.(net|com)/i, [{ free: true }, { ep: "threads", fallback: 1 }]],
[/spotify\.com/i, [{ free: true }, { rapid: RAPID_SP, kind: "audio", fallback: 1 }, { ep: "spotify", kind: "audio", fallback: true }]],
[/mediafire\.com/i, [{ free: true }, { ep: "mediafire", kind: "file", label: "File", fallback: 1 }]],
[/pinterest\.[a-z.]+\/|pin\.it/i, [{ free: true }, { rapid: RAPID_PIN, fallback: 1 }]]
];
const THUMB = /thumb|cover|poster|avatar|profile|icon|preview|banner/i;
const SKIP_KEY = /^(original_url|source|source_url|webpage_url|permalink|share_url|page_url|author_url|profile_url)$/i;
const IMG = /\.(jpe?g|png|webp|gif)(\?|#|$)/i, AUD = /\.(mp3|m4a|aac|ogg|opus|wav)(\?|#|$)/i, VID = /\.(mp4|webm|mov|mkv)(\?|#|$)/i;
const PAGE = /^https?:\/\/(?:[\w-]+\.)?tiktok\.com\/(?:@|t\/|[\w-]+\/?$|.*\/video\/)/i; // TikTok web-page links are not media files
const BAD = /^https?:\/\/[^\/]*webapp[^\/]*\.tiktok\.com\//i; // cookie-locked TikTok links: play as a broken video
const isUrl = v => typeof v === "string" && /^https?:\/\//i.test(v);
function walk(node, out, seen) {
if (Array.isArray(node)) return node.forEach(n => walk(n, out, seen));
if (!node || typeof node !== "object") return;
for (const [k, v] of Object.entries(node)) {
if (isUrl(v)) {
if (seen.has(v) || SKIP_KEY.test(k) || PAGE.test(v) || BAD.test(v)) continue;
if (k === "url" && Array.isArray(node.medias)) continue;
seen.add(v);
if (THUMB.test(k) && !VID.test(v) && !AUD.test(v)) out.thumbs.push(v); else out.items.push({ url: v, key: k, node });
} else if (v && typeof v === "object") walk(v, out, seen);
}
}
function first(node, keys, test) {
if (Array.isArray(node)) { for (const n of node) { const r = first(n, keys, test); if (r !== undefined) return r; } return; }
if (!node || typeof node !== "object") return;
for (const k of keys) if (k in node && test(node[k])) return node[k];
for (const v of Object.values(node)) if (v && typeof v === "object") { const r = first(v, keys, test); if (r !== undefined) return r; }
}
const prettyKey = k => String(k).replace(/[_\-]+/g, " ").replace(/^./, c => c.toUpperCase());
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
if (kind === "audio") label = "Audio only"; else if (kind === "image") label = "Image"; else if (kind === "file") label = "File";
else label = n.quality || n.resolution || n.label || (n.height ? n.height + "p" : "") || (/^(url|link|download|download_url|downloadurl|src|video|media|file)$/i.test(it.key) ? (route.label || "Video") : prettyKey(it.key));
out.media.push({ url: u, label: String(label), type: ext, size: n.data_size || n.size || n.filesize || "" });
}
}
async function callEp(r, link, diag) {
if (r.ytdirect) {
const m = link.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/|\/v\/)([A-Za-z0-9_-]{11})/);
if (!m) { diag.push("youtube → no video id in the link"); return null; }
for (const ua of ["proxied", "normal"]) { // proxied links work from any phone; normal links only work from the API server's IP
try {
const res = await fetch("https://" + YT_HOST + "/v2/video/details?videoId=" + m[1] + "&urlAccess=" + ua + "&videos=auto&audios=auto", { headers: { "x-rapidapi-host": YT_HOST, "x-rapidapi-key": RAPID_KEY2 }, timeout: 30000 });
if (res.ok) { const n = normYT(await res.json()); if (n) return n; diag.push("youtube-api(" + ua + ") → reply had no video links"); continue; }
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push("youtube-api(" + ua + ") → HTTP " + res.status + (t ? " " + t : ""));
} catch (e) { diag.push("youtube-api(" + ua + ") → " + why(e)); if (e.name !== "AbortError") throw new TypeError("blocked"); }
}
return null;
}
if (r.twdirect) {
try {
const res = await fetch("https://www.tikwm.com/api/?hd=1&url=" + encodeURIComponent(link));
if (!res.ok) { diag.push("tikwm → HTTP " + res.status); return null; }
const j = await res.json();
if (!j || j.code !== 0 || !j.data) { diag.push("tikwm → " + ((j && j.msg) || "no data")); return null; }
const d = j.data, abs = u => !u ? "" : /^https?:\/\//i.test(u) ? u : "https://www.tikwm.com" + (u[0] === "/" ? "" : "/") + u;
const medias = [];
if (d.hdplay) medias.push({ url: abs(d.hdplay), quality: "HD · No watermark", extension: "mp4", type: "video" });
if (d.play) medias.push({ url: abs(d.play), quality: "No watermark", extension: "mp4", type: "video" });
if (d.wmplay) medias.push({ url: abs(d.wmplay), quality: "With watermark", extension: "mp4", type: "video" });
const m = d.music_info && d.music_info.play ? d.music_info.play : d.music;
if (m) medias.push({ url: abs(m), quality: "Audio only", extension: "mp3", type: "audio" });
return medias.length ? { data: { title: d.title || "TikTok video", thumbnail: abs(d.cover || d.origin_cover), duration: d.duration || "", medias } } : null;
} catch (e) { diag.push("tikwm → " + why(e)); return null; }
}
if (r.tkdirect) {
try {
const res = await fetch("https://api.tiklydown.eu.org/api/download?url=" + encodeURIComponent(link));
if (res.ok) return await res.json();
diag.push("tiklydown → HTTP " + res.status);
return null;
} catch (e) { diag.push("tiklydown → " + why(e)); return null; }
}
if (r.tmdirect) {
try {
const res = await fetch("https://api.tikmate.app/api/lookup", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "url=" + encodeURIComponent(link) });
if (!res.ok) { diag.push("tikmate → HTTP " + res.status); return null; }
const d = await res.json();
if (!d || !d.success || !d.token || !d.id) { diag.push("tikmate → no token"); return null; }
const base = "https://tikmate.app/download/" + d.token + "/" + d.id + ".mp4";
return { data: { title: d.author_name ? "TikTok · " + d.author_name : "TikTok video", medias: [{ url: base + "?hd=1", quality: "HD", extension: "mp4", type: "video" }, { url: base, quality: "No watermark", extension: "mp4", type: "video" }] } };
} catch (e) { diag.push("tikmate → " + why(e)); return null; }
}
if (r.ttdirect) {
try {
const fd = new FormData(); fd.append("url", link);
const res = await fetch("https://" + TT_HOST + "/index.php", { method: "POST", headers: { "x-rapidapi-host": TT_HOST, "x-rapidapi-key": RAPID_KEY2 }, body: fd });
if (res.ok) return await res.json();
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push("tiktok-api → HTTP " + res.status + (t ? " " + t : ""));
return null;
} catch (e) { diag.push("tiktok-api → " + why(e)); if (e.name === "AbortError") return null; throw new TypeError("blocked"); }
}
if (r.server) {
try {
const res = await fetch(PROXY_BASE + "/download?url=" + encodeURIComponent(link), { timeout: 45000 });
if (res.ok) { viaProxy = true; return await res.json(); }
let t = ""; try { t = ((await res.json()).error || "").slice(0, 110); } catch (e) {}
diag.push(res.status === 404 ? "server → HTTP 404: /api/download not found. Upload the WHOLE project (api folder + index.html + server.js) to Vercel, not only index.html" : "server → HTTP " + res.status + (t ? " " + t : ""));
return null;
} catch (e) { diag.push(e && e.name === "AbortError" ? "server → timed out" : "server → not reachable (deploy on Vercel or run node server.js)"); return null; }
}
if (r.free) {
try {
const res = await fetch(FREE + encodeURIComponent(link), { timeout: 30000 });
if (res.ok) return await res.json();
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push("freeapi → HTTP " + res.status + (t ? " " + t : ""));
return null;
} catch (e) { diag.push("freeapi → " + why(e)); if (e.name === "AbortError") return null; throw new TypeError("blocked"); }
}
if (r.all) {
try {
const res = await fetch(ALL + encodeURIComponent(link));
if (res.ok) return await res.json();
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push("allmediasaver → HTTP " + res.status + (t ? " " + t : ""));
return null;
} catch (e) { diag.push("allmediasaver → " + why(e)); if (e.name === "AbortError") return null; throw new TypeError("blocked"); }
}
if (r.rapid) {
try {
let url = "https://" + r.rapid.host + r.rapid.path;
const headers = { "x-rapidapi-host": r.rapid.host, "x-rapidapi-key": RAPID_KEY };
const init = { headers };
if (r.rapid.ids) {
const m = link.match(/track[\/:]([A-Za-z0-9]{22})/);
if (!m) { diag.push(r.rapid.name + " → no track id in the link (use a spotify.com/track/... link)"); return null; }
url += "?ids=" + m[1];
} else if (r.rapid.method === "POST") {
init.method = "POST"; headers["Content-Type"] = "application/json"; init.body = JSON.stringify({ url: link });
} else url += "?url=" + encodeURIComponent(link);
const res = await fetch(url, init);
if (res.ok) return await res.json();
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push(r.rapid.name + " → HTTP " + res.status + (t ? " " + t : ""));
return null;
} catch (e) { diag.push(r.rapid.name + " → " + why(e)); if (e.name === "AbortError") return null; throw new TypeError("blocked"); }
}
let net = true;
for (const p of ["url", "link"]) {
try {
const res = await fetch(EP + r.ep + "?" + p + "=" + encodeURIComponent(link)); net = false;
if (res.ok) return await res.json();
let t = ""; try { t = (await res.text()).replace(/\s+/g, " ").slice(0, 110); } catch (e) {}
diag.push(r.ep + "?" + p + "= → HTTP " + res.status + (t ? " " + t : ""));
} catch (e) { diag.push(r.ep + "?" + p + "= → " + why(e)); if (e.name === "AbortError") net = false; }
}
if (net) throw new TypeError("blocked");
return null;
}
async function loadMedia(link) {
const routes = (ROUTES.find(r => r[0].test(link)) || [null, []])[1];
if (!routes.length) throw new Error("This site isn’t supported yet. Try YouTube, TikTok, Instagram, Facebook, X, Threads, Spotify, Mediafire or Pinterest.");
const out = { media: [], thumbs: [], title: "", duration: "" };
const diag = [];
let blocked = false; viaProxy = false;
const run = async list => {
const done = await Promise.all(list.map(async r => { try { return { r, j: await callEp(r, link, diag) }; } catch (e) { blocked = true; return { r, j: null }; } }));
done.forEach(({ r, j }) => {
if (!j) return;
const before = out.media.length;
gather(out, j, r, link);
if (out.media.length === before) diag.push((r.ep || (r.rapid && r.rapid.name) || (r.free ? "freeapi" : r.server ? "server" : r.ytdirect ? "youtube-api" : r.twdirect ? "tikwm" : r.tmdirect ? "tikmate" : r.ttdirect ? "tiktok-api" : "allmediasaver")) + " → reply had no links: " + JSON.stringify(j).slice(0, 140));
});
};
await run(routes.filter(r => !r.fallback));
const hasVid = () => routes.some(r => r.kind) ? out.media.length > 0 : out.media.some(m => !/^(audio|image|file)/i.test(m.label));
for (const tier of [1, 2, 3, 4, 5, 6]) { if (hasVid()) break; await run(routes.filter(r => r.fallback && (r.fallback === true ? 1 : r.fallback) === tier)); }
if (!out.media.length && PROXY_BASE && !routes.some(r => r.server)) {
try { const r = await fetch(PROXY_BASE + "/download?url=" + encodeURIComponent(link)); if (r.ok) { gather(out, await r.json(), {}, link); viaProxy = out.media.length > 0; } else diag.push("proxy → HTTP " + r.status); } catch (e) { diag.push("proxy → not reachable"); }
}
if (!out.media.length) throw new Error((blocked ? "Could not reach the API. The browser blocked the request (CORS) or you are offline." : "No downloadable media found for this link.") + (diag.length ? "  Details: " + diag.join(" | ") : ""));
return { title: out.title || "Video", thumbnail: out.thumbs[0] || "", duration: fmtDur(out.duration), formats: out.media.map((m, i) => ({ m, i, k: /^image/i.test(m.label) ? 3 : /^file/i.test(m.label) ? 2 : /^audio/i.test(m.label) ? 1 : 0 })).sort((a, b) => a.k - b.k || (/no sound/i.test(a.m.label) - /no sound/i.test(b.m.label)) || a.i - b.i).map(({ m }) => ({ label: nice(m.label), type: m.type, size: fmtSize(m.size), url: m.url })) };
}
let proxyOK;
function proxyAlive() {
if (!PROXY_BASE) return Promise.resolve(false);
if (proxyOK === true) return Promise.resolve(true); // only cache success, so one failed ping doesn't disable saving for the whole visit
const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 8000);
return fetch(PROXY_BASE + "/file?ping=1&_=" + Date.now(), { signal: ac.signal })
.then(r => r.text().then(t => ({ s: r.status, t: t.trim() })))
.then(({ s, t }) => { if (t === "ok") { proxyOK = true; return true; } console.warn("Save proxy ping failed: HTTP " + s + " (is the api/file.js function deployed?)"); return false; })
.catch(e => { console.warn("Save proxy ping error:", e); return false; })
.finally(() => clearTimeout(tm));
}
async function proxyCanServe(o) { // ask the save server for 1 byte; only a real video/audio answer (206/200, not a page) passes
try {
const r = await fetch(o.href, { headers: { Range: "bytes=0-0" }, timeout: 20000 });
const t = r.headers.get("content-type") || "";
if (r.body) { try { await r.body.cancel(); } catch (e) {} }
return (r.status === 206 || r.status === 200) && !/^(text\/|application\/json)/i.test(t);
} catch (e) { return false; }
}
async function saveFile(o, btn) {
const label = btn.textContent;
btn.style.pointerEvents = "none";
try {
if (await proxyAlive() && await proxyCanServe(o)) { // checked first, so an error text is never saved as a tiny .html file
const x = document.createElement("a"); x.href = o.href; x.download = o.fname; document.body.append(x); x.click(); x.remove();
msg("Download started.", "ok"); return;
}
btn.textContent = "Downloading…";
const r = await fetch(o.f.url);
if (!r.ok) throw new Error("HTTP " + r.status);
const total = +r.headers.get("content-length") || 0, chunks = [];
if (r.body && r.body.getReader) {
const rd = r.body.getReader(); let got = 0;
for (;;) { const { done, value } = await rd.read(); if (done) break; chunks.push(value); got += value.length; if (total) btn.textContent = "Downloading " + Math.round(got * 100 / total) + "%"; }
} else chunks.push(new Uint8Array(await r.arrayBuffer()));
const blob = new Blob(chunks, { type: r.headers.get("content-type") || "application/octet-stream" });
const u = URL.createObjectURL(blob), x = document.createElement("a");
x.href = u; x.download = o.fname; document.body.append(x); x.click(); x.remove();
setTimeout(() => URL.revokeObjectURL(u), 60000);
msg("Download started.", "ok");
} catch (e) {
if (PAGE.test(o.f.url) || /(^|\.)tiktok\.com$/i.test(new URL(o.f.url).hostname)) { msg("Could not download this video. Please try again.", "err"); return; }
if (/(^|\.)googlevideo\.com$/i.test(new URL(o.f.url).hostname)) { const x = document.createElement("a"); x.href = o.f.url; x.target = "_blank"; x.rel = "noopener"; document.body.append(x); x.click(); x.remove(); msg(""); return; }
window.open(o.f.url, "_blank", "noopener");
msg("Direct saving isn’t available right now, so the video opened in a new tab. There, tap the ⋮ menu on the player and choose Download.", "err");
} finally { btn.textContent = label; btn.style.pointerEvents = ""; }
}
async function fetchVideo(){
const link = $("url").value.trim();
$("result").hidden = true;
if (!/^https?:\/\/.+\..+/i.test(link)) { msg("Enter a valid link starting with http:// or https://", "err"); return; }
$("go").disabled = true; $("go").textContent = "Loading…"; $("skel").hidden = false; msg("");
try {
const v = await loadMedia(link);
render(v);
msg("Ready. Choose a quality.", "ok");
} catch (e) {
msg(e.message, "err");
} finally {
$("go").disabled = false; $("go").textContent = "Get video"; $("skel").hidden = true;
}
}
function render(v){
$("title").textContent = v.title; $("meta").textContent = v.duration;
const box = $("formats"); box.textContent = "";
const row = document.createElement("div"); row.className = "pick";
const sel = document.createElement("select"); sel.className = "sel"; sel.setAttribute("aria-label", "Choose quality");
const info = v.formats.map(f => {
const ext = (f.type && /^[a-z0-9]{2,4}$/i.test(f.type)) ? f.type : (/audio/i.test(f.label) ? "mp3" : "mp4");
const fname = (String(v.title || "video").replace(/[^\w\- ]+/g, "").trim().slice(0, 40) || "video") + "." + ext;
return { f, href: PROXY_BASE + "/file?u=" + encodeURIComponent(f.url) + "&n=" + encodeURIComponent(fname), fname };
});
info.forEach((o, i) => {
const opt = document.createElement("option"); opt.value = i;
opt.textContent = o.f.label + " • " + [o.f.type, o.f.size].filter(Boolean).join(" • ");
sel.append(opt);
});
const pl = $("player");
const playSrc = o => PROXY_BASE ? PROXY_BASE + "/file?inline=1&u=" + encodeURIComponent(o.f.url) : o.f.url;
const isVid = o => !/^(audio|image|file)/i.test(o.f.label);
const noSnd = o => /no sound/i.test(o.f.label);
let cur = info.findIndex(o => isVid(o) && !noSnd(o)); if (cur < 0) cur = info.findIndex(isVid);
if (cur > 0) sel.value = cur;
pl.pause(); pl.removeAttribute("src");
pl.hidden = cur < 0; pl.parentNode.hidden = cur < 0;
pl.onerror = () => { if (PROXY_BASE && cur >= 0 && !pl.dataset.fb) { pl.dataset.fb = "1"; pl.src = playSrc(info[cur]); pl.load(); } };
delete pl.dataset.fb;
if (cur >= 0) { pl.poster = v.thumbnail || ""; pl.src = info[cur].f.url; pl.load(); }
const acts = document.createElement("div"); acts.className = "acts";
const c = document.createElement("button"); c.type = "button"; c.className = "cp"; c.textContent = "Copy link";
const a = document.createElement("a"); a.className = "dl"; a.textContent = "Download"; a.target = "_blank"; a.rel = "noopener";
const note = document.createElement("p"); note.className = "muted"; note.style.cssText = "margin:10px 2px 0;font-size:13px";
function sync(){ const o = info[sel.value]; a.href = o.f.url; a.setAttribute("download", o.fname); note.textContent = noSnd(o) ? "This quality has no sound (YouTube keeps HD video and audio separate). Pick a quality without “no sound”, or save Audio only." : ""; note.hidden = !note.textContent; }
sel.onchange = () => { sync(); const o = info[sel.value]; if (isVid(o) && info.indexOf(o) !== cur) { cur = info.indexOf(o); const t = pl.currentTime; delete pl.dataset.fb; pl.src = o.f.url; pl.load(); pl.addEventListener("loadedmetadata", () => { try { pl.currentTime = t; } catch (e) {} }, {once:true}); } };
sync();
a.onclick = e => { e.preventDefault(); saveFile(info[sel.value], a); };
c.onclick = async () => { try { await navigator.clipboard.writeText(info[sel.value].f.url); msg("Link copied.", "ok"); } catch (e) { msg("Couldn’t copy. Long-press the Download button instead.", "err"); } };
acts.append(c, a); row.append(sel, acts); box.append(row, note);
$("result").hidden = false;
}
(function(){
if (matchMedia("(hover:hover)").matches) document.querySelectorAll(".card").forEach(c => c.addEventListener("pointermove", e => {
const r = c.getBoundingClientRect();
c.style.setProperty("--mx", (e.clientX - r.left) + "px");
c.style.setProperty("--my", (e.clientY - r.top) + "px");
}));
if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.1});
document.querySelectorAll(".hc,.card,.band").forEach(el => {
if (el.getBoundingClientRect().top > innerHeight * .9) { el.classList.add("rv"); io.observe(el); }
});
})();
(function(){
const h = document.querySelector(".hero h1"), a = h.querySelector(".nm"), b = h.querySelector(".sub");
function fit(){
a.style.fontSize = "";
const fs = parseFloat(getComputedStyle(b).fontSize);
a.style.fontSize = fs + "px";
const wa = a.getBoundingClientRect().width, wb = b.getBoundingClientRect().width;
if (wa > 0) a.style.fontSize = (fs * wb / wa) + "px";
}
fit(); addEventListener("resize", fit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
(function(){
const b = $("burger"), s = $("side"), sc = $("scrim"), x = $("sclose");
function set(o){
s.classList.toggle("open", o); sc.classList.toggle("open", o);
b.setAttribute("aria-expanded", o); s.setAttribute("aria-hidden", !o);
document.documentElement.style.overflow = o ? "hidden" : "";
setTimeout(() => (o ? x : b).focus({preventScroll:true}), 60);
}
b.onclick = () => set(true); x.onclick = () => set(false); sc.onclick = () => set(false);
s.querySelectorAll("a").forEach(a => a.addEventListener("click", () => set(false)));
addEventListener("keydown", e => { if (e.key === "Escape" && s.classList.contains("open")) set(false); });
})();
$("go").onclick = fetchVideo;
$("url").addEventListener("keydown", e => { if (e.key === "Enter") fetchVideo(); });
$("paste").onclick = async () => {
try { $("url").value = await navigator.clipboard.readText(); setPlat($("url").value); fetchVideo(); }
catch (e) { msg("Clipboard isn’t available. Paste the link manually.", "err"); }
};
$("demo").onclick = () => {
render({title:"Example: sunrise timelapse", duration:"0:42 • sample only",
thumbnail:"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'><rect width='16' height='9' fill='%23222'/><path d='M7 3l3.5 1.5L7 6z' fill='%23fff'/></svg>",
formats:[{label:"1080p",type:"mp4",size:"18 MB",url:"#"},{label:"720p",type:"mp4",size:"9 MB",url:"#"},{label:"Audio only",type:"mp3",size:"1 MB",url:"#"}]});
msg("This is a sample. Real results appear after you paste a link.", "ok");
};
