import { BearSlot } from "./BearSlot";
import { useReveal } from "./useReveal";

export function MeetTheBear() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      className="relative overflow-hidden px-5 py-16 sm:py-20"
      style={{ backgroundColor: "var(--cream-warm)" }}
    >
      <div
        ref={ref}
        className="reveal mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_1.1fr]"
      >
        <div className="relative mx-auto w-full max-w-[420px]">
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 55%, color-mix(in oklab, var(--coral) 70%, transparent) 0%, transparent 70%)",
            }}
          />
          <BearSlot variant="peek" aspect="1 / 1" />
        </div>

        <div>
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: "var(--sunset)" }}
          >
            <span style={{ fontFamily: "var(--font-jp)" }}>心</span> · heart, in
            japanese
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold sm:text-5xl md:text-6xl">
            meet kokoro.
          </h2>
          <p
            className="mt-5 max-w-md text-lg"
            style={{ color: "color-mix(in oklab, var(--ink) 78%, transparent)" }}
          >
            a small tanuki in a monk robe. he peeks. he listens. he doesn't
            judge. he's not an app full of content — he's the one who shows up
            and makes you the thing you need, right now.
          </p>

          <ul className="mt-7 grid gap-3 text-base sm:grid-cols-2">
            {[
              ["asks", "two soft questions"],
              ["remembers", "your pet-name"],
              ["makes", "one thing, for today"],
              ["lives", "in telegram"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-baseline gap-2 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: "var(--paper)",
                  border:
                    "1px solid color-mix(in oklab, var(--moss) 18%, transparent)",
                }}
              >
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "var(--moss-deep)" }}
                >
                  {k}
                </span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}