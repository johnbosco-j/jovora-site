# Jovora — company website

Marketing site for **Jovora**: black / gray / orange, four-layer parallax, orbit hero.
Built from `prompt.md` (brief), `design.md` (visual system) and `skills.md` (rulebook).

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 3 · Framer Motion · `next/font` · lucide-react.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — every variable has a safe default
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build && npm start` | Production build and serve |
| `npm run lint` | ESLint (Next core-web-vitals + TS) |
| `npm run typecheck` | `tsc --noEmit` |

## Environment variables

| Variable | Default | Effect |
|---|---|---|
| `NEXT_PUBLIC_CLAREO_URL` | unset | Clareo's domain. While unset, the button reads "Visit Clareo — site coming soon" and can't be clicked. |
| `NEXT_PUBLIC_PORTFOLIO_URL` | unset | Founder portfolio. While unset, the button reads "Portfolio — coming soon" and can't be clicked. |
| `NEXT_PUBLIC_SITE_URL` | `https://jovora.com` | Canonical URL for metadata, sitemap and JSON-LD. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | unset | When both are set, contact messages are emailed through Resend. Otherwise they are only logged on the server. |
| `CONTACT_FROM_EMAIL` | `Jovora <noreply@jovora.com>` | Sender address. Its domain must be verified in Resend. |

`NEXT_PUBLIC_*` values are read at build time, so redeploy after changing them.

## Deploy (Vercel)

1. Push the folder to a Git repo and import it in Vercel. The framework preset is detected automatically.
2. Add the environment variables above under Project → Settings → Environment Variables.
3. Deploy. The page, OG image, icons, `robots.txt` and `sitemap.xml` are static. Only `/api/contact` runs on the server.

## Project map

```
app/            layout (fonts, metadata, JSON-LD, skip link, grain), page, api/contact,
                opengraph-image, icon.svg, apple-icon, robots, sitemap
components/
  nav/          NavCapsule — floating glass capsule, menu button under 820px
  parallax/     ParallaxLayer — the only scroll-linked movement (speed prop)
  sections/     Hero (+ Orbit), Principles, Domains (pinned horizon), Products,
                Process, Founder, Contact (+ ContactForm), Footer
  ui/           Button, Chip, Stat, DomainTile, ProductCard, ClareoMock, FounderCard, Icon
  brand/        Wordmark (orbiting dot on the second "o"), Monogram
content/        site.ts · domains.ts · products.ts · founder.ts   ← all copy and links
```

## Editing content

- **New product:** add an entry to `content/products.ts`. Optionally add a screenshot in `public/products/<slug>/` and set `screenshot`. The first product with `featured: true` gets the large card, and the others render below it.
- **New domain:** add an entry to `content/domains.ts` with `status` set to `Shipping`, `In research` or `Coming`. Domains marked "In research" also appear as ghost "Next from Jovora" cards under Products.
- **Clareo or portfolio URL ready:** set the env var and redeploy. No code changes needed.

## Motion and accessibility

- Parallax layers: L0 horizon 0.15× · L1 atmosphere 0.35× · L2 content 1× · L3 foreground 1.2×. Only `transform` and `opacity` are animated.
- Section entrances use **CSS scroll-driven animations** (`animation-timeline: view()`). Browsers without support show the content statically. Parallax and pinning use Framer Motion `useScroll`.
- `prefers-reduced-motion`: parallax, tilt, pinning and ring rotation all stop. The domains section becomes a normal grid, and no content is hidden.
- Under 768px, parallax distances are halved and the domains stack vertically instead of pinning.
- Skip link, landmarks, one `<h1>`, visible orange focus rings, labelled form fields, and "(opens in a new tab)" text for external links.

## Assets for the founder to replace

| Asset | Where |
|---|---|
| Logo / monogram artwork (currently a coded SVG "J in orbit") | `app/icon.svg`, `public/monogram.svg`, `components/brand/Wordmark.tsx` |
| Clareo dashboard screenshot (currently a coded mock) | `public/products/clareo/dashboard.png`, then uncomment `screenshot` in `content/products.ts` |
| Founder photo (optional; the "JB" monogram shows until then) | `public/founder.jpg` + `photo` in `content/founder.ts` |
| Clareo domain | `NEXT_PUBLIC_CLAREO_URL` |
| Founder portfolio URL | `NEXT_PUBLIC_PORTFOLIO_URL` |
| Company email (placeholder `hello@jovora.com`) | `LINKS.contactEmail` in `content/site.ts` |
| Site domain | `NEXT_PUBLIC_SITE_URL` |
| Clareo benchmark numbers | `content/products.ts` → `stats`. Update from Clareo's `docs/DETECTION_ENGINE.md`. |
