import { SectionHeader } from "@/components/ui/AccentHeading";
import { site } from "@/content/site";

export function Process() {
  const { process } = site;
  return (
    <section aria-labelledby="process-title" className="relative section-divider section-y">
      <div className="container-x">
        <SectionHeader id="process-title" label={process.label} heading={process.heading} />
        <ol className="relative mt-16 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {/* the thin orange line */}
          <span aria-hidden="true" className="draw-line absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-orange via-orange/40 to-transparent md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto md:bg-gradient-to-r" />
          {process.steps.map((s, i) => (
            <li key={s.title} className="reveal relative pl-10 md:pl-0 md:pt-12" style={{ ["--i" as string]: i + 1 }}>
              <span aria-hidden="true" className="absolute left-0 top-1.5 size-[11px] rounded-full border border-orange bg-bg shadow-[0_0_0_4px_rgb(255_106_26/0.12)] md:top-0" />
              <div className="card card-hover overflow-hidden p-6 md:p-7">
                <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[112px] font-medium leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_106_26/0.18)]">
                  0{i + 1}
                </span>
                <p className="font-mono text-micro uppercase text-faint">Step 0{i + 1}</p>
                <h3 className="mt-3 text-[26px] font-semibold">{s.title}</h3>
                <p className="mt-3 max-w-[32ch] text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
