import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer
      className="px-5 py-8"
      style={{
        backgroundColor: "var(--paper)",
        borderTop: "1px solid color-mix(in oklab, var(--ink) 8%, transparent)",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3 sm:items-center">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-sm" style={{ color: "color-mix(in oklab, var(--ink) 65%, transparent)" }}>
            kokoro · ©2026
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {["journal", "rituals", "privacy", "contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--ink)" }}
            >
              {l}
            </a>
          ))}
        </nav>

        <p
          className="text-sm sm:text-right"
          style={{ color: "var(--moss)" }}
        >
          small steps every day.
        </p>
      </div>
    </footer>
  );
}