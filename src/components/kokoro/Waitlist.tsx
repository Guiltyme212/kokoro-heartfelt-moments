import { useState } from "react";
import { BearSlot } from "./BearSlot";
import { useReveal } from "./useReveal";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const ref = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = () => {
    if (!EMAIL.test(email.trim())) {
      setErr("hmm, that doesn't look like an email.");
      return;
    }
    setErr(null);
    // wire to Loops/Resend later
    setState("done");
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden px-5 py-20 sm:py-24"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, var(--mustard) 55%, transparent) 0%, transparent 60%), var(--cream-warm)",
      }}
    >
      <div ref={ref} className="reveal mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-8 w-40 sm:w-48">
            <BearSlot variant="peek" />
          </div>

        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--sunset)" }}
        >
          early access
        </p>
        <h2 className="mt-3 text-balance text-4xl font-extrabold sm:text-5xl">
          be one of the first.
        </h2>
        <p
          className="mx-auto mt-5 max-w-lg text-balance text-base sm:text-lg"
          style={{ color: "color-mix(in oklab, var(--ink) 75%, transparent)" }}
        >
          kokoro is in beta on telegram. drop your email and we'll send you the
          link — and tell you when iOS lands.
        </p>

        {state === "idle" ? (
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="you@somewhere.com"
              className="flex-1 rounded-full bg-white/80 px-5 py-3 text-base outline-none transition focus:bg-white"
              style={{
                border: "1px solid color-mix(in oklab, var(--ink) 15%, transparent)",
                color: "var(--ink)",
              }}
              aria-label="email address"
            />
            <button type="button" onClick={submit} className="btn-pill">
              save me a spot
            </button>
          </div>
        ) : (
          <div
            className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl p-5 text-left"
            style={{
              backgroundColor: "var(--paper)",
              border: "1px solid color-mix(in oklab, var(--moss) 25%, transparent)",
            }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
              style={{
                backgroundColor: "var(--moss)",
                color: "var(--cream)",
                fontFamily: "var(--font-jp)",
              }}
              aria-hidden="true"
            >
              心
            </span>
            <p className="text-base">
              we'll be in touch, friend. take care of yourself today.
            </p>
          </div>
        )}

        {err && (
          <p className="mt-3 text-sm" style={{ color: "var(--sunset)" }}>
            {err}
          </p>
        )}

        <p
          className="mt-6 text-xs"
          style={{ color: "color-mix(in oklab, var(--ink) 55%, transparent)" }}
        >
          we'll only email you about kokoro. no marketing nonsense.
        </p>
      </div>
    </section>
  );
}