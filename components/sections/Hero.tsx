"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { AccentText } from "@/components/ui/AccentHeading";
import { site } from "@/content/site";
import { useMotionScale } from "@/lib/hooks";
import { startTilt, tiltX, tiltY } from "@/lib/tilt";
import { domains } from "@/content/domains";
import { Marquee } from "@/components/ui/Marquee";
import { Orbit } from "./Orbit";

export function Hero() {
  const { hero } = site;
  const ref = useRef<HTMLElement>(null);
  const scale = useMotionScale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // "Fly through the rings": face-on → ~65° tilt, glow fades (transform/opacity only).
  const tilt = useTransform(scrollYProgress, [0, 0.85], [0, 65 * Math.min(scale, 1)]);
  const ringScale = useTransform(scrollYProgress, [0, 0.85], [1, 1 + 0.35 * scale]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.9], [1, scale ? 0.15 : 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, scale ? 0 : 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.8], [1, scale ? 0 : 1]);

  // Mouse (laptop) or phone tilt (mobile) swings the ring plane for real depth.
  useEffect(() => startTilt(), []);
  const sx = useSpring(tiltX, { stiffness: 60, damping: 20 });
  const sy = useSpring(tiltY, { stiffness: 60, damping: 20 });
  const ringYaw = useTransform(sx, (v) => v * 28);
  const ringPitch = useTransform([tilt, sy], ([a, b]: number[]) => a - b * 20);
  const contentX = useTransform(sx, (v) => v * -14);
  const contentY = useTransform(sy, (v) => v * -10);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32"
    >
      {/* L0 — Horizon: sun-glow (the star field is global) */}
      <ParallaxLayer speed={0.15} distance={700} className="pointer-events-none absolute inset-0 -z-30" aria-hidden>
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-[48%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.18),rgb(255_106_26/0.05)_45%,transparent_70%)]"
        />
      </ParallaxLayer>

      {/* L1 — Atmosphere: orbit rings */}
      <ParallaxLayer speed={0.35} distance={600} className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
          <motion.div
            style={{ rotateX: ringPitch, rotateY: ringYaw, scale: ringScale, opacity: ringOpacity }}
            className="w-[min(1080px,165vw)] [transform-style:preserve-3d] md:w-[min(1080px,96vw)]"
          >
            <Orbit />
          </motion.div>
        </div>
      </ParallaxLayer>

      {/* Scrim keeps text ≥ 4.5:1 over rings at every scroll position */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,rgb(7_7_7/0.6),transparent_75%)]" />

      {/* L2 — Content */}
      <motion.div style={{ opacity: contentOpacity, x: contentX, y: contentY }} className="container-x relative flex flex-col items-center text-center">
        <Wordmark className="text-[40px] leading-none text-ink md:text-[52px]" />
        <h1 id="hero-title" className="mt-8 max-w-[14ch] text-hero font-semibold">
          <AccentText heading={hero.headline} />
        </h1>
        <p className="mt-7 max-w-[34rem] text-[17px] text-muted md:text-[19px]">{hero.sub}</p>
        <a
          href={hero.pill.href}
          className="group mt-9 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 py-1.5 pl-2 pr-4 text-[14px] text-muted backdrop-blur-md transition-colors duration-2 hover:border-line-strong hover:text-ink"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-success">
            <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-success" />
            {hero.pill.tag}
          </span>
          <span className="hidden sm:inline">{hero.pill.label}</span>
          <span className="sm:hidden">{hero.pill.shortLabel}</span>
          <span aria-hidden="true" className="transition-transform duration-2 group-hover:translate-x-0.5">→</span>
        </a>
      </motion.div>

      {/* Domains ticker */}
      <Marquee items={domains.map((d) => d.title)} className="absolute inset-x-0 bottom-[136px] hidden sm:block [@media(max-height:760px)]:hidden" />

      {/* Scroll cue — a thin orange line that grows as scrolling begins */}
      <div aria-hidden="true" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 [@media(max-height:560px)]:hidden">
        <span className="micro">{hero.scrollCue}</span>
        <span className="scroll-cue-line block h-14 w-px bg-orange" />
      </div>
    </section>
  );
}
