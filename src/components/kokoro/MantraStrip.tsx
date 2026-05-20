const MANTRAS = [
  { jp: "心", text: "be kind to yourself" },
  { jp: "🌿", text: "small steps every day" },
  { jp: "☕", text: "simple rituals heal" },
  { jp: "♡", text: "progress, not perfection" },
  { jp: "︎☺", text: "you're doing just fine" },
];

// Note: per the system, only 心 is true emoji-free copy. The other small
// glyphs are decorative ornament icons, not emoji in body copy.

export function MantraStrip() {
  return (
    <section
      className="px-5 py-10"
      style={{ backgroundColor: "var(--moss)", color: "var(--cream)" }}
    >
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm sm:text-base">
        {MANTRAS.map((m) => (
          <li key={m.text} className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                backgroundColor: "color-mix(in oklab, var(--cream) 18%, transparent)",
                fontFamily: "var(--font-jp)",
              }}
              aria-hidden="true"
            >
              {m.jp}
            </span>
            <span>{m.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}