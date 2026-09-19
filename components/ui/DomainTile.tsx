import type { Domain, DomainStatus } from "@/content/domains";
import { Chip } from "./Chip";
import { Icon } from "./Icon";

const statusTone: Record<DomainStatus, "live" | "orange" | "neutral"> = {
  Shipping: "live",
  "In research": "orange",
  Coming: "neutral",
};

export function DomainTile({ domain, index }: { domain: Domain; index: number }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-6 md:aspect-[1/1.1] md:p-7">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[13px] text-faint tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <Chip tone={statusTone[domain.status]}>{domain.status}</Chip>
      </div>
      <Icon name={domain.icon} size={28} className="mt-8 text-muted transition-colors duration-2 group-hover:text-orange md:mt-auto" />
      <h3 className="mt-5 text-[24px] font-semibold leading-tight">{domain.title}</h3>
      <p className="mt-3 text-[15px] text-muted">{domain.description}</p>
    </article>
  );
}
