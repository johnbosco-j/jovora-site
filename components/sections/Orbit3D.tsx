"use client";

import { motion, type MotionValue } from "framer-motion";

/**
 * Hero orbit as a real 3D gyroscope: rings sit on different tilted planes inside one
 * perspective space, each spinning around its own axis, with satellites travelling
 * the tilted ones. Rotating the whole assembly (mouse / phone tilt / scroll) makes the
 * rings visibly bend and open up in depth. CSS 3D transforms only; spins stop under
 * reduced motion (globals.css).
 */

type Ring = {
  size: number; // % of the assembly
  rx: number; // plane tilt (deg)
  ry: number;
  spin: string; // CSS spin class
  arc: number; // bright arc length (0–1)
  opacity: number;
  width: number;
  ticks?: boolean;
  satellite?: boolean;
  dashed?: boolean;
};

const RINGS: Ring[] = [
  { size: 100, rx: 0, ry: 0, spin: "spin-120", arc: 0.22, opacity: 0.28, width: 1, ticks: true },
  { size: 84, rx: 72, ry: 0, spin: "spin-40", arc: 0.3, opacity: 0.75, width: 1.5, satellite: true },
  { size: 70, rx: 64, ry: 56, spin: "spin-90", arc: 0.2, opacity: 0.6, width: 1.3, satellite: true },
  { size: 58, rx: -60, ry: -48, spin: "spin-60", arc: 0.28, opacity: 0.55, width: 1.2, satellite: true },
  { size: 40, rx: 0, ry: 0, spin: "spin-90", arc: 0.4, opacity: 0.4, width: 1, dashed: true },
];

const R = 100;
const C = 2 * Math.PI * R;

export function Orbit3D({
  rotateX,
  rotateY,
  rotateZ,
  scale,
  className = "",
}: {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ?: MotionValue<number>;
  scale: MotionValue<number>;
  className?: string;
}) {
  return (
    <div className={`[perspective:1100px] ${className}`} aria-hidden="true">
      <motion.div style={{ rotateX, rotateY, rotateZ, scale }} className="relative aspect-square w-full [transform-style:preserve-3d]">
        {/* core glow */}
        <div className="absolute left-1/2 top-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_138_61/0.28),rgb(255_106_26/0.06)_60%,transparent)]" />

        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
            style={{
              width: `${ring.size}%`,
              height: `${ring.size}%`,
              transform: `translate(-50%, -50%) rotateX(${ring.rx}deg) rotateY(${ring.ry}deg)`,
            }}
          >
            <svg viewBox="-106 -106 212 212" className={`size-full overflow-visible ${ring.spin}`}>
              {/* base hairline */}
              <circle
                r={R}
                fill="none"
                className="stroke-orange"
                strokeOpacity={ring.opacity * 0.6}
                strokeWidth={ring.width * 0.6}
                vectorEffect="non-scaling-stroke"
                strokeDasharray={ring.dashed ? "2 6" : undefined}
              />
              {/* instrument ticks */}
              {ring.ticks &&
                Array.from({ length: 72 }, (_, k) => {
                  const a = (k / 72) * Math.PI * 2;
                  const long = k % 6 === 0;
                  const r1 = R - (long ? 5 : 2.5);
                  return (
                    <line
                      key={k}
                      x1={Math.cos(a) * r1}
                      y1={Math.sin(a) * r1}
                      x2={Math.cos(a) * R}
                      y2={Math.sin(a) * R}
                      className="stroke-orange"
                      strokeOpacity={long ? 0.5 : 0.22}
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              {/* bright arc */}
              <circle
                r={R}
                fill="none"
                className="stroke-orange"
                strokeOpacity={Math.min(1, ring.opacity * 1.8)}
                strokeWidth={ring.width * 1.2}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeDasharray={`${C * ring.arc} ${C}`}
              />
              {/* satellite at the head of the arc */}
              {ring.satellite && (
                <g transform={`rotate(${ring.arc * 360}) translate(${R} 0)`}>
                  <circle r="10" className="fill-orange" opacity="0.14" />
                  <circle r="5" className="fill-orange" opacity="0.35" />
                  <circle r="2.8" className="fill-orange-hot" />
                </g>
              )}
            </svg>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
