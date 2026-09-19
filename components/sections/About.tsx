"use client";

import { useEffect, useRef, useState } from "react";
import { RobotStage } from "@/components/about/RobotStage";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { about } from "@/content/about";

/**
 * Who we are + why we're different, with Jovo alongside.
 * The active "why" point drives Jovo's gesture and speech bubble:
 *  - laptop: hover or keyboard focus a point;
 *  - phone: Jovo stays pinned at the top and reacts as each point scrolls into the reading zone.
 */
export function About() {
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el || window.matchMedia("(pointer: fine)").matches) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-index]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-58% 0px -28% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  const current = active === null ? null : about.why[active];

  return (
    <section id="about" aria-labelledby="about-title" className="section-divider relative overflow-x-clip section-y">
      <div className="container-x md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* Jovo: pinned under the nav on phones, sticky beside the copy on desktop */}
        <div className="sticky top-[76px] z-20 -mx-1 mb-10 md:static md:order-last md:col-span-5 md:mx-0 md:mb-0">
          <div className="md:sticky md:top-[14vh] lg:top-[12vh]">
            <RobotStage mascot={about.mascot} active={current ? { emote: current.emote, says: current.says } : null} />
          </div>
        </div>

        <div className="md:col-span-7">
          <h2 id="about-title" className="micro reveal flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-orange" />
            {about.label}
          </h2>
          <p className="reveal mt-6 font-serif text-[clamp(30px,4.1vw,54px)] font-normal leading-[1.08] tracking-[-0.015em] text-ink" style={{ ["--i" as string]: 1 }}>
            {about.statement.map((part, i) =>
              part.accent ? (
                <em key={i} className="italic text-orange-hot">
                  {part.text}
                </em>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <div className="mt-8 flex max-w-[58ch] flex-col gap-4 text-muted">
            {about.detail.map((d, i) => (
              <p key={i} className="reveal" style={{ ["--i" as string]: i + 2 }}>
                {d}
              </p>
            ))}
          </div>

          <div className="mt-20 md:mt-28">
            <p className="micro reveal flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-orange" />
              {about.whyLabel}
            </p>
            <h3 className="reveal mt-5 text-h2" style={{ ["--i" as string]: 1 }}>
              <AccentText heading={about.whyHeading} />
            </h3>
            <ol ref={list} className="mt-10 flex flex-col gap-3" onPointerLeave={() => setActive(null)}>
              {about.why.map((w, i) => {
                const on = active === i;
                return (
                  <li
                    key={w.title}
                    data-index={i}
                    tabIndex={0}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={on ? "true" : undefined}
                    className={`group relative grid cursor-default grid-cols-[40px_1fr] gap-x-4 overflow-hidden rounded-card border px-5 py-6 outline-none transition-[background-color,border-color,transform] duration-2 ease-out sm:grid-cols-[52px_1fr] md:px-7 ${
                      on ? "translate-x-1 border-line-strong bg-surface/70" : "border-transparent bg-transparent"
                    }`}
                  >
                    <span aria-hidden="true" className={`absolute inset-y-4 left-0 w-px bg-orange transition-opacity duration-2 ${on ? "opacity-100" : "opacity-0"}`} />
                    <span className={`pt-2 font-mono text-[13px] tabular-nums transition-colors duration-2 ${on ? "text-orange" : "text-faint"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={`font-serif text-[clamp(26px,2.8vw,36px)] italic leading-[1.1] tracking-[-0.01em] transition-colors duration-2 ${on ? "text-orange-hot" : "text-ink"}`}>
                        {w.title}
                      </p>
                      <p className="mt-2 max-w-[52ch] text-muted">{w.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <Button href={about.primary.href}>{about.primary.label}</Button>
            <Button href={about.secondary.href} variant="secondary">
              {about.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
