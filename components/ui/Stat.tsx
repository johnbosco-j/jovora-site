export function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="sr-only">{label}</dt>
      <dd className={`font-mono whitespace-nowrap text-[34px] leading-none sm:text-[40px] tracking-tight tabular-nums lg:text-[56px] ${accent ? "text-orange" : "text-ink"}`}>
        {value}
      </dd>
      <dd aria-hidden="true" className="max-w-[30ch] text-[13px] leading-snug text-faint">
        {label}
      </dd>
    </div>
  );
}
