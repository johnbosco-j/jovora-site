/** Slow, endless ticker. Decorative (the same content is listed in Domains). */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap px-6 font-mono text-micro uppercase text-faint">
          <span className="mr-6 size-1 rounded-full bg-orange/70" />
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] ${className}`}
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
