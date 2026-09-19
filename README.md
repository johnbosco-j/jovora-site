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
| `NEXT_PUBLIC_CLAREO_URL` | `https://clareo.<site domain>` | Where Clareo lives. "Visit Clareo" and the footer link go to `/clareo` on the Jovora site, which redirects here. |
| `NEXT_PUBLIC_PORTFOLIO_URL` | unset | Founder portfolio. While unset, the button reads "Portfolio — coming soon" and can't be clicked. |
| `NEXT_PUBLIC_SITE_URL` | `https://jovora.ai` | Canonical URL for metadata, sitemap and JSON-LD. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | unset | When both are set, contact messages are emailed through Resend. Otherwise they are only logged on the server. |
| `CONTACT_FROM_EMAIL` | `Jovora <noreply@jovora.ai>` | Sender address. Its domain must be verified in Resend. |

`NEXT_PUBLIC_*` values are read at build time, so redeploy after changing them.

## Domains: one domain for Jovora and Clareo

Buy one domain (for example `jovora.ai`). Then:

1. **Jovora site:** in the Vercel project for this repo, add `jovora.ai` and `www.jovora.ai`, and set `NEXT_PUBLIC_SITE_URL=https://jovora.ai`.
2. **Clareo:** in Clareo's own Vercel project (or wherever the Clareo app is hosted), add `clareo.jovora.ai`. At your registrar, point `clareo` to it with a CNAME record, following the value Vercel shows.
3. The "Visit Clareo" button goes to `jovora.ai/clareo`, which redirects to `https://clareo.jovora.ai`. Nothing else needs changing.

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
  parallax/     ParallaxLayer — scroll-linked layers (speed prop)
                AmbientBackground — site-wide drifting star field + glow orbs (canvas)
  about/        RobotStage — Jovo, the interactive 3D mascot console (HUD, speech bubble; lazy-loads three.js + model)
  sections/     Hero (+ Orbit), About (who we are / why we're different, synced with Jovo), Domains (pinned horizon), Products,
                Services, Process, Founder, Contact (+ ContactForm), Footer
  ui/           Button, Chip, Stat, DomainTile, ProductCard, ClareoMock, FounderCard, Icon
  brand/        Wordmark (orbiting dot on the second "o"), Monogram
content/        site.ts · about.ts · domains.ts · products.ts · services.ts · founder.ts   ← all copy and links
```

## Editing content

- **New product:** add an entry to `content/products.ts`. Optionally add a screenshot in `public/products/<slug>/` and set `screenshot`. The first product with `featured: true` gets the large card, and the others render below it.
- **New domain:** add an entry to `content/domains.ts` with `status` set to `Shipping`, `In research` or `Coming`. Domains marked "In research" also appear as ghost "Next from Jovora" cards under Products.
- **Who we are / why we're different:** edit `content/about.ts`. Each "why" point has an `emote` (Wave, ThumbsUp, Yes, Jump, Dance, No, Punch) and a `says` line. When the point is hovered, focused, or scrolled to on mobile, Jovo plays the gesture and shows the line in its speech bubble. The mascot's name, greeting, click reactions and status labels are under `mascot`.
- **Services / client work:** edit `content/services.ts` — offerings, their tags and the three "how we keep cost minimal" commitments.
- **Clareo or portfolio URL ready:** set the env var and redeploy. No code changes needed.

## Motion and accessibility

- Ambient background: one `<canvas>` star field in three depth layers that drift slowly, twinkle, link nearby stars with hairlines and shift at 0.06/0.15/0.3× scroll speed. It pauses in hidden tabs and draws a still frame under reduced motion. The domains section adds a perspective grid floor gliding toward the viewer.
- Depth on every device: `lib/tilt.ts` provides one shared "gaze" input. On a laptop it follows the mouse. On a phone it uses the gyroscope and falls back to touch; iOS asks for motion permission when the robot is first tapped. The star field, hero rings and robot all read from it. Domains pin and scroll sideways on phones too.
- Robot: `lib/robot/scene.ts` loads three.js and `public/models/robot-expressive.glb` only when the About section gets near the viewport. The robot follows the cursor or tilt, looks surprised at fast mouse movement, looks sad when the cursor leaves the window, and plays a gesture on click or tap. Rendering pauses when it is off-screen, and it holds a still pose under reduced motion.
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
| Founder photo (optional; the "JE" monogram shows until then) | `public/founder.jpg` + `photo` in `content/founder.ts` |
| Clareo address (only if not `clareo.<site domain>`) | `NEXT_PUBLIC_CLAREO_URL` |
| Founder portfolio URL | `NEXT_PUBLIC_PORTFOLIO_URL` |
| Company email (defaults to `hello@<site domain>`) | `LINKS.contactEmail` in `content/site.ts` |
| Site domain | `NEXT_PUBLIC_SITE_URL` |
| Clareo benchmark numbers | `content/products.ts` → `stats`. Update from Clareo's `docs/DETECTION_ENGINE.md`. |

## Credits

- Robot model: **RobotExpressive** by [Tomás Laulhé (Quaternius)](https://www.patreon.com/quaternius), with facial expressions added by [Don McCurdy](https://donmccurdy.com/), from the three.js examples. Licensed **CC0 1.0**. Jovora's version is recoloured at runtime.
