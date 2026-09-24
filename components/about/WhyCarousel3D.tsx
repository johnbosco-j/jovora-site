"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Point = { title: string; body: string };

const INTERVAL = 3800; // ms each card stays in front

/**
 * Phones: the "why" points as square cards on a rotating 3D ring. It turns on its
 * own (one card every few seconds), only while on screen, and reports the front
 * card so Riv can react. Reduced motion: no auto-turn and no spin — the dots switch
 * cards instantly.
 */
export function WhyCarousel3D({ points, onActive }: { points: Point[]; onActive: (i: number) => void }) {
  const n = points.length;
  const step = 360 / n;
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  // `turn` only ever increases so the ring always rotates forward (never rewinds).
  const [turn, setTurn] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = ((turn % n) + n) % n;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => !document.hidden && setTurn((t) => t + 1), INTERVAL);
    return () => clearInterval(id);
  }, [visible, reduce]);

  useEffect(() => {
    if (visible) onActive(active);
  }, [active, visible, onActive]);

  const goTo = (i: number) => setTurn((t) => t + ((i - (((t % n) + n) % n) + n) % n));

  return (
    <div ref={root} className="md:hidden">
      <div
        className="relative mx-auto h-[300px] w-full [perspective:900px]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Why we're different"
      >
        <div
          className="absolute left-1/2 top-1/2 size-[236px] [transform-style:preserve-3d]"
          style={{
            transform: `translate(-50%, -50%) translateZ(-190px) rotateY(${-turn * step}deg)`,
            transition: reduce ? "none" : "transform 1100ms cubic-bezier(.65,0,.35,1)",
          }}
        >
          {points.map((p, i) => {
            const on = i === active;
            return (
              <article
                key={p.title}
                aria-hidden={!on}
                className={`absolute inset-0 flex flex-col rounded-card border p-5 shadow-hairline [backface-visibility:hidden] transition-[opacity,border-color,background-color] duration-700 ${
                  on ? "border-line-strong bg-surface opacity-100" : "border-line bg-surface/80 opacity-50"
                }`}
                style={{ transform: `rotateY(${i * step}deg) translateZ(190px)` }}
              >
                <span aria-hidden="true" className={`absolute inset-y-5 left-0 w-px bg-orange transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`} />
                <span className={`font-mono text-[12px] tabular-nums ${on ? "text-orange" : "text-faint"}`}>
                  {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
                <p className={`mt-3 font-serif text-[26px] italic leading-[1.05] tracking-[-0.01em] ${on ? "text-orange-hot" : "text-ink"}`}>{p.title}</p>
                <p className="mt-auto text-[13.5px] leading-snug text-muted">{p.body}</p>
              </article>
            );
          })}
        </div>
        {/* floor reflection glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-0 h-10 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_106_26/0.16),transparent)]" />
      </div>

      {/* Screen readers get the current card as text */}
      <p className="sr-only" aria-live="polite">
        {points[active].title} {points[active].body}
      </p>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        {points.map((p, i) => (
          <button key={p.title} type="button" onClick={() => goTo(i)} aria-label={`Show point ${i + 1}: ${p.title}`} className="grid size-8 place-items-center">
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-5 bg-orange" : "w-1.5 bg-line-strong"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
