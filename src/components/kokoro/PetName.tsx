import { useState } from "react";
import { useReveal } from "./useReveal";

const CHIPS = ["love", "babe", "honey", "sunshine", "зай", "+ your own"];

export function PetName() {
  const [active, setActive] = useState("зай");
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      className="relative overflow-hidden px-5 py-16 sm:py-20"
      style={{
        background:
          "linear-gradient(180deg, var(--coral) 0%, color-mix(in oklab, var(--sunset) 70%, var(--coral)) 100%)",
      }}
    >
      <div ref={ref} className="reveal mx-auto max-w-3xl text-center">
        <p
          className="text-xs tracking-[0.22em] uppercase"
          style={{ color: "var(--ink)", opacity: 0.7 }}
        >
          the small thing that matters
        </p>
        <h2
          className="mt-3 text-balance text-3xl font-extrabold sm:text-4xl md:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          what should kokoro call you?
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-balance text-base sm:text-lg"
          style={{ color: "color-mix(in oklab, var(--ink) 80%, transparent)" }}
        >
          every meditation uses the name you choose. quietly, three times.
          it's small. it changes everything.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`chip ${active === c ? "is-active" : ""}`}
              aria-pressed={active === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}