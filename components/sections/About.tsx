import { RobotStage } from "@/components/about/RobotStage";
import { AccentText } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { about } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-x-clip border-t border-line section-y">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Robot: sticky beside the copy on desktop, above it on mobile */}
        <div className="order-first lg:order-last lg:col-span-5">
          <div className="lg:sticky lg:top-[14vh]">
            <RobotStage hint={about.robotHint} touchHint={about.robotTouchHint} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2 id="about-title" className="micro reveal">
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
            <p className="micro reveal">{about.whyLabel}</p>
            <h3 className="reveal mt-5 text-h2" style={{ ["--i" as string]: 1 }}>
              <AccentText heading={about.whyHeading} />
            </h3>
            <ol className="mt-10 border-t border-line">
              {about.why.map((w, i) => (
                <li
                  key={w.title}
                  data-emote={w.emote}
                  tabIndex={0}
                  className="reveal group grid grid-cols-[40px_1fr] gap-x-4 border-b border-line py-7 outline-none transition-colors duration-2 hover:bg-surface/40 focus-visible:bg-surface/40 sm:grid-cols-[56px_1fr] md:py-8"
                  style={{ ["--i" as string]: i % 3 }}
                >
                  <span className="pt-2 font-mono text-[13px] text-faint tabular-nums transition-colors duration-2 group-hover:text-orange group-focus-visible:text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-serif text-[clamp(26px,2.8vw,36px)] leading-[1.1] tracking-[-0.01em] text-ink">
                      <span className="italic transition-colors duration-2 group-hover:text-orange-hot group-focus-visible:text-orange-hot">{w.title}</span>
                    </p>
                    <p className="mt-2 max-w-[52ch] text-muted">{w.body}</p>
                  </div>
                </li>
              ))}
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
