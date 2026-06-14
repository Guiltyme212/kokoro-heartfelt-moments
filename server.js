// Tiny static server for the Kokoro site, for hosting on Railway.
//
// Why this exists: the site is static HTML/CSS/JS (built into ./dist by
// `bun run build`). Lovable's host could only serve bare URLs as a download,
// so we were forced into 301 redirects that rewrite the address bar to
// `/funnel/standard/index.html`. This server instead serves the real .html
// with a 200 *rewrite*, so the clean URL (`/funnel/standard`) stays in the bar.
//
// Keep this file boring. It serves files — nothing else lives here yet.
// (Later phases add /api/meta-capi and /api/create-checkout-session.)

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const DIST = path.join(__dirname, "dist");

/* ============================================================
   Meta Conversions API + Stripe webhook
   Ported from the Supabase edge fn so tracking lives on our own
   server. Browser pixel fires each event AND posts to /api/meta-capi
   with a shared event_id; Meta dedupes by (event_name, event_id).
   The Stripe webhook fires a SERVER-CONFIRMED Purchase keyed to the
   Stripe session id, which the browser thank-you page reuses as its
   eventID — so the two dedupe instead of double-counting.
   ============================================================ */
const GRAPH_VERSION = "v21.0";
const META_DATASET_ID = "1318180623856061";
const ALLOWED_EVENTS = new Set([
  "PageView", "ViewContent", "Lead",
  "InitiateCheckout", "AddPaymentInfo", "Purchase", "StartTrial",
]);
const ORIGIN_ALLOWLIST = [
  "https://kokoromind.com",
  "https://www.kokoromind.com",
  "https://kokoro-website-production.up.railway.app",
  "https://kokoro-heartfelt-moments.lovable.app",
];
function sha256(v) { return crypto.createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex"); }
function setCors(req, res) {
  const o = req.headers.origin || "";
  res.set("Access-Control-Allow-Origin", ORIGIN_ALLOWLIST.includes(o) ? o : ORIGIN_ALLOWLIST[0]);
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "content-type");
  res.set("Vary", "Origin");
}
async function sendToMeta(event) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { ok: false, status: 500, meta: { error: "META_CAPI_TOKEN not configured" } };
  const payload = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${META_DATASET_ID}/events?access_token=${token}`;
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
  const text = await res.text();
  let meta; try { meta = JSON.parse(text); } catch { meta = text; }
  return { ok: res.status === 200, status: res.status, meta };
}

// Browser CAPI bridge endpoint (same-origin POST from the funnel pages).
app.options("/api/meta-capi", (req, res) => { setCors(req, res); res.status(204).end(); });
app.post("/api/meta-capi", express.text({ type: () => true, limit: "32kb" }), async (req, res) => {
  setCors(req, res);
  let body; try { body = JSON.parse(req.body || "{}"); } catch { return res.status(400).json({ error: "bad json" }); }
  if (!body || !ALLOWED_EVENTS.has(body.event_name)) return res.status(422).json({ error: "invalid event_name" });
  if (!body.event_id) return res.status(422).json({ error: "missing event_id" });
  const user_data = { client_user_agent: req.headers["user-agent"] || "" };
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress;
  if (ip) user_data.client_ip_address = ip;
  if (body.email) user_data.em = [sha256(body.email)];
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;
  const event = {
    event_name: body.event_name,
    event_time: Number(body.event_time) || Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    action_source: "website",
    event_source_url: body.event_source_url,
    user_data,
    custom_data: body.custom_data || {},
  };
  try { const r = await sendToMeta(event); return res.status(200).json({ ok: r.ok, meta_status: r.status, meta: r.meta }); }
  catch (e) { return res.status(502).json({ error: "meta fetch failed", detail: String(e) }); }
});

// Stripe webhook → server-confirmed Purchase/StartTrial (authoritative, deduped by session id).
app.post("/api/stripe-webhook", express.raw({ type: () => true, limit: "1mb" }), async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(500).send("webhook secret not configured");
  const sig = req.headers["stripe-signature"] || "";
  const parts = Object.fromEntries(sig.split(",").map((kv) => kv.split("=")));
  const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body || "");
  if (!parts.t || !parts.v1) return res.status(400).send("bad signature header");
  const expected = crypto.createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest("hex");
  let valid = false; try { valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1)); } catch { valid = false; }
  if (!valid) return res.status(400).send("signature mismatch");
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(parts.t)) > 300) return res.status(400).send("stale");
  let evt; try { evt = JSON.parse(raw); } catch { return res.status(400).send("bad json"); }
  res.status(200).json({ received: true }); // ack immediately, then process
  try {
    if (evt.type === "checkout.session.completed") {
      const s = evt.data.object || {};
      const md = s.metadata || {};
      const isTrial = md.plan === "trial" || s.amount_total === 0;
      const user_data = {};
      const email = (s.customer_details && s.customer_details.email) || s.customer_email || md.email || "";
      if (email) user_data.em = [sha256(email)];
      if (md.fbp) user_data.fbp = md.fbp;
      if (md.fbc) user_data.fbc = md.fbc;
      await sendToMeta({
        event_name: isTrial ? "StartTrial" : "Purchase",
        event_time: Number(s.created) || Math.floor(Date.now() / 1000),
        event_id: s.id, // matches the browser thank-you page's eventID (session_id) → dedup
        action_source: "website",
        event_source_url: md.source_url || "https://kokoromind.com/funnel/standard/",
        user_data,
        custom_data: { value: isTrial ? 0 : (s.amount_total != null ? s.amount_total / 100 : 0), currency: (s.currency || "usd").toUpperCase(), content_name: md.plan || "" },
      });
    }
  } catch (e) { console.error("stripe-webhook processing error:", e); }
});

// Clean-URL rewrites — mirror of public/_redirects, but as internal 200
// rewrites (not 301s), so the URL the visitor typed stays put.
const REWRITES = {
  // funnel + A/B variants
  "/funnel": "/funnel/index.html",
  "/funnel/standard": "/funnel/standard/index.html",
  "/funnel/express": "/funnel/express/index.html",
  "/funnel/trial": "/funnel/trial/index.html",
  "/funnel/deep": "/funnel/deep/index.html",
  "/funnel/value": "/funnel/value/index.html",
  // short ad links (kokoromind.com/trial, etc.)
  "/standard": "/funnel/standard/index.html",
  "/express": "/funnel/express/index.html",
  "/trial": "/funnel/trial/index.html",
  "/deep": "/funnel/deep/index.html",
  "/value": "/funnel/value/index.html",
  // standalone pages
  "/start": "/start.html",
  "/help": "/help.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
  "/pitch": "/pitch.html",
};

app.use((req, res, next) => {
  const clean = req.path.length > 1 ? req.path.replace(/\/+$/, "") : req.path;
  const target = REWRITES[clean];
  if (target) return res.sendFile(path.join(DIST, target));
  next();
});

// Lightweight health check (Railway can ping it; also proves deploys land).
app.get("/healthz", (req, res) => res.type("text").send("ok"));

// Everything else: real static files (css, mp4, images, .html).
// `extensions: ['html']` lets /foo resolve to /foo.html automatically.
app.use(express.static(DIST, { extensions: ["html"], index: "index.html" }));

// Unknown path → land on the homepage rather than dead-ending.
app.use((req, res) => res.status(404).sendFile(path.join(DIST, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kokoro site listening on :${PORT}`));
