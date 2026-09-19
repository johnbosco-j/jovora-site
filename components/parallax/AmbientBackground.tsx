"use client";

import { useEffect, useRef } from "react";
import { startTilt, tiltX, tiltY } from "@/lib/tilt";

/**
 * Site-wide L0/L1 background: a slow, sparse particle field in three depth layers.
 * Each layer drifts on its own and shifts with scroll at its depth factor (parallax),
 * near neighbours in the same layer are joined by faint hairlines, and a few
 * particles carry the orange accent. Two soft glow orbs drift behind it (CSS).
 *
 * One <canvas>, no libraries. Pauses when the tab is hidden; with reduced motion it
 * draws a single still frame and never animates.
 */

// Design tokens (design.md §2) — canvas needs raw channels.
const INK = "244, 242, 238";
const ORANGE = "255, 106, 26";

const LAYERS = [
  { depth: 0.06, size: 0.7, alpha: 0.34, drift: 0.012, link: 0 },
  { depth: 0.15, size: 1.0, alpha: 0.5, drift: 0.02, link: 110 },
  { depth: 0.3, size: 1.4, alpha: 0.7, drift: 0.03, link: 140 },
] as const;

type Particle = { x: number; y: number; vx: number; vy: number; layer: number; orange: boolean; phase: number };

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    const eased = { x: 0, y: 0 };

    const seed = () => {
      const mobile = w < 768;
      const count = Math.round(Math.min(mobile ? 45 : 90, (w * h) / (mobile ? 9000 : 15000)));
      particles = Array.from({ length: count }, (_, i) => {
        const layer = i % 3;
        const angle = Math.random() * Math.PI * 2;
        const speed = LAYERS[layer].drift * (0.5 + Math.random());
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          layer,
          orange: Math.random() < 0.07,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // Mobile URL bars change only the height while scrolling — keep the field, don't reshuffle.
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || particles.length === 0) seed();
    };

    const wrap = (v: number, max: number) => ((v % max) + max) % max;

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const scroll = reduce ? 0 : window.scrollY;
      const scale = w < 768 ? 0.75 : 1;
      const reach = w < 768 ? 110 : 70; // phones: tilt moves the field further
      eased.x += (tiltX.get() * reach - eased.x) * 0.05;
      eased.y += (tiltY.get() * reach - eased.y) * 0.05;

      // Screen positions per layer, then links, then dots on top.
      const pos: { x: number; y: number; p: Particle }[][] = [[], [], []];
      for (const p of particles) {
        const L = LAYERS[p.layer];
        if (!reduce) {
          p.x = wrap(p.x + p.vx * dt, w);
          p.y = wrap(p.y + p.vy * dt, h);
        }
        const x = wrap(p.x + eased.x * L.depth * 1.6, w);
        const y = wrap(p.y - scroll * L.depth * scale + eased.y * L.depth * 1.6, h);
        pos[p.layer].push({ x, y, p });
      }

      ctx.lineWidth = 0.6;
      for (let li = 1; li < 3; li++) {
        const pts = pos[li];
        const max = LAYERS[li].link;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 > max * max) continue;
            const a = (1 - Math.sqrt(d2) / max) * 0.12 * (li === 2 ? 1 : 0.7);
            const warm = pts[i].p.orange || pts[j].p.orange;
            ctx.strokeStyle = `rgba(${warm ? ORANGE : INK}, ${warm ? a * 2.2 : a})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const layer of pos) {
        for (const { x, y, p } of layer) {
          const L = LAYERS[p.layer];
          const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.0009 + p.phase);
          ctx.fillStyle = `rgba(${p.orange ? ORANGE : INK}, ${L.alpha * twinkle * (p.orange ? 1.3 : 1)})`;
          ctx.beginPath();
          ctx.arc(x, y, L.size * (p.orange ? 1.3 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      draw(t, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    const onResize = () => {
      resize();
      if (reduce) draw(0, 0);
    };

    resize();
    window.addEventListener("resize", onResize);
    if (reduce) {
      draw(0, 0);
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
      startTilt();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ambient-orb ambient-orb--a" />
      <div className="ambient-orb ambient-orb--b" />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
