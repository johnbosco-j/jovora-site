import { LINKS } from "./site";

export type ProductStatus = "Live" | "Beta" | "In development";

export type Product = {
  slug: string;
  name: string;
  status: ProductStatus;
  /** Where it runs, shown next to the status chip. */
  platforms: string;
  /** Domain ids from content/domains.ts */
  domains: string[];
  domainLabel: string;
  tagline: string;
  description: string;
  features: string[];
  stats?: { value: string; label: string; accent?: boolean }[];
  statsSource?: string;
  /** Product link (external or a redirecting short link). Undefined → CTA shows "coming soon". */
  href?: string;
  /** Address shown in the card's browser frame. */
  displayUrl?: string;
  cta: string;
  /** Optional real screenshot in /public. Without it a coded dashboard mock renders. */
  screenshot?: { src: string; width: number; height: number; alt: string };
  disclaimer?: string;
  featured?: boolean;
};

// Newest first. The first product with `featured: true` gets the large card.
export const products: Product[] = [
  {
    slug: "clareo",
    name: "Clareo",
    status: "Live",
    platforms: "Web + Desktop",
    domains: ["health", "ai-perception"],
    domainLabel: "Health & Wellbeing · AI",
    tagline: "Screen all day. Keep your eyes.",
    description:
      "Clareo watches for drowsiness, eye strain and bad posture through your webcam — privately, on your own device — and nudges you to blink, rest and take breaks at the right moment.",
    features: [
      "On-device detection: video never leaves your computer.",
      "Calibrates to your own eyes in 20 seconds and learns from your 👍 / 👎 on alerts.",
      "Works in dim rooms and on basic webcams with automatic low-light enhancement.",
      "Weekly analytics, trends and an AI coach that turns your numbers into habits.",
      "Break, 20-20-20 and posture reminders — as a web app and a desktop app.",
    ],
    // Update from Clareo's docs/DETECTION_ENGINE.md when new benchmarks land.
    stats: [
      { value: "97%+", label: "open/closed eye accuracy on labelled real-world photos", accent: true },
      { value: "1.2 s", label: "of closed eyes before the wake-up alarm sounds" },
      { value: "0 frames", label: "of video uploaded, ever" },
    ],
    statsSource: "Accuracy: leave-one-out test on labelled real-world photos. Source: Clareo detection-engine benchmarks.",
    href: LINKS.clareo,
    displayUrl: LINKS.clareoDisplay,
    cta: "Visit Clareo",
    // screenshot: { src: "/products/clareo/dashboard.png", width: 1600, height: 1000, alt: "Clareo dashboard showing blink rate, fatigue score and weekly trends" },
    disclaimer: "Clareo is a wellness tool, not a medical device.",
    featured: true,
  },
];
