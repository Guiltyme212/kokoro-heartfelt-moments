export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--mustard)",
      }}
      aria-label="kokoro"
    >
      <span
        style={{
          fontFamily: "var(--font-jp)",
          color: "var(--ink)",
          fontWeight: 700,
          fontSize: size * 0.55,
          lineHeight: 1,
          transform: "translateY(1px)",
        }}
      >
        心
      </span>
    </div>
  );
}