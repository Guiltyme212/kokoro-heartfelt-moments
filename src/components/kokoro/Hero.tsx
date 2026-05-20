import { BearSlot } from "./BearSlot";
import { SakuraBranch, SunDisc } from "./Ornaments";
import { useReveal } from "./useReveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16"
      style={{
        background:
          "radial-gradient(120% 80% at 85% 0%, color-mix(in oklab, var(--sunset) 28%, transparent) 0%, transparent 55%), radial-gradient(90% 70% at 10% 110%, color-mix(in oklab, var(--coral) 45%, transparent) 0%, transparent 55%), var(--cream)",
      }}
    >
      <SakuraBranch
        className="pointer-events-none absolute -top-4 -left-12 w-[48vw] max-w-[460px] opacity-30 sm:-left-6"
      />

      <div
        ref={ref}
        className="reveal relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:gap-6 sm:px-8 md:grid-cols-[1.05fr_1fr]"
      >
        <div className="text-center md:text-left">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase"
            style={{
              backgroundColor: "color-mix(in oklab, var(--mustard) 55%, transparent)",
              color: "var(--ink)",
            }}
          >
            <span style={{ fontFamily: "var(--font-jp)" }}>心</span>
            <span>a mindful companion</span>
          </p>

          <h1 className="text-balance text-5xl font-extrabold leading-[0.98] sm:text-6xl md:text-[5.25rem]">
            how is your{" "}
            <span style={{ color: "var(--sunset)" }}>heart</span> today?
          </h1>

          <p
            className="mx-auto mt-6 max-w-lg text-balance text-lg sm:text-xl md:mx-0"
            style={{ color: "color-mix(in oklab, var(--ink) 80%, transparent)" }}
          >
            a small bear who listens, asks two soft questions, then makes you a
            meditation. just for you. just for today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a href="#waitlist" className="btn-pill text-base">
              join the waitlist
            </a>
            <a
              href="#how"
              className="text-sm font-medium underline-offset-4 hover:underline"
              style={{ color: "var(--moss-deep)" }}
            >
              how it works ↓
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]">
          <SunDisc className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full scale-110 opacity-90" />
          <BearSlot variant="talking" aspect="1 / 1" />
          <div
            className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full px-4 py-2 text-xs tracking-widest uppercase shadow-sm sm:block"
            style={{
              backgroundColor: "var(--paper)",
              color: "var(--moss-deep)",
              border: "1px solid color-mix(in oklab, var(--moss) 25%, transparent)",
            }}
          >
            <span style={{ fontFamily: "var(--font-jp)" }}>心</span> · kokoro is
            listening
          </div>
        </div>
      </div>
    </section>
  );
}