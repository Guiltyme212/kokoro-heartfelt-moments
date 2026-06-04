# Kokoro — Onboarding Quiz (editable folder)

A self-contained onboarding/quiz flow. Plain HTML + vanilla JS + CSS. No build step.

## Files
```
index.html            ← the page (open this)
colors_and_type.css   ← design tokens + Google Fonts import
quiz-data.js          ← all screens & copy live here (edit this to change questions/text)
quiz-flow.js          ← the flow engine + screen renderers + animations
assets/               ← mascot videos (.mp4) + images (.png)
```

## Run it
Open `index.html` in a browser, or serve the folder with any static server
(e.g. `npx serve .`). It works offline except for the Google-Fonts import in the CSS.

## Putting it in Lovable
1. Drop this whole folder into your project's **`public/`** directory, keeping the
   structure intact (so `assets/` stays next to `index.html`).
2. Open it at **`/index.html`**, or embed it:
   ```html
   <iframe src="/index.html" style="border:0;width:100%;height:100vh"></iframe>
   ```

### Tell Lovable (so it doesn't break it)
- **Keep this as static HTML/JS/CSS. Do NOT convert it to React/JSX or split it into components.**
  The flow runs on vanilla JS; converting it breaks the screen transitions and the
  video logic.
- **Don't wrap it in a phone/device frame.** The screen is a flat 390×844 canvas that
  auto-scales to any container — just give it a full-height area.
- **Keep `playsinline muted autoplay loop` on the videos** (needed for mobile autoplay),
  and keep the `assets/` folder next to `index.html`.

## Editing
- **Change questions / copy:** edit `quiz-data.js` (the `STEPS` array). Each step has a
  `type` and its own fields — copy an existing one as a template.
- **Change look / animations:** styles are in the `<style>` block of `index.html`;
  renderers + interactions are in `quiz-flow.js`.

## Note on the videos
The mascot `.mp4`s are stripped of a metadata box that used to block web playback, and
each has a still-image poster behind it — so even if a browser blocks autoplay, you'll
never see a black box.
