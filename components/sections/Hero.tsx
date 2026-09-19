"use client";

import { motion, useScroll, useSpring, useTime, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ParallaxLayer } from "@/components/parallax/ParallaxLayer";
import { AccentText } from "@/components/ui/AccentHeading";
import { site } from "@/content/site";
import { useMotionScale } from "@/lib/hooks";
import { gyroNeedsPermission, motionGranted, requestGyro, shakeEnergy, shakeX, shakeY, startTilt, tiltX, tiltY } from "@/lib/tilt";
import { domains } from "@/content/domains";
import { Marquee } from "@/components/ui/Marquee";
import { Orbit3D } from "./Orbit3D";

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

  // iOS asks before sharing motion; offer a tap (touch devices only, once).
  const [askMotion, setAskMotion] = useState(false);
  useEffect(() => {
    const touch = !window.matchMedia("(pointer: fine)").matches;
    const id = requestAnimationFrame(() => setAskMotion(touch && !!scale && gyroNeedsPermission() && !motionGranted()));
    return () => cancelAnimationFrame(id);
  }, [scale]);
  const sx = useSpring(tiltX, { stiffness: 110, damping: 18 });
  const sy = useSpring(tiltY, { stiffness: 110, damping: 18 });
  // A slow idle sway keeps the 3D alive even before anyone moves the mouse or phone.
  const time = useTime();
  const sway = useTransform(time, (t) => (scale ? Math.sin(t / 3800) : 0));
  // Phones/tablets: a shake kicks the orbit, which wobbles on a loose spring and settles.
  const kx = useSpring(shakeX, { stiffness: 70, damping: 5 });
  const ky = useSpring(shakeY, { stiffness: 70, damping: 5 });
  const kick = useSpring(shakeEnergy, { stiffness: 40, damping: 8 });
  const ringYaw = useTransform([sx, sway, kx], ([x, w, k]: number[]) => x * 56 + w * 9 + k * 120);
  const ringPitch = useTransform([tilt, sy, sway, ky], ([a, y, w, k]: number[]) => 14 * Math.min(scale, 1) + a - y * 40 + w * 3 + k * 90);
  const ringSpin = useTransform(kick, (v) => v * 70);
  // Text sits on stacked depth planes and turns with the gaze (wordmark nearest).
  const textYaw = useTransform(sx, (v) => v * 16);
  const textPitch = useTransform(sy, (v) => v * -12);
  const contentX = useTransform(sx, (v) => v * -18);
  const contentY = useTransform(sy, (v) => v * -12);
  // A warm light that follows the cursor (or phone tilt) across the hero.
  const lightX = useTransform(sx, (v) => `${v * 90}vw`);
  const lightY = useTransform(sy, (v) => `${v * 90}vh`);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-6 pt-32"
    >
      {/* L0 — Horizon: sun-glow (the star field is global) */}
      <ParallaxLayer speed={0.15} distance={700} className="pointer-events-none absolute inset-0 -z-30" aria-hidden>
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-[48%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.26),rgb(255_106_26/0.07)_45%,transparent_70%)]"
        />
      </ParallaxLayer>

      {/* L1 — Atmosphere: orbit rings */}
      <ParallaxLayer speed={0.35} distance={600} className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
        <motion.div style={{ opacity: ringOpacity }} className="absolute inset-0 flex items-center justify-center">
          <Orbit3D rotateX={ringPitch} rotateY={ringYaw} rotateZ={ringSpin} scale={ringScale} className="w-[min(1080px,170vw)] translate-y-[16%] md:w-[min(1040px,94vw)] md:translate-y-0" />
        </motion.div>
      </ParallaxLayer>

      {/* Cursor / tilt light */}
      <motion.div
        aria-hidden="true"
        style={{ x: lightX, y: lightY, opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 -ml-[320px] -mt-[320px] size-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(255_138_61/0.16),transparent)]"
      />

      {/* Scrim keeps text ≥ 4.5:1 over rings at every scroll position */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_35%_at_50%_45%,rgb(7_7_7/0.5),transparent_75%)] md:bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,rgb(7_7_7/0.6),transparent_75%)]" />

      {/* L2 — Content */}
      <div className="flex flex-1 items-center">
        {/* opacity on the outer layer; 3D lives inside its own perspective (opacity would flatten it) */}
        <motion.div style={{ opacity: contentOpacity, x: contentX, y: contentY }} className="container-x relative [perspective:1200px]">
          <motion.div
            style={{ rotateX: textPitch, rotateY: textYaw }}
            className="flex flex-col items-center text-center [transform-style:preserve-3d]"
          >
            <div style={{ transform: "translateZ(90px)" }}>
              <Wordmark className="text-[40px] leading-none text-ink md:text-[52px]" />
            </div>
            <h1 id="hero-title" className="mt-8 max-w-[14ch] text-hero font-semibold" style={{ transform: "translateZ(45px)" }}>
              <AccentText heading={hero.headline} glow />
            </h1>
            <p className="mt-8 max-w-[36rem] font-modern text-[18px] font-light leading-[1.55] tracking-[-0.01em] text-ink/80 md:text-[21px]">
              {hero.sub}
            </p>
            {askMotion && (
              <button
                type="button"
                onClick={async () => {
                  if (await requestGyro()) setAskMotion(false);
                }}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-mono text-micro uppercase text-muted"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-orange" />
                {hero.motionPrompt}
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Domains ticker */}
      <Marquee items={domains.map((d) => d.title)} className="mt-12 hidden sm:block [@media(max-height:700px)]:hidden" />
    </section>
  );
}
