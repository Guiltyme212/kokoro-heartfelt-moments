## Goal
On mobile (≤720px), restore the hero exactly as it is on the published site for:
- The eyebrow ("NOW IN TESTFLIGHT · IOS")
- The headline ("Tell me what you're carrying. I'll listen, support and help you to proceed.")
- The sun
- The Kokoro video (peeking from right)

Keep the new structure for:
- The lede paragraph ("Spill the day to Kokoro…")
- The App Store + TestFlight buttons
- Both inside the white `.hero-card`

## Changes (all in `index.html`, inside `@media (max-width: 720px)`)

1. Headline — restore published size:
   - `.hero h1` font-size from `clamp(24px, 6.4vw, 34px)` → `clamp(28px, 7.2vw, 40px)`
   - margin from `6px 0 10px` → `8px 0 12px`
2. Eyebrow + headline wrap width: confirm `.hero-copy .eyebrow, .hero-copy h1 { max-width: 60% }` (already in place after last edit).
3. Kokoro video (`.peek-wrap--right`): keep current values — already match published (`right: -8vw; top: 56px; width: 58vw; max 320px; z-index: 1`, 14%/10%-88% mask). No change needed.
4. Sun (`.sun`): keep current values — already match published (`left: calc(50vw - 120px); top: -64px; 240×240; z-index: 0`). No change needed.
5. White card stays as-is: `.hero-card` wraps `.lede` + `.cta-row` with white bg, rounded, full-width buttons stacked. No change.

## Verification
- Open preview at 390×844, screenshot, compare to the user's "published" reference image (image-18). Confirm headline size matches and card + buttons remain.
- Spot-check 414×896 to make sure nothing breaks.

No other sections, no desktop/iPad changes.