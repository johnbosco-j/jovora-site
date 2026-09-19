/**
 * Jovora wordmark — Instrument Serif. The second "o" carries the orbit dot,
 * the logo's single animated element (12s orbit; still under reduced motion).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-[-0.02em] ${className}`} aria-label="Jovora" role="img">
      <span aria-hidden="true">
        Jov
        <span className="relative inline-block">
          o
          <span className="spin-12 absolute inset-0 flex justify-center" style={{ top: "0.28em", bottom: "0.02em" }}>
            <span className="-mt-[0.1em] block size-[0.14em] rounded-full bg-orange" />
          </span>
        </span>
        ra
      </span>
    </span>
  );
}

/** Monogram: a "J" inside an orange hairline ring on a surface rounded square. */
export function Monogram({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="16" className="fill-surface" />
      <circle cx="32" cy="32" r="21" fill="none" className="stroke-orange" strokeWidth="1.6" />
      <circle cx="50.2" cy="21.5" r="3" className="fill-orange" />
      <path
        d="M36 19v17.5c0 5-3 8-7.6 8-3.4 0-5.9-1.8-6.9-4.8"
        fill="none"
        className="stroke-ink"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
