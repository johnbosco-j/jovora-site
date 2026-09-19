export type DomainStatus = "Shipping" | "In research" | "Coming";

/** Keys map to line icons in components/ui/Icon.tsx. */
export type DomainIcon = "perception" | "health" | "robotics" | "devtools" | "education" | "enterprise";

export type Domain = {
  id: string;
  title: string;
  shortTitle: string;
  icon: DomainIcon;
  description: string;
  status: DomainStatus;
};

// Order = display order. Index numbers (01, 02…) are derived from position.
export const domains: Domain[] = [
  {
    id: "ai-perception",
    title: "AI & Machine Perception",
    shortTitle: "AI",
    icon: "perception",
    description: "Models that see, hear and understand context — running on your device wherever they can.",
    status: "Shipping",
  },
  {
    id: "health",
    title: "Health & Human Wellbeing",
    shortTitle: "Health & Wellbeing",
    icon: "health",
    description: "Tools that protect people's attention, eyes, posture and rest through long days at a screen.",
    status: "Shipping",
  },
  {
    id: "robotics",
    title: "Robotics & Embedded Systems",
    shortTitle: "Robotics",
    icon: "robotics",
    description: "Perception and control for machines in the physical world, built for small edge devices.",
    status: "In research",
  },
  {
    id: "devtools",
    title: "Developer Tools",
    shortTitle: "Developer Tools",
    icon: "devtools",
    description: "Software that makes building software faster, calmer and more reliable.",
    status: "In research",
  },
  {
    id: "education",
    title: "Education Technology",
    shortTitle: "Education",
    icon: "education",
    description: "Learning platforms and tools for students and the institutions that teach them.",
    status: "Coming",
  },
  {
    id: "enterprise",
    title: "Institutional & Enterprise Platforms",
    shortTitle: "Enterprise",
    icon: "enterprise",
    description: "ERP, workflow and data systems for colleges and organisations that have outgrown spreadsheets.",
    status: "Coming",
  },
];

export type DomainId = (typeof domains)[number]["id"];

export const domainById = (id: string) => domains.find((d) => d.id === id);
