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
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), signal: ctl.signal });
    const text = await res.text();
    let meta; try { meta = JSON.parse(text); } catch { meta = text; }
    return { ok: res.status === 200, status: res.status, meta };
  } catch (e) {
    return { ok: false, status: 0, meta: { error: "meta fetch failed", detail: String(e) } };
  } finally { clearTimeout(timer); }
}
const processedSessions = new Set(); // webhook idempotency (in-memory; Meta also dedupes by event_id)

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
// Collect the raw body manually — Stripe signs exact bytes, and this is more reliable than
// express.raw's content-type matching for signature verification.
function collectRawBody(req, res, next) {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => { req.rawBody = Buffer.concat(chunks).toString("utf8"); next(); });
  req.on("error", () => res.status(400).send("body read error"));
}
app.post("/api/stripe-webhook", collectRawBody, async (req, res) => {
  const secret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  if (!secret) return res.status(500).send("webhook secret not configured");
  const sig = req.headers["stripe-signature"] || "";
  const t = (sig.match(/(?:^|,)t=([^,]+)/) || [])[1];
  const v1s = sig.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  const raw = req.rawBody || "";
  if (!t || v1s.length !== 1) return res.status(400).send("bad signature header");
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  let valid = false; try { valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1s[0])); } catch { valid = false; }
  if (!valid) return res.status(400).send("signature mismatch");
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(t)) > 300) return res.status(400).send("stale");
  let evt; try { evt = JSON.parse(raw); } catch { return res.status(400).send("bad json"); }

  // Process BEFORE acking, so a failed Meta relay returns non-2xx and Stripe retries.
  if (evt.type !== "checkout.session.completed") return res.status(200).json({ received: true, ignored: evt.type });
  const s = evt.data.object || {};
  if (s.id && processedSessions.has(s.id)) return res.status(200).json({ received: true, duplicate: true });
  const md = s.metadata || {};
  const isTrial = md.plan === "trial" || s.amount_total === 0;
  const user_data = {};
  const email = (s.customer_details && s.customer_details.email) || s.customer_email || md.email || "";
  if (email) user_data.em = [sha256(email)];
  if (md.fbp) user_data.fbp = md.fbp;
  if (md.fbc) user_data.fbc = md.fbc;
  const r = await sendToMeta({
    event_name: isTrial ? "StartTrial" : "Purchase",
    event_time: Number(s.created) || Math.floor(Date.now() / 1000),
    event_id: s.id, // matches the browser thank-you page's eventID (session_id) → dedup
    action_source: "website",
    event_source_url: md.source_url || "https://kokoromind.com/funnel/standard/",
    user_data,
    custom_data: { value: isTrial ? 0 : (s.amount_total != null ? s.amount_total / 100 : 0), currency: (s.currency || "usd").toUpperCase(), content_name: md.plan || "" },
  });
  if (!r.ok) {
    console.error("stripe-webhook: Meta relay failed", s.id, r.status, JSON.stringify(r.meta));
    return res.status(502).json({ received: false, meta_status: r.status }); // non-2xx → Stripe retries
  }
  if (s.id) { processedSessions.add(s.id); if (processedSessions.size > 5000) processedSessions.clear(); }
  return res.status(200).json({ received: true });
});

// Embedded Stripe Checkout — create a Session and return its client_secret so the
// funnel can mount checkout ON-PAGE (no redirect). Falls back to hosted Payment Links
// client-side if this is unavailable, so checkout never breaks.
const CO_PRICES = { yearly: "price_1TgcDpCk0y2TzYnT1fLLwLwo", monthly: "price_1TgcDrCk0y2TzYnTu7DoGcqw", weekly: "price_1TgcDsCk0y2TzYnT1lBqIhrT" };
const CO_VALUES = { yearly: "39.99", monthly: "14.99", weekly: "6.99" };
app.post("/api/create-checkout-session", express.json({ limit: "16kb" }), async (req, res) => {
  setCors(req, res);
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) return res.status(500).json({ error: "stripe key not configured" });
  const b = req.body || {};
  const plan = CO_PRICES[b.plan] ? b.plan : "yearly";
  const value = CO_VALUES[plan];
  const form = {
    "mode": "subscription",
    "ui_mode": "embedded",
    "line_items[0][price]": CO_PRICES[plan],
    "line_items[0][quantity]": "1",
    "return_url": `https://kokoromind.com/funnel/standard/thanks.html?plan=${plan}&value=${value}&cur=USD&session_id={CHECKOUT_SESSION_ID}`,
    "metadata[plan]": plan,
    "metadata[value]": value,
    "metadata[source_url]": typeof b.source_url === "string" ? b.source_url.slice(0, 300) : "",
  };
  if (b.email && /.+@.+\..+/.test(b.email)) { form["customer_email"] = b.email; form["metadata[email]"] = b.email; }
  if (b.fbp) form["metadata[fbp]"] = String(b.fbp).slice(0, 200);
  if (b.fbc) form["metadata[fbc]"] = String(b.fbc).slice(0, 200);
  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { "Authorization": "Basic " + Buffer.from(key + ":").toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(form).toString(),
    });
    const j = await r.json();
    if (!r.ok) { console.error("create-checkout-session:", j.error); return res.status(502).json({ error: (j.error && j.error.message) || "stripe error" }); }
    return res.json({ client_secret: j.client_secret });
  } catch (e) { return res.status(502).json({ error: "stripe fetch failed" }); }
});

// Funnel clean URLs → redirect to the real trailing-slash DIRECTORY.
// A 200 rewrite-in-place keeps the slash-less URL, so the page's RELATIVE asset
// paths (quiz-flow.js, etc.) resolve against the wrong folder (e.g. /funnel/standard
// loads /funnel/quiz-flow.js — the stale root file). Redirecting to the directory
// form makes relative paths resolve correctly, and express.static serves index.html.
const DIR_REDIRECTS = {
  "/funnel": "/funnel/",
  "/funnel/standard": "/funnel/standard/",
  "/funnel/express": "/funnel/express/",
  "/funnel/trial": "/funnel/trial/",
  "/funnel/deep": "/funnel/deep/",
  "/funnel/value": "/funnel/value/",
  // short ad links (kokoromind.com/trial, etc.) → canonical funnel directory
  "/standard": "/funnel/standard/",
  "/express": "/funnel/express/",
  "/trial": "/funnel/trial/",
  "/deep": "/funnel/deep/",
  "/value": "/funnel/value/",
};
// Standalone root-level pages — safe to serve in place (relative paths resolve to root).
const PAGE_REWRITES = {
  "/start": "/start.html",
  "/help": "/help.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
  "/pitch": "/pitch.html",
};

app.use((req, res, next) => {
  const clean = req.path.length > 1 ? req.path.replace(/\/+$/, "") : req.path;
  const dir = DIR_REDIRECTS[clean];
  if (dir) {
    if (req.path === dir) return next();            // already at canonical dir URL → let static serve it
    return res.redirect(302, dir);                  // 302 during migration; can become 301 once stable
  }
  const page = PAGE_REWRITES[clean];
  if (page) return res.sendFile(path.join(DIST, page));
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
