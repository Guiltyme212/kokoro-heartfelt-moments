import { useState } from "react";
import { useReveal } from "./useReveal";

const CHIPS = ["love", "babe", "honey", "sunshine", "зай", "+ your own"];

export function PetName() {
  const [active, setActive] = useState("зай");
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      className="px-5 py-24 sm:py-32"
      style={{ backgroundColor: "var(--cream-warm)" }}
    >
      <div ref={ref} className="reveal mx-auto max-w-3xl text-center">
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--sunset)" }}
        >
          the small thing that matters
        </p>
        <h2 className="mt-4 text-balance text-3xl font-extrabold sm:text-4xl md:text-5xl">
          what should kokoro call you?
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-balance text-base sm:text-lg"
          style={{ color: "color-mix(in oklab, var(--ink) 75%, transparent)" }}
        >
          every meditation kokoro makes you uses the name you choose. quietly,
          three times. it's small. it changes everything.
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