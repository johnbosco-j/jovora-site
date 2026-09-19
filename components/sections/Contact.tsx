import { SectionHeader } from "@/components/ui/AccentHeading";
import { LINKS, site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const c = site.contact;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-line bg-bg-2 section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <SectionHeader id="contact-title" label={c.label} heading={c.heading} intro={c.intro} />
          <p className="reveal text-muted" style={{ ["--i" as string]: 3 }}>
            <span className="micro mb-2 block">{c.emailLabel}</span>
            <a href={`mailto:${LINKS.contactEmail}`} className="font-mono text-[18px] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-orange hover:decoration-orange">
              {LINKS.contactEmail}
            </a>
          </p>
        </div>
        <div className="lg:col-span-7">
          <ContactForm topics={c.topics} success={c.success} />
        </div>
      </div>
    </section>
  );
}
