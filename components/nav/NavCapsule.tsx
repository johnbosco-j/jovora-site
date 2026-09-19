"use client";

import { Menu, X } from "lucide-react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Monogram, Wordmark } from "@/components/brand/Wordmark";
import { site } from "@/content/site";

export function NavCapsule() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);

  // Highlight the section under the viewport's middle; the orange CTA fill only appears
  // after the hero so the hero's own primary button stays the single orange fill in view.
  const { scrollY } = useScroll();
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Services and Contact have their own orange button — keep one orange fill per viewport.
  const ctaClass = pastHero && active !== "contact" && active !== "services"
    ? "bg-orange text-black hover:bg-orange-hot"
    : "border border-line-strong text-ink hover:border-orange";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex h-14 max-w-[960px] items-center justify-between gap-4 rounded-full border border-line bg-surface/70 pl-3 pr-2 shadow-hairline backdrop-blur-[18px] backdrop-saturate-[1.4]"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2" aria-label="Jovora — back to top">
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
                  className={`rounded-full px-3.5 py-2 text-[14px] transition-colors duration-1 ${
                    isActive ? "text-orange" : "text-muted hover:text-ink"
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

      <div
        id="mobile-menu"
        hidden={!open}
        className="pointer-events-auto mx-auto mt-2 max-w-[960px] rounded-panel border border-line bg-surface/95 p-3 shadow-hairline backdrop-blur-[18px] min-[820px]:hidden"
      >
        <ul className="flex flex-col">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center rounded-input px-4 text-[17px] text-ink hover:bg-surface-2"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a
              href={site.navCta.href}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center rounded-full bg-orange font-medium text-black"
            >
              {site.navCta.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
