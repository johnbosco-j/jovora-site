// Client work Riven takes on. Copy only — the Services section renders whatever is here.

export type Service = {
  id: string;
  /** Key into components/ui/Icon.tsx */
  icon: string;
  title: string;
  description: string;
  /** Short deliverables, shown as mono tags */
  includes: string[];
};

export const servicesSection = {
  label: "Services",
  heading: { before: "Built for", accent: "you", after: ", too." },
  intro:
    "Riven also builds for people and organisations who need it — full-stack websites and AI development at a minimal, optimal cost, with the same engineering standard we hold our own products to.",
  cta: { label: "Start a project", href: "#contact" },
  costTitle: "How we keep cost minimal",
};

export const services: Service[] = [
  {
    id: "web",
    icon: "web",
    title: "Full-stack websites & web apps",
    description:
      "Company sites, dashboards, portals and complete web applications — designed, built, deployed and handed over.",
    includes: ["Next.js · React", "APIs & databases", "Auth & payments", "Hosting & SEO"],
  },
  {
    id: "ai",
    icon: "ai",
    title: "AI & computer vision",
    description:
      "Custom models, on-device detection, AI assistants and smart features added to the product you already have.",
    includes: ["Computer vision", "LLM features", "Chatbots", "Data pipelines"],
  },
  {
    id: "systems",
    icon: "enterprise",
    title: "Institutional & business systems",
    description:
      "ERP, role-based portals and workflow tools for colleges, institutions and small businesses.",
    includes: ["ERP", "Role-based access", "Workflows", "Reports"],
  },
];

export const costPrinciples: { title: string; body: string }[] = [
  { title: "Scoped up front", body: "A clear quote before any work starts — no surprise invoices." },
  { title: "Lean by default", body: "The simplest stack that does the job, so you don't pay for complexity." },
  { title: "Yours to keep", body: "Full source code and accounts handed over at the end." },
];
