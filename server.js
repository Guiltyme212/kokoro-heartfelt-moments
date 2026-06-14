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

const app = express();
const DIST = path.join(__dirname, "dist");

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

// Everything else: real static files (css, mp4, images, .html).
// `extensions: ['html']` lets /foo resolve to /foo.html automatically.
app.use(express.static(DIST, { extensions: ["html"], index: "index.html" }));

// Unknown path → land on the homepage rather than dead-ending.
app.use((req, res) => res.status(404).sendFile(path.join(DIST, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kokoro site listening on :${PORT}`));
