All edits are in `index.html` (plus one asset copy).

## 1. Revert mobile sun + masking changes
In the `@media (max-width: 720px)` block:
- `.sun` → back to `width: 240px; height: 240px; left: calc(50vw - 120px); top: -20px;` (pre-50%-bigger position) and drop the `z-index: 1` override.
- `.peek-wrap--right` → drop the `z-index: 2` override and revert the tightened mask back to `linear-gradient(to right, transparent 0%, #000 12%, #000 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 88%, transparent 100%)`.
- Remove the mobile-only `.peek-wrap--right video, .peek-wrap--right img { mix-blend-mode: normal; }` rule so the video goes back to `multiply` (matches desktop logic that was working before).

## 2. Trim leftover mobile gaps
In the `@media (max-width: 720px)` block:
- `.friends { padding: 56px 0 32px; }` → `padding: 20px 0 32px;` (gap before "HIS FRIENDS · THE VOICES").
- `.promise { padding: 32px 0 48px; }` → `padding: 16px 0 28px;` (gap visible in pic 3).
- `.download { padding: 64px 0 56px; }` → `padding: 24px 0 48px;` (gap before "READY WHEN YOU ARE").

## 3. TestFlight icon swap
- Copy `user-uploads://testflight-logotic.png` → `public/testflight-icon.png`.
- Replace the inline TestFlight SVG in both `<a class="store-btn tf">` blocks (hero + download section) with:
  ```html
  <img src="/testflight-icon.png" alt="" width="24" height="24" style="border-radius:6px; display:block"/>
  ```

## 4. Footer cities
- `made with a ♥ in kyoto · tokyo · brooklyn` → `made with a ♥ in kyoto · osaka · amsterdam · barcelona`.

## Verification
Screenshot mobile (390×844) after edits to confirm: sun back to original size/spot, no square video artifact, gaps tightened above Friends / Promise / Download, new TestFlight icon renders, footer reads the new city list.
