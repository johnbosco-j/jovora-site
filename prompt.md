# Prompt — Build the Riven website

> Paste everything below the line into your AI builder (Claude Code, Cursor, v0, Lovable, Bolt). Keep `design.md` and `skills.md` in the project root so the builder can read them; the key values are repeated here so this prompt also works on its own.

---

## Role

You are a senior product designer and front-end engineer. Build the marketing website for **Riven**, a new multi-domain technology company. Deliver production-quality code, not a mock-up: responsive, accessible, fast, and easy to extend with future products and domains.

## About Riven

- **Riven** is a technology company founded and owned by **John Bosco J**, based in **Chennai, India**.
- Riven will work across many domains over time. Current and planned focus areas:
  1. **AI & Machine Perception** — models that see, hear and understand context, running on-device where possible.
  2. **Robotics & Embedded Systems** — perception and control for machines in the physical world; edge devices.
  3. **Health & Human Wellbeing** — tools that protect people's attention, eyes, posture and rest.
  4. **Developer Tools** — software that makes building software faster and more reliable.
  5. **Education Technology** — learning platforms and tools for students and institutions.
  6. **Institutional & Enterprise Platforms** — ERP, workflow and data systems for colleges and organisations.
- Personality: ambitious but grounded; engineering-led; privacy-first; honest about what's shipped vs in research.
- The site must make Riven feel like a serious, long-term company in the league of Anthropic, OpenAI or Apple — through restraint, depth and craft, not hype.

## Audience

Early users, prospective collaborators and hires, college and industry partners, and investors who want to understand what Riven is and who is behind it in under a minute.

## Tech requirements

- **Next.js (App Router) + TypeScript + Tailwind CSS**; Framer Motion for scroll animation fallbacks; `next/font` for fonts; lucide-react icons. Deployable to Vercel with static generation.
- All copy and links in typed data files (`content/site.ts`, `domains.ts`, `products.ts`, `founder.ts`) — no hard-coded copy inside layout components.
- Configurable links via env vars with safe defaults:
  - `NEXT_PUBLIC_CLAREO_URL` — Clareo's own domain (to be purchased). Default placeholder `https://clareo.app`.
  - `NEXT_PUBLIC_PORTFOLIO_URL` — the founder's portfolio (to be built later). While unset, the founder button reads "Portfolio — coming soon" and is not clickable.
- External links open in a new tab (`rel="noopener noreferrer"`) and show a ↗.

## Visual design (summary of design.md)

- **Theme: black, gray, orange.** Background `#070707`, alternate `#0E0E0F`, surfaces `#141415` / `#1C1C1E`, hairlines `#26262A`, text `#F4F2EE`, muted `#A3A1A0`, faint `#6E6C6B`, **accent orange `#FF6A1A`** (hover `#FF8A3D`, pressed `#C2410C`, glow `rgb(255 106 26 / .18)`). Buttons: **black text on orange**.
- Orange is rare: one accent fill per viewport. Depth comes from parallax layers, soft radial orange glows and a 3% film-grain overlay.
- **Type:** Instrument Sans (headings 600, tight tracking), Instrument Serif *italic* for one accent word per heading, DM Mono for numbers and micro-labels. Hero size `clamp(56px, 9vw, 132px)`.
- **Layout:** 12-column grid, max width 1240px, generous section padding (128–176px desktop). Radius 20px cards, 999px pills. Floating glass **nav capsule**.
- Visual DNA shared with the Clareo product site: floating capsule nav, serif-italic accent words, mono numerals — but Riven uses orange instead of Clareo's lime.

## Parallax UX (the signature)

Use four layers: **L0 horizon (0.15× scroll), L1 atmosphere (0.35×), L2 content (1×), L3 foreground (1.2–1.4×)**. Animate only `transform` and `opacity`. Prefer CSS scroll-driven animations with a Framer Motion fallback.

Signature moments:
1. **Hero "Orbit":** the Riven wordmark centred inside three concentric thin orange rings rotating at different slow speeds, with a small orange sphere travelling one ring. On scroll the ring plane tilts from face-on to ~65° and the glow fades, so the visitor "flies through" the rings into the site.
2. **Domains horizon:** a pinned section (~200vh desktop) where six domain tiles slide horizontally; the background glow drifts from orange to amber; the centred tile lifts and brightens.
3. **Product reveal:** the Clareo card rises from the foreground layer (scale 0.92 → 1) while its screenshot parallaxes inside the card frame.
4. **Founder:** the orbit ring motif returns faintly behind the founder card, closing the loop from the hero.

Rules: `prefers-reduced-motion` disables all parallax, pinning and rotation (content stays fully visible); on screens < 768px halve the parallax distances and stack the domains vertically instead of pinning; never hijack scroll direction or keyboard scrolling.

## Page structure and copy

Write polished final copy; the drafts below set the tone and facts. Keep sentences short.

### 1. Nav capsule
Riven mark + wordmark · links: **Domains · Products · Founder · Contact** · orange button **Get in touch**. Collapses to a menu button under 820px.

### 2. Hero
- Micro-label (mono): `RIVENDEVS · CHENNAI · EST. 2026`
- Headline: **We build *clear* technology for the real world.**
  (Alternatives to test: "Intelligent systems, *honestly* built." / "One company. *Many* frontiers.")
- Sub-copy: "Riven is a technology company working across AI, robotics, health, developer tools and education. We take one hard problem at a time and ship it properly."
- Buttons: **Explore our products** (scrolls to Products) · **Meet the founder** (secondary, scrolls to Founder).
- Scroll cue: a thin orange line that grows as you begin to scroll.

### 3. Principles (three columns, fade in with stagger)
1. **Private by design** — "If it can run on your device, it does. Your data stays yours."
2. **Measured, not promised** — "Every claim we make has a benchmark behind it, and we publish how we tested."
3. **Built for people** — "Technology should protect attention, health and time — not harvest them."

### 4. Domains (pinned horizontal parallax)
Heading: "Where we *work*." Six tiles with mono index, line icon, one-sentence description and a status chip:
- 01 AI & Machine Perception — `Shipping`
- 02 Health & Human Wellbeing — `Shipping`
- 03 Robotics & Embedded Systems — `In research`
- 04 Developer Tools — `In research`
- 05 Education Technology — `Coming`
- 06 Institutional & Enterprise Platforms — `Coming`

### 5. Products
Heading: "What we've *built*." Featured product card for **Clareo**, then a row of ghost cards reading "Next from Riven — in research" so the section scales as products are added.

**Clareo card content:**
- Name: **Clareo** · chip `Live · Web + Desktop` · domain chip `Health & Wellbeing · AI`
- Tagline: "Screen all day. Keep your eyes."
- Description: "Clareo watches for drowsiness, eye strain and bad posture through your webcam — privately, on your own device — and nudges you to blink, rest and take breaks at the right moment."
- Features:
  - On-device detection: video never leaves your computer.
  - Calibrates to your own eyes in 20 seconds; learns from your 👍/👎 on alerts.
  - Works in dim rooms and on basic webcams with automatic low-light enhancement.
  - Weekly analytics, trends and an AI coach that turns your numbers into habits.
  - Break, 20-20-20 and posture reminders; web app and desktop app.
- Stats (DM Mono; include the source line in small text):
  - `97.9%` — "single-frame open/closed eye accuracy on 384 real, hand-labelled faces (cross-validated); live use adds per-person calibration"
  - `1.2 s` — "of closed eyes before the wake-up alarm sounds"
  - `0 frames` — "of video uploaded, ever"
  (Update these from Clareo's `docs/DETECTION_ENGINE.md` when new benchmarks land.)
- CTA: **Visit Clareo ↗** → `NEXT_PUBLIC_CLAREO_URL` (new tab).
- Visual: dark browser-frame mock of the Clareo dashboard (placeholder image at `public/products/clareo/dashboard.png`), with inner parallax.
- Small print: "Clareo is a wellness tool, not a medical device."

### 6. How we work (optional, short)
Three steps on a thin orange line: **Research → Benchmark → Ship.** One sentence each, e.g. "We test on real data before we promise anything."

### 7. Founder
Heading: "Who's *behind* it."
Founder card (monogram "JB" inside an orange orbit ring — or a photo if provided):
- **John Bosco J** — *Founder & Organisation Owner*
- Computer Science & Engineering at **Loyola-ICAM College of Engineering and Technology**, Chennai.
- Full-stack developer working across web platforms, real-time APIs, computer vision and systems programming.
- Highlights (small chips or a compact list):
  - Clareo began as **EyeGuard**, a real-time fatigue-detection API that placed **7th at Ctrl Alt Hack 2.0**.
  - **5th place, Buildathon 3.0**.
  - Built **Excelsior ERP** (institutional platform, role-based access) and led **oLearn** (e-learning platform, 4-member team).
- Interests line: "Developer tools, hackathons, chess and systems programming."
- Buttons: **View portfolio ↗** → `NEXT_PUBLIC_PORTFOLIO_URL` (shows "Portfolio — coming soon" until set) · **GitHub ↗** → `https://github.com/johnbosco-j`.
- Do **not** show the founder's phone number or personal email anywhere on the site.

### 8. Contact
Heading: "Let's build something *clear*." Short form: name, email, what it's about (select: Partnership · Hiring · Product feedback · Press · Other), message. Honeypot field + server-side rate limit. On success show an inline confirmation (no page reload). Also show the company email as text (placeholder `hello@rivendevs.in`, from `content/site.ts`).

### 9. Footer
Riven wordmark, one-line mission, columns: Company (About, Domains, Founder), Products (Clareo ↗), Connect (GitHub ↗, Contact). Bottom row: "© 2026 Riven · Chennai, India" and "Clareo is a product of Riven."

## SEO & metadata
- Title: "Riven — Clear technology for the real world"
- Description: "Riven is a Chennai-based technology company building across AI, robotics, health, developer tools and education. Makers of Clareo."
- Open Graph image 1200×630: black background, orange orbit rings, Riven wordmark.
- Organization JSON-LD (name, url, founder: John Bosco J, sameAs: GitHub); `robots.txt`, `sitemap.xml`, favicon from the "J in orbit" monogram.

## Acceptance criteria
1. Looks and feels like design.md: black/gray/orange, parallax layers, orbit hero, serif-italic accent words, mono numbers.
2. Smooth at 60fps on a mid-range laptop; no layout shift while fonts load.
3. With reduced motion on, nothing moves and nothing is hidden.
4. Works at 375px, 768px, 1280px and 1920px with no horizontal scrolling.
5. Keyboard and screen-reader friendly: skip link, landmarks, focus rings, alt text.
6. Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
7. Adding a new product or domain needs only a new entry in `content/`.
8. The Clareo button and the portfolio button use the env-var URLs and behave correctly while those are still placeholders.
9. No invented facts: no fake customers, partners, investors or awards beyond those listed above.

Deliver the complete project, a short README with setup and deploy steps, and a list of assets the founder should replace (logo files, product screenshots, founder photo, final domain URLs, company email).
