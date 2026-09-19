import { AppWindow, Bot, BrainCircuit, Building2, Gauge, GraduationCap, HeartPulse, ScanEye, ShieldCheck, Terminal, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Content files reference icons by key so copy never imports JSX.
const registry: Record<string, LucideIcon> = {
  perception: ScanEye,
  health: HeartPulse,
  robotics: Bot,
  devtools: Terminal,
  education: GraduationCap,
  enterprise: Building2,
  shield: ShieldCheck,
  gauge: Gauge,
  people: Users,
  web: AppWindow,
  ai: BrainCircuit,
};

export function Icon({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) {
  const Cmp = registry[name] ?? ScanEye;
  return <Cmp aria-hidden="true" size={size} strokeWidth={1.5} className={className} />;
}
