import { BearSlot } from "./BearSlot";
import { useReveal } from "./useReveal";

const BEARS = [
  { name: "proud", line: "the one who's rooting for you." },
  { name: "tea", line: "the one who sits with you." },
  { name: "heart", line: "the one who remembers." },
  { name: "peeking", line: "the one who shows up, gently." },
];

export function MeetTheBear() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="px-5 py-20 sm:py-28">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <h2 className="text-balance text-center text-3xl font-extrabold sm:text-4xl md:text-5xl">
          meet kokoro.
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-center text-base"
          style={{ color: "color-mix(in oklab, var(--ink) 70%, transparent)" }}
        >
          <span style={{ fontFamily: "var(--font-jp)" }}>心</span> · kokoro
          means "heart" in japanese.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
          {BEARS.map((b) => (
            <figure key={b.name} className="flex flex-col gap-3">
              <BearSlot name={b.name} />
              <figcaption className="text-center text-sm" style={{ color: "var(--moss)" }}>
                <span className="block font-semibold lowercase" style={{ color: "var(--ink)" }}>
                  {b.name}
                </span>
                <span>{b.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}