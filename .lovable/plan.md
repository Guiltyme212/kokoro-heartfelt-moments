## Kokoro — Single-Page Marketing Site

A mobile-first, single-route landing page that positions Kokoro (the tanuki monk bear) and captures waitlist emails. Built straight from the brief — no invented tokens, no extra sections, no top nav.

### Design system (locked from the spec)

Tokens written into `src/styles.css` via `@theme inline` + `:root`:
- `--ink #1E1E1E`, `--moss #6B7A5A`, `--mustard #F2C54E`, `--sunset #F08A5D`, `--coral #FFB5A7`, `--cream #F7F2E7`, `--cream-warm` (slightly deeper cream for the pet-name band)
- Map to semantic tokens: `--background` = cream, `--foreground` = ink, `--primary` = mustard, `--secondary` = moss, `--accent` = sunset
- Fonts: Noto Sans Rounded (display + body), Noto Sans JP (心 / kana). Loaded via Google Fonts in `__root.tsx` head.
- Surfaces: paper-card (cream raised), moss/mustard/sunset/coral tinted cards. Soft radius (~14px), no harsh shadows.
- Bear-slot utility: cream bg, `mix-blend-mode: multiply`, radial feather mask, 6s slow breathing animation.

### Files

- `src/styles.css` — tokens, fonts, base styles, `.bear-slot`, `.fade-in-up` (600ms on scroll), `.breathe` (6s).
- `src/routes/__root.tsx` — add Noto Sans Rounded + JP `<link>`s and update meta (title "kokoro — how is your heart today?", description, og:*).
- `src/routes/index.tsx` — composes the 9 sections in order.
- `src/components/kokoro/` — one file per section:
  - `Header.tsx` (logo top-left: mustard circle + 心; ghost CTA top-right → `#waitlist`)
  - `Hero.tsx` (eyebrow, H1, subhead, primary CTA, centered bear slot placeholder w/ `// replace with kokoro-tea.mp4`, sakura + moss-cloud ornaments behind at low opacity)
  - `Modes.tsx` (3 cards: moss/mustard/paper, caption)
  - `HowItWorks.tsx` (3 steps with pip connectors)
  - `PetName.tsx` (full-width cream-warm band, chip row, `зай` active by default — local state)
  - `MeetTheBear.tsx` (2×2 / 4-col grid of bear slots: proud, tea, heart, peeking)
  - `MantraStrip.tsx` (verbatim from design system: be kind to yourself · small steps every day · simple rituals heal · progress, not perfection · you're doing just fine)
  - `WhyKokoro.tsx` (two-column contrast, alternating row bgs, no table chrome)
  - `Waitlist.tsx` (`#waitlist`; email input + mustard pill button; no `<form>`, button onClick; on submit swap to confirmation card; `// wire to Loops/Resend later`)
  - `Footer.tsx` (slim paper-card; logo + ©2026 / center links / one mantra)
- `src/components/kokoro/BearSlot.tsx` — shared placeholder (cream square with 心 watermark + breathing) used by Hero and MeetTheBear with a `// replace with kokoro-{name}.mp4` comment.

### Behavior details

- Pet-name chips: local `useState`, single-select, `зай` initial. Pure UI, no persistence.
- Waitlist: local `useState<'idle' | 'done'>`; basic email regex; replaces card on submit. No network call.
- Motion: IntersectionObserver hook adds `.is-visible` for the 600ms fade-in-up; `.breathe` is pure CSS keyframes on bear slots. Respects `prefers-reduced-motion`.
- Ornaments (sakura branch, moss cloud) are inline SVG in `src/components/kokoro/ornaments/`, positioned absolute behind hero content, `opacity` ≤ 0.25, `pointer-events: none`, never overlapping headline text.

### Out of scope (per brief)

- No backend, no Lovable Cloud, no email provider wiring (commented stub only).
- No top navigation, no extra pages, no SEO beyond head meta on the index route.
- No real mascot media yet — every bear slot is a documented placeholder.

After approval I'll build all files in one pass.