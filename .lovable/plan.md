## Build the first 4 onboarding screens at `/start`

Direction picked: **Warm zen minimalism** — cream canvas, big confident Fredoka type, sunset/mustard CTAs, moss progress, real tanuki mascot (not the SVG placeholder), tactile pressed-shadow option cards.

## Where it lives

This project is a static-HTML site (Vite + plain `.html` files copied to `dist/`), not React. So the flow ships as a single new file: **`start.html`** at `https://kokoromind.com/start.html`, matching how `help.html`, `privacy.html`, `terms.html` work today.

`package.json` build script gets `start.html` appended to its `cp` list so it makes it into `dist/`.

## The 4 screens (single page, swapped with vanilla JS)

All 4 live inside one phone-shaped frame; tapping a CTA fades to the next screen. Mobile-first (full-bleed on phones, centered rounded phone frame on desktop preview). No URL change per step — keeps back/forward predictable.

1. **Landing**
   - Hero mascot: `assets/kokoro-float.png` with a soft mustard radial glow that gently breathes (5s CSS keyframe).
   - H1 (Fredoka 900, ~40px, tight tracking): "Tell Kokoro what you can't say out loud."
   - Sub: "He listens, understands what you're carrying, and creates a short meditation made from your real problem."
   - Sunset CTA: **Create my meditation**

2. **Problem framing** — moss progress bar at 25%
   - Big serif-weight type (Fredoka 800, ~30px): "Most meditation apps ask you to **calm down** before they understand why you're not okay." ("calm down" in moss)
   - Small uppercase eyebrow: "a quiet thought"
   - Mustard CTA: **That's exactly it**

3. **Solution framing** — progress 50%
   - "Kokoro makes a meditation from what you're **actually** going through today." ("actually" in sunset)
   - Eyebrow: "made for this moment"
   - Sunset CTA: **Start**

4. **Q1 — segmentation** — progress 75%
   - Eyebrow: "Question 1 of 12"
   - Title: "What made you click today?"
   - 6 tactile option cards (cream, soft border, 3px bottom shadow → presses on tap), Fredoka 700, full-width. Tapping highlights mustard and auto-advances after ~280ms:
     - I'm overthinking everything
     - I feel emotionally heavy
     - I can't talk about something
     - I need to calm down fast
     - I feel lost or stuck
     - I want to become a stronger me
   - Subtle mascot "peek" in the bottom-right corner at low opacity.

Plus a 5th **"Coming next"** placeholder screen so the user lands somewhere graceful after picking an answer ("Kokoro heard you." + Start-over button). We replace this with Q2 in the next round.

## Interaction details

- Tiny circular **back arrow** top-left appears on screens 2–5.
- Screen transitions: 450ms opacity + 8px translateY ease — quiet, not springy.
- Answers stored in a local `answers` object (no backend yet, no analytics events yet per your earlier choice).
- Buttons have `:active` micro-press for tactile feel.
- Safe-area insets respected (iPhone notch / home indicator).

## Visual tokens (all from existing `colors_and_type.css`)

`--cream` canvas, `--ink` text, `--moss` progress + accent, `--mustard` secondary CTA + selected option, `--sunset` primary CTA + accent word, Fredoka display + body. No new tokens needed.

## Files touched

- **Create** `start.html` (full screen + JS, ~250 lines).
- **Edit** `package.json` — add `start.html` to the build `cp` command.
- Optional **edit** `index.html` later — wire the homepage CTA to `/start.html` (only if you want, separate ask).

## Out of scope (next rounds)

Q2 through Q12, reflection screens, diagnosis summary, audio preview, email capture, commitment, paywall, Meta Pixel funnel events, persistence of answers. Once you've tried these 4 on your phone and they land, we extend.

## Done check

- Loads at `kokoromind.com/start.html` after publish.
- On iPhone width (390–430px), all type fits, CTA is in the thumb zone, no horizontal scroll.
- Tap-through advances cleanly; back arrow returns; selecting any Q1 option highlights it and lands on "Coming next".
- Visuals read continuous with the marketing site (same font, same cream, same warmth).
