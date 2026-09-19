import type { ReactNode } from "react";

type Tone = "orange" | "neutral" | "live";

const tones: Record<Tone, string> = {
  orange: "bg-orange-tint text-orange",
  neutral: "border border-line text-muted",
  live: "bg-success/10 text-success",
};

export function Chip({ children, tone = "orange", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-micro uppercase ${tones[tone]} ${className}`}
    >
      {tone === "live" && <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />}
      {children}
    </span>
  );
}
