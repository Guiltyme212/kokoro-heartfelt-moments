import { useReveal } from "./useReveal";

type Mode = {
  bg: string;
  fg: string;
  title: string;
  sub: string;
  body: string;
};

const MODES: Mode[] = [
  {
    bg: "var(--moss-deep)",
    fg: "var(--cream)",
    title: "unwind",
    sub: "let it out",
    body: "vent, soften, exhale",
  },
  {
    bg: "var(--sunset)",
    fg: "var(--cream)",
    title: "see",
    sub: "look at it gently",
    body: "notice what's actually here",
  },
  {
    bg: "var(--coral)",
    fg: "var(--ink)",
    title: "lock in",
    sub: "set the tone",
    body: "for what comes next",
  },
];

export function Modes() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="px-5 py-16 sm:py-20">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "var(--moss-deep)" }}
          >
            three moods
          </p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold sm:text-4xl md:text-5xl">
            what kind of moment is this?
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {MODES.map((m) => (
            <article
              key={m.title}
              className="flex flex-col gap-3 rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: m.bg,
                color: m.fg,
              }}
            >
              <h3 className="text-3xl font-extrabold">{m.title}</h3>
              <p
                className="text-xs uppercase tracking-widest"
                style={{ opacity: 0.8 }}
              >
                {m.sub}
              </p>
              <p className="mt-1 text-lg">{m.body}</p>
            </article>
          ))}
        </div>

        <p
          className="mx-auto mt-8 max-w-2xl text-balance text-center text-base sm:text-lg"
          style={{ color: "color-mix(in oklab, var(--ink) 72%, transparent)" }}
        >
          you pick the mood. kokoro picks the words, the voice, the music — for
          you, in this moment.
        </p>
      </div>
    </section>
  );
}