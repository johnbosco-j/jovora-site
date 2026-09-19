import Image from "next/image";
import type { Founder } from "@/content/founder";
import { Button } from "./Button";

function Highlight({ text, strong }: { text: string; strong: string[] }) {
  if (strong.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${strong.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        strong.includes(part) ? (
          <strong key={i} className="font-medium text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function FounderCard({ founder }: { founder: Founder }) {
  return (
    <article aria-labelledby="founder-name" className="card relative grid gap-10 overflow-hidden p-6 sm:p-10 md:grid-cols-12 md:gap-12 lg:p-14">
      <div className="flex items-start justify-center md:col-span-4 md:justify-start">
        {/* Monogram (or photo) inside an orange orbit ring */}
        <div className="relative size-[200px] sm:size-[240px]">
          <svg viewBox="0 0 240 240" className="spin-60 absolute inset-0 size-full" aria-hidden="true">
            <circle cx="120" cy="120" r="116" fill="none" className="stroke-orange" strokeOpacity="0.35" strokeWidth="1" />
            <circle cx="120" cy="120" r="116" fill="none" className="stroke-orange" strokeWidth="1.5" strokeDasharray="120 729" strokeLinecap="round" />
            <circle cx="236" cy="120" r="3.5" className="fill-orange" />
          </svg>
          <div className="absolute inset-5 grid place-items-center overflow-hidden rounded-full border border-line bg-surface-2">
            {founder.photo ? (
              <Image src={founder.photo.src} alt={founder.photo.alt} fill sizes="240px" className="object-cover" />
            ) : (
              <span className="font-serif text-[72px] leading-none tracking-[-0.02em] text-ink sm:text-[88px]" aria-hidden="true">
                {founder.monogram}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:col-span-8">
        <h3 id="founder-name" className="text-[36px] font-semibold leading-none tracking-[-0.035em] md:text-[48px]">
          {founder.name}
        </h3>
        <p className="mt-3 font-serif text-[22px] italic text-muted">{founder.role}</p>

        <p className="mt-8 text-muted">
          {founder.education.degree} at <span className="text-ink">{founder.education.institution}</span>, {founder.education.city}.
        </p>
        <p className="mt-3 text-muted">{founder.summary}</p>

        <ul className="mt-8 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {founder.highlights.map((h) => (
            <li key={h.text} className="flex gap-3 text-[15px] text-muted">
              <span aria-hidden="true" className="mt-[9px] h-px w-3 flex-none bg-orange" />
              <span>
                <Highlight {...h} />
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[14px] text-faint">
          <span className="font-mono text-micro uppercase">Interests</span> · {founder.interests}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={founder.links.portfolio} external variant="secondary" comingSoonLabel="Portfolio — coming soon">
            View portfolio
          </Button>
          <Button href={founder.links.github} external variant="secondary">
            GitHub
          </Button>
        </div>
      </div>
    </article>
  );
}
