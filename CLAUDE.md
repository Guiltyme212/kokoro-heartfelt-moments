# Kokoro — Website / Funnel (CLAUDE.md)

This repo is the **marketing + conversion website** for **Kokoro**, a personalized-meditation iOS app
(currently in TestFlight). The site's job is two things:

1. **Drive installs** — the landing page sends people to TestFlight / the App Store.
2. **Convert** — a quiz funnel that personalizes, captures an email, and sells a subscription via Stripe.

It is edited both **in Lovable** (quick changes, in-browser) and **in VS Code via Claude** (deeper work).
Both commit to the same GitHub repo. See [Working with Lovable](#working-with-lovable-important) below.

---

## 🟡 Golden rule: keep it static vanilla

This is a **static HTML / CSS / JS site**. There is **no React, no JSX, no build framework, no components.**
`.lovable/plan.md` says it explicitly: *"Keep this as static HTML/JS/CSS. Do NOT convert it to React/JSX or
split it into components. The flow runs on vanilla JS; converting it breaks the screen transitions and the
video logic."*

Match the existing style: hand-written HTML, CSS in `<style>` blocks + `colors_and_type.css` design tokens,
and plain DOM JS. No new dependencies unless we discuss it first.

---

## Repo map

| Path | What it is |
|------|------------|
| `index.html` | **Landing page.** Hero, sections, testimonials. Copy is inline HTML. CTAs → TestFlight. |
| `public/funnel/index.html` | Quiz funnel **shell** (phone frame + screen container). |
| `public/funnel/quiz-data.js` | Quiz **content** — `window.STEPS` (35 steps) + `window.SECTIONS`. **Edit copy here.** |
| `public/funnel/quiz-flow.js` | Quiz **engine** — renders steps, handles interactions, tracking, Stripe handoff. |
| `public/funnel/thanks.html` | Post-Stripe **conversion page**. Fires Purchase / StartTrial. |
| `start.html` | Earlier/alternate short onboarding (5 screens, vanilla JS). |
| `pitch.html` `help.html` `privacy.html` `terms.html` | Standalone pages. |
| `colors_and_type.css` | **Design tokens** — colors, type, spacing, radii. Shared by every page. |
| `public/_redirects` | Clean-URL redirects (`/funnel` → `/funnel/index.html`, etc.). |
| `assets/` | Images + mascot `.mp4` videos (baked on cream `#FCF0DB`, composited with `mix-blend-mode: multiply`). |
| `BRAND.md` | **Brand voice / character bible. Read before writing any user-facing copy.** |
| `.lovable/plan.md` | Lovable design spec + the "keep it static" warning. |
| `AB-TESTING.md` | How we run funnel experiments (playbook). |

## Where to edit common things

- **Landing hero / headline / CTA copy** → `index.html` (inline).
- **Quiz questions, options, fact cards, testimonials, paywall copy** → `public/funnel/quiz-data.js`.
- **Prices, Stripe links, plan values** → `public/funnel/quiz-flow.js` (`STRIPE_LINKS`, `PLAN_VALUE`, `PLAN_NAME`, ~L548–560).
- **Colors / fonts / spacing** → `colors_and_type.css`.
- **Clean URLs / redirects** → `public/_redirects`.

---

## Dev & build

- **Run locally:** `bun run dev` → Vite dev server on `http://localhost:8080`.
  (Lovable runs it with `npx http-server -p 8080` per `lovable.toml` — same port, either works.)
- **Build:** `bun run build` → copies pages + `assets/` + `public/.` into `dist/`. No bundling/minification.
- **⚠️ Gotcha:** the build is a literal `cp` list in `package.json`. **A new top-level `.html` page must be
  added to that `cp` command** or it won't ship to `dist/`. (Files under `public/` are copied wholesale, so
  funnel files are fine automatically.)
- Asset links use cache-busting query strings like `?v=20260531-1541`; bump them when an asset changes.

---

## Funnel + tracking map

**Analytics = Meta Pixel only** (ID `1318180623856061`). No GA / GTM / PostHog yet.
Safe wrapper: `fbtrack(ev, params)` in `quiz-flow.js` (~L557) — no-op if the pixel is blocked.

User journey: **Landing (`index.html`) → Quiz (`/funnel/`) → email → paywall → Stripe → `thanks.html`.**

| Event | Fires when | Where |
|-------|-----------|-------|
| `PageView` | any page loads | Meta Pixel snippet in each page `<head>` |
| `Lead` | a valid email is entered on the `email` step | `quiz-flow.js` → `wire_email` / `fireLead` (~L591) |
| `InitiateCheckout` | the paywall CTA is tapped (carries plan value) | `quiz-flow.js` → `goToCheckout` (~L569) |
| `Purchase` | `thanks.html` loads with `?plan=monthly\|yearly&value=…` | `thanks.html` (~L34) |
| `StartTrial` | `thanks.html` loads with `?plan=trial` | `thanks.html` (~L32) |

Plans (index-matched across `STRIPE_LINKS` / `PLAN_VALUE` / `PLAN_NAME`):
`0 = 7-day free trial (→ €7/mo)` · `1 = monthly €7` · `2 = yearly €39.99`.

---

## Working with Lovable (important)

Lovable edits commit **directly to `main`** on GitHub. The user uses Lovable for quick copy tweaks and
Claude/VS Code for deeper work. To avoid divergence and merge conflicts:

- **`git pull` before starting** any session here — Lovable may have committed since last time.
- **Push promptly** after finishing, and tell the user, so Lovable stays in sync.
- **One source of truth per piece of copy.** Don't edit the same text in both places in the same window.
- During an active A/B test, **don't hand-edit the copy under test in Lovable** (it desyncs the experiment).
  See `AB-TESTING.md`.

---

## Research operation (competitor analysis, screenshots, funnel teardowns)

We're actively improving the **web-to-app funnel**, which means a lot of *research*
work: analyzing competitors, capturing screenshots, running multi-agent teardowns.
**None of that belongs in the website repo.**

**Hard rule:** all research / competitor / screenshot / scratch artifacts go under
**`research/`**, which is git-ignored and never committed. Any agent (including ones
the user spins up for competitor analysis) must save there — not at the repo root,
and not under `assets/`, `public/`, or `dist/`, which all ship to the live site via
Lovable's GitHub sync. See `research/README.md` for the suggested layout.

Only **website files** get committed and pushed: `index.html`, `public/funnel/*`,
`start.html`, the standalone pages, `colors_and_type.css`, `public/_redirects`, and
docs like this one / `BRAND.md` / `AB-TESTING.md`. Build output (`dist/`) and agent
tooling (`.claude/`, `.agents/`, `.planning/`, `skills-lock.json`) are git-ignored.

When research produces a decision, **implement it as an edit to the real website
files** and commit *that* — the underlying research stays local in `research/`.

---

## Voice

Kokoro is a small tanuki-monk: quiet, dry, occasionally funny, **never** spiritual-cliché. He doesn't give
advice, doesn't say "everything will be okay," avoids words like *soul / energy / healing / universe / flow*.
**Read `BRAND.md` in full before writing or changing any user-facing copy.**

---

## Note on tooling

This is a **website, not a mobile app** — the Argent / iOS-simulator / Android-emulator tooling in this
environment does **not** apply here. Don't boot simulators for this project; just run the site in a browser.
