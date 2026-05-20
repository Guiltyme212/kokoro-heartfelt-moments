import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <a href="#top" className="flex items-center gap-3" aria-label="kokoro home">
          <Logo size={44} />
          <span
            className="hidden text-sm sm:inline"
            style={{ color: "var(--moss)", letterSpacing: "0.08em" }}
          >
            kokoro
          </span>
        </a>
        <a href="#waitlist" className="btn-ghost text-sm">
          join the waitlist
        </a>
      </div>
    </header>
  );
}