import { Logo } from "./Logo";

type Props = {
  /** Filename hint for the eventual video, e.g. "tea", "proud", "heart". */
  name: string;
  /** Aspect ratio, defaults to square. */
  aspect?: string;
  className?: string;
};

/**
 * Sacred mascot slot. Renders a cream square with the 心 watermark and slow
 * breathing. Replace the inner placeholder with a <video> or <img> when the
 * real mascot asset is wired in — keep the .bear-slot wrapper (cream bg +
 * multiply + feather mask) so cream-baked assets blend cleanly.
 */
export function BearSlot({ name, aspect = "1 / 1", className = "" }: Props) {
  return (
    <div
      className={`bear-slot ${className}`}
      style={{ aspectRatio: aspect }}
      aria-hidden="true"
    >
      {/* // replace with kokoro-{name}.mp4 */}
      <div className="bear-media flex h-full w-full items-center justify-center">
        <div className="breathe flex flex-col items-center gap-3 opacity-70">
          <Logo size={84} />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--moss)" }}
          >
            kokoro · {name}
          </span>
        </div>
      </div>
    </div>
  );
}