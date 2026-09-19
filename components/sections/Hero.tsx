"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { Button } from "@/components/ui/Button";
import { AccentText } from "@/components/ui/AccentHeading";
import { site } from "@/content/site";
import { useMotionScale } from "@/lib/hooks";
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

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32"
    >
      {/* L0 — Horizon: sun-glow, dot field, faint J monogram */}
      <ParallaxLayer speed={0.15} distance={700} className="pointer-events-none absolute inset-0 -z-30" aria-hidden>
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-[48%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.18),rgb(255_106_26/0.05)_45%,transparent_70%)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgb(244_242_238/0.09)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        <span className="absolute right-[3vw] top-[6vh] select-none font-serif text-[88vh] leading-[0.8] text-ink/[0.022]">J</span>
      </ParallaxLayer>

      {/* L1 — Atmosphere: orbit rings */}
      <ParallaxLayer speed={0.35} distance={600} className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
          <motion.div
            style={{ rotateX: tilt, scale: ringScale, opacity: ringOpacity }}
            className="w-[min(1080px,165vw)] [transform-style:preserve-3d] md:w-[min(1080px,96vw)]"
          >
            <Orbit />
          </motion.div>
        </div>
      </ParallaxLayer>

      {/* Scrim keeps text ≥ 4.5:1 over rings at every scroll position */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,rgb(7_7_7/0.6),transparent_75%)]" />

      {/* L2 — Content */}
      <motion.div style={{ opacity: contentOpacity }} className="container-x relative flex flex-col items-center text-center">
        <Wordmark className="text-[40px] leading-none text-ink md:text-[52px]" />
        <p className="micro mt-7 text-muted">{hero.label}</p>
        <h1 id="hero-title" className="mt-6 max-w-[14ch] text-hero font-semibold">
          <AccentText heading={hero.headline} />
        </h1>
        <p className="mt-7 max-w-[34rem] text-[17px] text-muted md:text-[19px]">{hero.sub}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <Button href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </Button>
        </div>
      </motion.div>

      {/* Scroll cue — a thin orange line that grows as scrolling begins */}
      <div aria-hidden="true" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex [@media(max-height:760px)]:hidden">
        <span className="micro">{hero.scrollCue}</span>
        <span className="scroll-cue-line block h-14 w-px bg-orange" />
      </div>
    </section>
  );
}
