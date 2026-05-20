type Variant = "peek" | "talking";

type Props = {
  /** Which mascot clip to show. */
  variant?: Variant;
  aspect?: string;
  className?: string;
  /** Soft breathing on the wrapper. */
  breathe?: boolean;
};

const SRC: Record<Variant, string> = {
  peek: "/kokoro-peek.mp4",
  talking: "/kokoro-talking.mp4",
};

/**
 * Sacred mascot slot. Cream-baked video on a cream surface with multiply
 * blend + radial feather mask so any cream halo dissolves.
 */
export function BearSlot({
  variant = "peek",
  aspect = "1 / 1",
  className = "",
  breathe = true,
}: Props) {
  return (
    <div
      className={`bear-slot ${breathe ? "breathe" : ""} ${className}`}
      style={{ aspectRatio: aspect }}
      aria-hidden="true"
    >
      <video
        className="bear-media h-full w-full object-cover"
        src={SRC[variant]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}