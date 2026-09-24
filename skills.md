---
name: rivendevs-site
description: Build and maintain rivendevs — the Riven company website (parallax, black/gray/orange). Use when creating the site, adding a product or domain, editing founder details, or changing the site's design, content or deployment.
---

# Riven site — build & maintenance skill

Read `design.md` (visual system) and `prompt.md` (full brief) before changing anything. This file is the working rulebook: stack, structure, conventions and the checklist every change must pass.

## Who and what

- **Riven** is a multi-domain technology company founded and owned by **Johnbosco J Elanjikal** (Chennai, India), a **current third-year B.E. CSE student at LICET — not a graduate**. Never describe him as a graduate or alumnus; update the year in `content/founder.ts` each academic year. It builds products across AI & machine perception, robotics & embedded systems, health & human wellbeing, developer tools, education and institutional platforms.
- **Clareo** is Riven's first product: private, on-device eye-fatigue, eye-strain and posture monitoring for people who work at screens all day.
- The site's job: explain what Riven is, show its products (each links out to its own domain), show the founder, and collect contact requests. It is not a product app.

## Stack (keep it)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, static export where possible | Matches the founder's stack; great SEO; deploys to Vercel |
| Styling | **Tailwind CSS** with the tokens from `design.md` mapped in `tailwind.config.ts` (`bg`, `surface`, `ink`, `muted`, `orange`, …) | One source of truth for colour and spacing |
| Motion | CSS scroll-driven animations first; **Framer Motion** (`useScroll`, `useTransform`) as fallback | Smooth, declarative, respects reduced motion |
| Smooth scroll | Optional **Lenis**, disabled when `prefers-reduced-motion` | Never hijack keyboard scrolling |
| Fonts | `next/font/google`: Instrument Sans, Instrument Serif, DM Mono | Self-hosted, no layout shift |
| Icons | lucide-react | 1.5px stroke line icons |
| Forms | Server action or route handler → email provider (Resend) with honeypot + rate limit | No third-party form widgets |
| Hosting | Vercel | Preview deployments per PR |

Do not add a CMS, UI kit (MUI/Chakra) or jQuery. 3D: the hero orbit is CSS 3D; three.js is allowed **only** for Riv (the About-section mascot) and must stay lazy-loaded (`lib/robot/scene.ts`, dynamic import on approach) so it never enters the initial bundle.

## Project structure

```
rivendevs-site/
  app/
    layout.tsx            fonts, metadata, <SkipLink/>, grain overlay
    page.tsx              composes sections in order
    products/[slug]/page.tsx   optional detail pages (Clareo first)
    api/contact/route.ts  contact form handler
  components/
    nav/NavCapsule.tsx
    parallax/ParallaxLayer.tsx   (speed prop, reduced-motion aware)
    sections/Hero.tsx  Domains.tsx  Products.tsx  Founder.tsx  Principles.tsx  Contact.tsx  Footer.tsx
    ui/Button.tsx  Chip.tsx  Stat.tsx  ProductCard.tsx  DomainTile.tsx  FounderCard.tsx
  content/
    site.ts        links, contact email, social
    domains.ts     domain tiles
    products.ts    product cards (Clareo first)
    founder.ts     founder details
  public/          logo, monogram, og image, product screenshots
  design.md  skills.md  prompt.md
```

## Content lives in data files, never in components

All copy and links go in `content/*.ts` with types, so adding a product or changing a URL never touches layout code.

```ts
// content/site.ts
export const LINKS = {
  clareo: "/clareo",                         // next.config.ts redirects to CLAREO_URL (default https://clareo.<site domain>)
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "#founder",     // founder portfolio, coming later
  github: "https://github.com/johnbosco-j",
  contactEmail: `hello@${SITE_HOST}`,         // create this inbox once the domain is bought
};

// content/products.ts
export type Product = {
  slug: string; name: string; tagline: string; domain: DomainId;
  status: "Live" | "Beta" | "In development";
  description: string; features: string[];
  stats?: { value: string; label: string; source?: string }[];
  href: string;               // external product domain
  screenshot?: string;
};
```

Every external link: `target="_blank" rel="noopener noreferrer"` and a visible ↗.
If a URL is still a placeholder (`#…` or the default), the button shows "Coming soon" and is not clickable.

## How to add things

- **New product:** add an entry to `content/products.ts` (+ screenshot in `public/products/<slug>/`). The Products section renders the newest first; the first product with `featured: true` gets the large card.
- **New domain:** add to `content/domains.ts` with `status` (`Shipping`, `In research`, `Coming`). Keep descriptions to one sentence.
- **Founder portfolio live:** set `NEXT_PUBLIC_PORTFOLIO_URL` in Vercel; no code change.
- **Clareo address:** lives at `clareo.<site domain>` by default (one domain for everything); set `NEXT_PUBLIC_CLAREO_URL` only if it moves.

## Conventions

- TypeScript strict; no `any`. Components are server components unless they need scroll/pointer state.
- Parallax only through `<ParallaxLayer speed={…}>`; never hand-roll scroll listeners in sections.
- Animate only `transform`/`opacity`. Every animated component checks `useReducedMotion()`.
- Colours only via tokens; no raw hex in components. Orange appears at most once per viewport as a fill.
- Headings: one `<h1>` (hero). Section headings `<h2>` with one serif-italic accent word.
- Images: `next/image`, explicit width/height, AVIF/WebP, meaningful `alt` (or `alt=""` if decorative).
- Copy is honest: numbers carry a source; no invented customers, partners, funding or awards.
- Personal data: show the founder's name, role, college, GitHub and portfolio link. **Do not publish the phone number or personal email**; the site uses the company inbox.

## Quality checklist (run before every merge)

1. `npm run lint && npm run typecheck && npm run build` — all clean.
2. Keyboard pass: Tab through nav, CTAs, product link, founder link, form; visible focus everywhere.
3. `prefers-reduced-motion` on (macOS: Accessibility → Display → Reduce motion): no parallax, no rotation, content fully readable.
4. Mobile 375px and tablet 768px: no horizontal scroll, pinned sections un-pinned, tap targets ≥ 44px.
5. Lighthouse (mobile): Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
6. Contrast of text over every parallax background ≥ 4.5:1 at the top, middle and end of each section.
7. External links open in a new tab and point at the configured URLs; placeholders render "Coming soon".
8. Metadata: title, description, Open Graph image (1200×630, black with orange orbit), favicon from the monogram, `robots.txt`, `sitemap.xml`.

## Commands

```
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint
npm run typecheck
```

## Don'ts

- Don't autoplay audio or video with sound, show cookie banners for non-essential tracking, or add chat widgets.
- Don't use the Clareo lime colour on Riven pages; Clareo keeps its own identity on its own domain.
- Don't let marketing copy claim medical accuracy for Clareo. It is a wellness tool, not a medical device.
