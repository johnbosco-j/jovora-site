import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-1 ease-out active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-black hover:bg-orange-hot active:bg-orange-deep",
  secondary: "border border-line-strong text-ink hover:border-orange",
  ghost: "text-muted hover:text-ink",
};

type Props = {
  href?: string;
  variant?: Variant;
  external?: boolean;
  /** Label shown when `href` is missing (placeholder URL). Button renders disabled. */
  comingSoonLabel?: string;
  className?: string;
  children: ReactNode;
};

export function Button({ href, variant = "primary", external, comingSoonLabel, className = "", children }: Props) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed border border-dashed border-line-strong text-faint ${className}`}
      >
        {comingSoonLabel ?? children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true" className="transition-transform duration-1 group-hover:-translate-y-px group-hover:translate-x-px">
            ↗
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
