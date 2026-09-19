/**
 * Three concentric orange hairline rings. Each carries a brighter arc so its slow
 * rotation is visible; the middle ring carries the travelling sphere.
 * Pure SVG + CSS rotation (stopped under reduced motion via globals.css).
 */
const RINGS = [
  { size: 54, spin: "spin-60", arc: 0.22, sphere: false, opacity: 0.5 },
  { size: 76, spin: "spin-90", arc: 0.14, sphere: true, opacity: 0.42 },
  { size: 98, spin: "spin-120", arc: 0.3, sphere: false, opacity: 0.3 },
] as const;

export function Orbit({ faint = false, className = "" }: { faint?: boolean; className?: string }) {
  const R = 100;
  const C = 2 * Math.PI * R;
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      {RINGS.map((ring, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{ width: `${ring.size}%`, height: `${ring.size}%`, transform: "translate(-50%, -50%)" }}
        >
          <svg viewBox="-104 -104 208 208" className={`size-full overflow-visible ${ring.spin}`}>
            <circle r={R} fill="none" className="stroke-orange" strokeOpacity={(faint ? 0.35 : 1) * ring.opacity * 1.15} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            <circle
              r={R}
              fill="none"
              className="stroke-orange"
              strokeOpacity={(faint ? 0.35 : 1) * Math.min(1, ring.opacity * 3)}
              strokeWidth={faint ? 1 : 1.5}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeDasharray={`${C * ring.arc} ${C}`}
            />
            {ring.sphere && !faint && (
              <g transform={`rotate(${-90 + ring.arc * 360}) translate(${R} 0)`}>
                <circle r="9" className="fill-orange" opacity="0.22" />
                <circle r="4.5" className="fill-orange" opacity="0.35" />
                <circle r="2.6" className="fill-orange-hot" />
              </g>
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}
