# Kokoro — Landing Page

A small, static landing page for [Kokoro](https://kokoro.app) — the tanuki-monk meditation app.

## What's in here

```
dist/
├── index.html               ← the page
├── colors_and_type.css      ← design-system tokens + Google Fonts @import
├── BRAND.md                 ← tone-of-voice / brand source-of-truth
└── assets/                  ← all images + mascot videos
    ├── *.png                ← ornaments + video posters
    └── *.mp4                ← mascot videos (baked on cream, blend with mix-blend-mode: multiply)
```

Nothing is bundled or built — open `index.html` in a browser and it works.

## Run locally

```bash
# any static server will do
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

> The videos won't autoplay if you open `index.html` via `file://` in some browsers — use a local server.

## Dependencies

- **Google Fonts** (Fredoka, M PLUS Rounded 1c, Noto Sans JP, Instrument Serif, JetBrains Mono) — loaded via `@import` in `colors_and_type.css`. Internet required at first paint.
- No JS frameworks. No build step. The only inline `<script>` is for the petal animation.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "kokoro landing"
git branch -M main
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

Then enable Pages in repo settings → Source: `main`, root.

## Deploy to Vercel / Netlify / Cloudflare Pages

Drop the folder in. No build command, output dir is `.` (or `dist/` if you keep this structure).

## Editing the page

- **Copy**: lives directly in `index.html` — search for the section by `data-screen-label` (e.g. `02 Hero`, `04 Friends`).
- **Colors & type**: change tokens in `colors_and_type.css`. The `:root { --cream, --moss, --sunset, --mustard, ... }` block controls the whole page.
- **Mascot videos**: the cream blending technique is documented inline in the CSS. The short version:
  - Page background must be cream (`#FCF0DB`) — the videos are baked on this exact color.
  - Video gets `mix-blend-mode: multiply`.
  - Wrapper gets a soft `mask-image` to dissolve the rectangle edges.
  - **Do NOT** put `mix-blend-mode` on the wrapper or `mask-image` on the video — compositing breaks if you swap them.

## Brand tone

See `BRAND.md`. Short version: Kokoro is a small tanuki-monk who lived in a mountain temple and now lives in your phone. He's the curator — his **friends** (Gen Z Raw, Spiritual Cosmic, Drift Bedtime) do the actual meditations.

He doesn't say *soul, energy, vibrations, healing, light within, universe, flow, chakra*. He doesn't quote Buddha. He doesn't give advice. He's quiet, dry, occasionally funny.

## Replacing store links

The App Store and TestFlight buttons currently link to `#`. Search `aria-label="Download on the App Store"` and `aria-label="Try the TestFlight beta"` and set the real URLs.

---

Made with care. The mascot mp4s are not transparent — they're cream-on-cream magic.
