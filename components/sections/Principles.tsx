import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

export function Principles() {
  const { principles } = site;
  return (
    <section aria-labelledby="principles-title" className="relative border-t border-line bg-bg-2 py-22 md:py-32">
      <div className="container-x">
        <h2 id="principles-title" className="micro reveal mb-12 md:mb-16">
          {principles.label}
        </h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {principles.items.map((p, i) => (
            <li key={p.title} className="reveal flex flex-col gap-4 border-t border-line pt-6" style={{ ["--i" as string]: i + 1 }}>
              <div className="flex items-center justify-between">
                <Icon name={p.icon} className="text-muted" />
                <span className="font-mono text-micro text-faint">0{i + 1}</span>
              </div>
              <h3 className="text-[24px] font-semibold md:text-[28px]">{p.title}</h3>
              <p className="max-w-[34ch] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
