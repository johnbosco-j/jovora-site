/**
 * Riven wordmark — Instrument Serif. The "e" of Riven carries the orbit dot,
 * the logo's single animated element (12s orbit; still under reduced motion).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-[-0.02em] ${className}`} aria-label="Riven" role="img">
      <span aria-hidden="true">
        Riv
        <span className="relative inline-block">
          e
          <span className="spin-12 absolute inset-0 flex justify-center" style={{ top: "0.3em", bottom: "0.02em" }}>
            <span className="-mt-[0.1em] block size-[0.13em] rounded-full bg-orange" />
          </span>
        </span>
        n
      </span>
    </span>
  );
}

/** Monogram: an "R" inside an orange hairline ring on a surface rounded square. */
export function Monogram({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="16" className="fill-surface" />
      <circle cx="32" cy="32" r="21" fill="none" className="stroke-orange" strokeWidth="1.6" />
      <circle cx="50.2" cy="21.5" r="3" className="fill-orange" />
      <path
        d="M25 19v26M25 19h8.5a6.5 6.5 0 0 1 0 13H25M32.5 32 41 45"
        fill="none"
        className="stroke-ink"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
