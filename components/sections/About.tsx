"use client";

import { useEffect, useRef, useState } from "react";
import { RobotStage } from "@/components/about/RobotStage";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { about } from "@/content/about";

/**
 * Who we are + why we're different, with Jovo.
 *
 * The active "why" point drives Jovo's gesture and speech bubble.
 *  - Laptop: Jovo sticks beside the copy; hover or focus a point.
 *  - Tablet: same layout; points activate as they scroll through the middle of the screen.
 *  - Phone: Jovo sits inline (never over the text) right above a swipeable row of
 *    point cards — Jovo and the current card are always on screen together.
 *
 * Only one Jovo is ever initialised: the other instance is display:none, so its
 * lazy loader never fires.
 */
export function About() {
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-index]"));
    const pick = (entries: IntersectionObserverEntry[]) =>
      entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index)));

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let io: IntersectionObserver | null = null;
    if (phone) io = new IntersectionObserver(pick, { root: el, threshold: 0.6 }); // the card snapped into view
    else if (!fine) io = new IntersectionObserver(pick, { rootMargin: "-45% 0px -45% 0px" }); // tablet reading band
    items.forEach((i) => io?.observe(i));
    return () => io?.disconnect();
  }, []);

  const goTo = (i: number) =>
    list.current?.querySelector<HTMLElement>(`[data-index="${i}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

  const current = active === null ? null : about.why[active];
  const jovo = <RobotStage mascot={about.mascot} active={current ? { emote: current.emote, says: current.says } : null} />;

  return (
    <section id="about" aria-labelledby="about-title" className="section-divider relative overflow-x-clip section-y">
      <div className="container-x md:grid md:grid-cols-12 md:gap-8 lg:gap-12">
        {/* Tablet & laptop: Jovo sticky beside the copy */}
        <div className="hidden md:order-last md:col-span-5 md:block">
          <div className="md:sticky md:top-[14vh] lg:top-[12vh]">{jovo}</div>
        </div>

        <div className="md:col-span-7">
          <h2 id="about-title" className="micro reveal flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-orange" />
            {about.label}
          </h2>
          <p className="reveal mt-6 font-serif text-[29px] font-normal leading-[1.1] tracking-[-0.015em] text-ink md:hidden" style={{ ["--i" as string]: 1 }}>
            <Statement parts={about.statementShort} />
          </p>
          <p className="reveal mt-6 hidden font-serif text-[clamp(30px,4.1vw,54px)] font-normal leading-[1.08] tracking-[-0.015em] text-ink md:block" style={{ ["--i" as string]: 1 }}>
            <Statement parts={about.statement} />
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

            {/* Phone: Jovo inline, directly above the cards it talks about */}
            <div className="-mx-1 mt-8 md:hidden">{jovo}</div>

            <ol
              ref={list}
              aria-label={about.whyLabel}
              onPointerLeave={() => setActive(null)}
              className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 md:mx-0 md:mt-10 md:flex-col md:overflow-visible md:px-0 md:pb-0"
            >
              {about.why.map((w, i) => {
                const on = active === i;
                return (
                  <li
                    key={w.title}
                    data-index={i}
                    tabIndex={0}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={on ? "true" : undefined}
                    className={`group relative grid w-[84%] shrink-0 cursor-default snap-center grid-cols-[36px_1fr] gap-x-3 overflow-hidden rounded-card border px-5 py-6 outline-none transition-[background-color,border-color,transform] duration-2 ease-out sm:grid-cols-[52px_1fr] md:w-auto md:gap-x-4 md:px-7 ${
                      on ? "border-line-strong bg-surface/70 md:translate-x-1" : "border-line bg-surface/30 md:border-transparent md:bg-transparent"
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
                      <p className="mt-2 max-w-[52ch] text-[15px] text-muted md:text-base">{w.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Phone: position dots */}
            <div className="mt-4 flex items-center justify-between md:hidden">
              <span className="font-mono text-micro text-faint tabular-nums">
                {String((active ?? 0) + 1).padStart(2, "0")} / {String(about.why.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {about.why.map((w, i) => (
                  <button
                    key={w.title}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show point ${i + 1}: ${w.title}`}
                    className="grid size-8 place-items-center"
                  >
                    <span className={`block h-1.5 rounded-full transition-all duration-2 ${(active ?? 0) === i ? "w-5 bg-orange" : "w-1.5 bg-line-strong"}`} />
                  </button>
                ))}
              </div>
            </div>
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

function Statement({ parts }: { parts: readonly { text: string; accent?: boolean }[] }) {
  return (
    <>
      {parts.map((part, i) =>
        part.accent ? (
          <em key={i} className="italic text-orange-hot">
            {part.text}
          </em>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}
