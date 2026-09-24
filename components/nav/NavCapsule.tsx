"use client";

import { Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Monogram, Wordmark } from "@/components/brand/Wordmark";
import { LINKS, site } from "@/content/site";

export function NavCapsule() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);

  // Highlight the section under the viewport's middle; the orange CTA fill only appears
  // after the hero so the hero's own primary button stays the single orange fill in view.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const update = useCallback(() => {
    const mid = window.innerHeight * 0.5;
    const intro = document.getElementById("about") ?? document.getElementById("top");
    setPastHero(!!intro && intro.getBoundingClientRect().bottom < mid);
    let current: string | null = null;
    for (const item of site.nav) {
      const el = document.getElementById(item.href.slice(1));
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) current = el.id;
    }
    setActive(current);
  }, []);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const id = requestAnimationFrame(update); // initial state after a reload mid-page
    return () => cancelAnimationFrame(id);
  }, [update]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restore = () => {
      document.body.style.overflow = prev;
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      restore();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Services and Contact have their own orange button — keep one orange fill per viewport.
  const ctaClass = pastHero && active !== "contact" && active !== "services"
    ? "bg-orange text-black hover:bg-orange-hot"
    : "border border-line-strong text-ink hover:border-orange";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative mx-auto flex h-14 max-w-[960px] items-center justify-between gap-4 overflow-hidden rounded-full border border-line bg-surface/70 pl-3 pr-2 shadow-hairline backdrop-blur-[18px] backdrop-saturate-[1.4]"
      >
        {/* reading progress */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left bg-gradient-to-r from-orange/0 via-orange to-orange-hot"
        />
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2" aria-label="Riven — back to top">
          <Monogram size={32} />
          <Wordmark className="text-[24px] leading-none" />
        </a>

        <ul className="hidden items-center gap-1 min-[820px]:flex">
          {site.nav.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] transition-colors duration-2 ${
                    isActive ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <a
            href={site.navCta.href}
            className={`hidden h-10 items-center rounded-full px-4 text-[14px] font-medium transition-colors duration-2 min-[820px]:inline-flex ${ctaClass}`}
          >
            {site.navCta.label}
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink min-[820px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile: full-screen menu */}
      {open && (
        <div
          id="mobile-menu"
          className="menu-sheet pointer-events-auto fixed inset-0 -z-10 flex flex-col bg-bg/95 px-6 pb-8 pt-28 backdrop-blur-2xl min-[820px]:hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.16),transparent)]" />
          <ul className="relative flex flex-col">
            {site.nav.map((item, i) => (
              <li key={item.href} className="menu-item border-b border-line" style={{ ["--i" as string]: i }}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-serif text-[40px] leading-none tracking-[-0.02em] text-ink active:text-orange-hot"
                >
                  <span className="font-mono text-[12px] text-orange">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-item relative mt-auto flex flex-col gap-4" style={{ ["--i" as string]: site.nav.length }}>
            <a
              href={site.navCta.href}
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-center rounded-full bg-orange text-[16px] font-medium text-black"
            >
              {site.navCta.label}
            </a>
            <div className="flex items-center justify-between font-mono text-[12px] text-faint">
              <a href={`mailto:${LINKS.contactEmail}`} className="py-2">{LINKS.contactEmail}</a>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="py-2">
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
