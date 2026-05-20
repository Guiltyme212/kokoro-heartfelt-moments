import { useReveal } from "./useReveal";

const ROWS: Array<[string, string]> = [
  ["pick from a list", "one made for you"],
  ["same voice for everyone", "the voice that fits you"],
  ["same script, no name", "your name, every time"],
  ["10-minute commitment", "2 minutes to start, 5 to land"],
  ["guided by a stranger", "guided by someone who remembers"],
];

export function WhyKokoro() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="px-5 py-20 sm:py-28">
      <div ref={ref} className="reveal mx-auto max-w-5xl">
        <h2 className="mx-auto max-w-3xl text-balance text-center text-3xl font-extrabold sm:text-4xl md:text-5xl">
          meditation apps give you a library. kokoro makes you a moment.
        </h2>

        <div className="mt-14">
          {/* column headers */}
          <div className="grid grid-cols-2 gap-4 px-5 pb-3 text-xs uppercase tracking-widest sm:gap-10 sm:px-7 sm:text-sm">
            <span style={{ color: "color-mix(in oklab, var(--ink) 55%, transparent)" }}>
              most apps
            </span>
            <span style={{ color: "var(--sunset)" }}>kokoro</span>
          </div>

          <ul className="overflow-hidden rounded-3xl">
            {ROWS.map(([left, right], i) => (
              <li
                key={left}
                className="grid grid-cols-2 gap-4 px-5 py-5 sm:gap-10 sm:px-7 sm:py-6"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? "var(--paper)" : "var(--cream-warm)",
                }}
              >
                <span
                  className="text-base sm:text-lg"
                  style={{
                    color: "color-mix(in oklab, var(--ink) 60%, transparent)",
                    textDecoration: "line-through",
                    textDecorationColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                  }}
                >
                  {left}
                </span>
                <span className="text-base font-semibold sm:text-lg">
                  {right}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}