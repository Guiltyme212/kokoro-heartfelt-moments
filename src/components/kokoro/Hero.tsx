import { BearSlot } from "./BearSlot";
import { MossCloud, SakuraBranch, SunDisc } from "./Ornaments";
import { useReveal } from "./useReveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      {/* ornaments behind content — never over text */}
      <SakuraBranch
        className="pointer-events-none absolute -top-2 -left-10 w-[60vw] max-w-[520px] opacity-25 sm:-left-4"
      />
      <MossCloud
        className="pointer-events-none absolute bottom-4 -right-20 w-[55vw] max-w-[420px] opacity-20"
      />

      <div
        ref={ref}
        className="reveal relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <p
          className="mb-5 inline-flex items-center gap-2 text-sm tracking-wide"
          style={{ color: "var(--moss)" }}
        >
          <span style={{ fontFamily: "var(--font-jp)" }}>心</span>
          <span>· a mindful companion</span>
        </p>

        <h1 className="text-balance text-5xl font-extrabold leading-[1.02] sm:text-6xl md:text-7xl">
          how is your heart today?
        </h1>

        <p
          className="mt-6 max-w-xl text-balance text-base sm:text-lg"
          style={{ color: "color-mix(in oklab, var(--ink) 78%, transparent)" }}
        >
          a small bear who listens, then makes you a meditation.
          <br className="hidden sm:inline" /> just for you. just for today.
        </p>

        <a href="#waitlist" className="btn-pill mt-8 text-base">
          join the waitlist
        </a>

        {/* bear mascot slot — centered below */}
        <div className="relative mt-14 w-full max-w-md">
          <SunDisc className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-full opacity-70" />
          <BearSlot name="tea" />
        </div>
      </div>
    </section>
  );
}