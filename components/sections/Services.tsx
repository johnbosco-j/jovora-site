import { SectionHeader } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { costPrinciples, services, servicesSection as s } from "@/content/services";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative border-t border-line section-y">
      <div className="container-x">
        <SectionHeader id="services-title" label={s.label} heading={s.heading} intro={s.intro} />

        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3 md:gap-6">
          {services.map((svc, i) => (
            <li key={svc.id} className="reveal" style={{ ["--i" as string]: i }}>
              <article className="card card-hover group flex h-full flex-col p-6 md:p-7">
                <div className="flex items-start justify-between">
                  <Icon name={svc.icon} size={28} className="text-muted transition-colors duration-2 group-hover:text-orange" />
                  <span className="font-mono text-[13px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-10 text-[24px] font-semibold leading-tight">{svc.title}</h3>
                <p className="mt-3 text-[15px] text-muted">{svc.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label={`${svc.title} includes`}>
                  {svc.includes.map((tag) => (
                    <li key={tag} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        {/* Cost promise strip */}
        <div className="spotlight reveal relative mt-6 overflow-hidden rounded-panel border border-line bg-surface/70 p-6 shadow-hairline backdrop-blur-sm md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-[360px] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_26/0.12),transparent)]" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <h3 className="micro">{s.costTitle}</h3>
              <ol className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
                {costPrinciples.map((c, i) => (
                  <li key={c.title} className="flex flex-col gap-2">
                    <span className="font-mono text-[13px] text-orange tabular-nums">0{i + 1}</span>
                    <p className="text-[18px] font-semibold tracking-[-0.02em]">{c.title}</p>
                    <p className="text-[15px] text-muted">{c.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-3 lg:flex lg:justify-end">
              <Button href={s.cta.href}>
                {s.cta.label}
                <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
