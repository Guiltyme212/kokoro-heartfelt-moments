const MANTRAS = [
  "be kind to yourself",
  "small steps every day",
  "simple rituals heal",
  "progress, not perfection",
  "you're doing just fine",
];

export function MantraStrip() {
  return (
    <section
      className="px-5 py-8"
      style={{ backgroundColor: "var(--moss-deep)", color: "var(--cream)" }}
    >
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm sm:text-base">
        {MANTRAS.map((m, i) => (
          <li key={m} className="flex items-center gap-6">
            <span className="lowercase">{m}</span>
            {i < MANTRAS.length - 1 && (
              <span
                aria-hidden="true"
                style={{ fontFamily: "var(--font-jp)", opacity: 0.55 }}
              >
                心
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}