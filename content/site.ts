// Site-wide copy, links and settings. Change URLs here or via env vars — never in components.

const env = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : undefined);

export const SITE_URL = env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://rivendevs.in";
const SITE_HOST = new URL(SITE_URL).host.replace(/^www\./, "");

/**
 * Where Clareo actually lives. Default: a subdomain of the Riven domain
 * (clareo.rivendevs.in), so only one domain needs buying. Override with NEXT_PUBLIC_CLAREO_URL.
 */
export const CLAREO_URL = env(process.env.NEXT_PUBLIC_CLAREO_URL) ?? `https://clareo.${SITE_HOST}`;

export const LINKS = {
  /** Short link on the Riven site; next.config.ts redirects /clareo → CLAREO_URL. */
  clareo: "/clareo",
  /** Shown in the product card's browser bar. */
  clareoDisplay: CLAREO_URL.replace(/^https?:\/\//, ""),
  /** Founder portfolio. Undefined until NEXT_PUBLIC_PORTFOLIO_URL is set. */
  portfolio: env(process.env.NEXT_PUBLIC_PORTFOLIO_URL),
  github: "https://github.com/johnbosco-j",
  contactEmail: `hello@${SITE_HOST}`, // create this inbox once the domain is bought
} as const;

export type NavItem = { label: string; href: `#${string}` };

export const site = {
  name: "Riven",
  city: "Chennai, India",
  founded: 2026,
  title: "Riven — Clear technology for the real world",
  description:
    "Riven is a Chennai-based technology company building across AI, robotics, health, developer tools and education. Makers of Clareo. We also build full-stack websites and AI solutions for clients at a minimal, optimal cost.",
  mission: "Clear technology for the real world.",

  nav: [
    { label: "Domains", href: "#domains" },
    { label: "Products", href: "#products" },
    { label: "Services", href: "#services" },
    { label: "Founder", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavItem[],
  navCta: { label: "Get in touch", href: "#contact" },

  hero: {
    // Headline is split so exactly one word gets the serif-italic accent.
    headline: { before: "We build", accent: "clear", after: "technology for the real world." },
    motionPrompt: "Tap · move it with your phone",
    sub: "Riven is a technology company working across AI, robotics, health, developer tools and education. We take one hard problem at a time and ship it properly.",
  },

  domainsSection: {
    label: "Domains",
    heading: { before: "Where we", accent: "work", after: "." },
    intro: "Six frontiers, one standard. We say plainly what is shipping, what is in research and what is still ahead.",
  },

  productsSection: {
    label: "Products",
    heading: { before: "What we’ve", accent: "built", after: "." },
    intro: "Each product lives on its own domain. This is where they start.",
    ghostLabel: "Next from Riven",
    ghostStatus: "In research",
  },

  process: {
    label: "How we work",
    heading: { before: "Research. Benchmark.", accent: "Ship", after: "." },
    steps: [
      { title: "Research", body: "We start from a real problem people have, not a technology looking for one." },
      { title: "Benchmark", body: "We test on real data before we promise anything — and we write down how." },
      { title: "Ship", body: "We release when it works on ordinary hardware, for ordinary days." },
    ],
  },

  founderSection: {
    label: "Founder",
    heading: { before: "Who’s", accent: "behind", after: " it." },
  },

  contact: {
    label: "Contact",
    heading: { before: "Let’s build something", accent: "clear", after: "." },
    intro: "A project you need built, a partnership, hiring, or feedback on Clareo — tell us and we’ll reply.",
    topics: ["Project enquiry", "Partnership", "Hiring", "Product feedback", "Press", "Other"],
    success: "Thanks — your message is in. We’ll get back to you soon.",
    emailLabel: "Or write to",
  },

  footer: {
    columns: [
      {
        title: "Company",
        links: [
          { label: "About", href: "#about" },
          { label: "Domains", href: "#domains" },
          { label: "Services", href: "#services" },
          { label: "Founder", href: "#founder" },
        ],
      },
      { title: "Products", links: [{ label: "Clareo", href: "clareo" }] },
      {
        title: "Connect",
        links: [
          { label: "GitHub", href: "github" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
    legalLeft: "© 2026 Riven · Chennai, India",
    /** Engineering studio credit shown beside the copyright line. */
    legalRight: "Built by RivenDevs",
  },
} as const;

export type Heading = { before: string; accent: string; after: string };
