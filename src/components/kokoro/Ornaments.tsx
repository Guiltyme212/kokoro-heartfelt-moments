/** Sakura branch — sits behind hero content, low opacity. */
export function SakuraBranch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <g fill="none" stroke="#6b4a2a" strokeWidth="3" strokeLinecap="round">
        <path d="M10 40 Q120 60 220 30 T390 20" />
        <path d="M120 55 Q150 90 180 110" />
        <path d="M260 25 Q280 55 310 75" />
      </g>
      <g fill="#FFB5A7">
        {[
          [40, 35], [80, 50], [140, 30], [200, 25], [260, 32],
          [320, 20], [370, 25], [170, 110], [195, 130], [310, 80],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="9" />
            <circle r="5" fill="#F08A5D" opacity="0.55" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Soft moss cloud — sits behind hero content, low opacity. */
export function MossCloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 160" className={className} aria-hidden="true">
      <g fill="#6B7A5A">
        <ellipse cx="80" cy="100" rx="80" ry="40" />
        <ellipse cx="160" cy="80" rx="90" ry="45" />
        <ellipse cx="240" cy="105" rx="70" ry="38" />
      </g>
    </svg>
  );
}

/** Warm sun disc behind the hero mascot. */
export function SunDisc({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F2C54E" />
          <stop offset="60%" stopColor="#F08A5D" />
          <stop offset="100%" stopColor="#F08A5D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#sun)" />
    </svg>
  );
}