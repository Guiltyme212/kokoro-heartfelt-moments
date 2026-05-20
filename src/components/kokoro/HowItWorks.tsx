import { useReveal } from "./useReveal";

const STEPS = [
  {
    head: "say hi",
    body: "kokoro asks a couple of soft questions. nothing heavy.",
  },
  {
    head: "kokoro listens",
    body: "then quietly starts making something just for you.",
  },
  {
    head: "press play",
    body: "a 3–7 minute meditation, in a voice you'll choose, with your name in it.",
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="how"
      className="px-5 py-16 sm:py-20"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div ref={ref} className="reveal mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "var(--sunset)" }}
          >
            two minutes, start to finish
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold sm:text-4xl md:text-5xl">
            it's really just three steps.
          </h2>
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.head} className="relative flex flex-col items-center text-center">
              {/* stepper pip */}
              <div className="relative mb-5 flex items-center justify-center">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: "var(--mustard)", color: "var(--ink)" }}
                >
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className="absolute left-full top-1/2 hidden h-px w-32 -translate-y-1/2 sm:block"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, color-mix(in oklab, var(--ink) 30%, transparent) 50%, transparent 50%)",
                      backgroundSize: "8px 1px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />
                )}
              </div>
              <h3 className="text-xl font-bold">{s.head}</h3>
              <p
                className="mt-3 max-w-xs text-base"
                style={{ color: "color-mix(in oklab, var(--ink) 72%, transparent)" }}
              >
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}