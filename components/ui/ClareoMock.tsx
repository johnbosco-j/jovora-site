/**
 * Coded stand-in for the Clareo dashboard screenshot. Neutral greys only — Clareo's
 * lime stays on Clareo's own domain. Replace with a real screenshot via
 * `screenshot` in content/products.ts.
 */
const bars = [42, 58, 51, 66, 72, 61, 80];
const days = ["M", "T", "W", "T", "F", "S", "S"];
const spark = "M0 30 L12 26 L24 28 L36 18 L48 22 L60 12 L72 16 L84 9 L96 13 L108 6 L120 10";

export function ClareoMock() {
  return (
    <div className="grid h-full grid-cols-[52px_1fr] text-[11px] text-muted sm:grid-cols-[140px_1fr]" aria-hidden="true">
      <aside className="flex flex-col gap-1 border-r border-line bg-bg/60 p-2 sm:p-3">
        <div className="mb-3 flex items-center gap-2 px-1 font-serif text-[15px] text-ink">
          <span className="size-3 rounded-full border border-ink/60" />
          <span className="hidden sm:inline">Clareo</span>
        </div>
        {["Live", "Analytics", "Coach", "Reminders", "Settings"].map((l, i) => (
          <div key={l} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-surface-2 text-ink" : ""}`}>
            <span className="size-2 rounded-sm bg-line-strong" />
            <span className="hidden sm:inline">{l}</span>
          </div>
        ))}
      </aside>
      <div className="grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-4">
        <div className="col-span-2 flex items-center justify-between rounded-lg border border-line bg-surface-2/60 px-3 py-2">
          <span className="text-ink">Monitoring · on-device</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-success">
            <span className="size-1.5 rounded-full bg-success" /> Eyes open
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface-2/60 p-3">
          <span>Fatigue score</span>
          <div className="relative mx-auto size-16 sm:size-20">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" className="stroke-line" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" className="stroke-ink/80" strokeWidth="3" strokeDasharray="94.2" strokeDashoffset="68" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-mono text-[15px] text-ink">28</span>
          </div>
          <span className="text-center text-faint">Low</span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface-2/60 p-3">
          <span>Blink rate</span>
          <span className="font-mono text-[20px] text-ink sm:text-[24px]">
            16<span className="text-[11px] text-faint"> /min</span>
          </span>
          <svg viewBox="0 0 120 36" className="mt-auto h-8 w-full" preserveAspectRatio="none">
            <path d={spark} fill="none" className="stroke-muted" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="col-span-2 flex flex-col gap-2 rounded-lg border border-line bg-surface-2/60 p-3">
          <div className="flex justify-between">
            <span>Screen time this week</span>
            <span className="font-mono text-faint">Breaks taken 31</span>
          </div>
          <div className="flex h-16 items-end gap-2 sm:h-20">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className={`w-full rounded-sm ${i === 6 ? "bg-ink/70" : "bg-line-strong"}`} style={{ height: `${h}%` }} />
                <span className="font-mono text-[9px] text-faint">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
