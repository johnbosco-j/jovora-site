"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DomainTile } from "@/components/ui/DomainTile";
import { SectionHeader } from "@/components/ui/AccentHeading";
import { domains, type Domain } from "@/content/domains";
import { site } from "@/content/site";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Domains horizon. Desktop + motion allowed: the section pins (~240vh) and tiles slide
 * horizontally; the centred tile lifts and brightens while the horizon glow drifts
 * orange → amber. Mobile or reduced motion: plain stacked grid (layout is decided in
 * CSS — see .domains-* in globals.css — so it is correct before JS runs).
 */
export function Domains() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");
  const pinned = desktop && !reduce;
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el || !pinned) return;
    const measure = () => setMaxX(Math.max(0, el.scrollWidth - el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.06, 0.94], [0, pinned ? -maxX : 0]);
  const amber = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const orange = useTransform(amber, (v) => 1 - v * 0.7);
  const glowX = useTransform(scrollYProgress, [0, 1], pinned ? ["-12vw", "12vw"] : ["0vw", "0vw"]);

  return (
    <section id="domains" ref={section} aria-labelledby="domains-title" className="domains-section relative border-t border-line">
      <div className="domains-sticky relative overflow-hidden py-22 md:py-0">
        {/* L0 horizon glow: orange crossfading to amber (opacity + transform only) */}
        <motion.div aria-hidden="true" style={{ x: glowX }} className="pointer-events-none absolute inset-x-0 bottom-[-30vh] -z-10 mx-auto h-[70vh] w-[110vw] max-w-none">
          <motion.div style={{ opacity: orange }} className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_106_26/0.16),transparent)]" />
          <motion.div style={{ opacity: amber }} className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_176_46/0.13),transparent)]" />
        </motion.div>

        <div className="flex w-full flex-col gap-10 md:gap-12">
          <div className="container-x">
            <SectionHeader id="domains-title" label={site.domainsSection.label} heading={site.domainsSection.heading} intro={site.domainsSection.intro} />
          </div>
          <div ref={track} className="domains-viewport">
            <motion.ol style={{ x }} className="domains-track" aria-label="Domains">
              {domains.map((d, i) => (
                <TileSlot key={d.id} domain={d} index={i} count={domains.length} progress={scrollYProgress} pinned={pinned} />
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function TileSlot({
  domain,
  index,
  count,
  progress,
  pinned,
}: {
  domain: Domain;
  index: number;
  count: number;
  progress: MotionValue<number>;
  pinned: boolean;
}) {
  // Track padding centres tile 0 at x=0 and the last tile at x=-max, so each tile's
  // centre moment is linear in scroll progress.
  const c = 0.06 + (0.88 * index) / Math.max(1, count - 1);
  const d = 0.88 / Math.max(1, count - 1);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const y = useTransform(progress, [clamp(c - d), c, clamp(c + d)], pinned ? [0, -16, 0] : [0, 0, 0]);
  const glow = useTransform(progress, [clamp(c - d * 0.8), c, clamp(c + d * 0.8)], pinned ? [0, 1, 0] : [0, 0, 0]);

  return (
    <motion.li style={{ y }} className="relative">
      <motion.div
        aria-hidden="true"
        style={{ opacity: glow }}
        className="pointer-events-none absolute -inset-px z-10 rounded-card border border-orange/40 shadow-[0_24px_80px_-24px_rgb(255_106_26/0.45)]"
      />
      <DomainTile domain={domain} index={index} />
    </motion.li>
  );
}
