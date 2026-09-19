# Jovora — Design System

The visual language for **jovora** (the company site) and every future Jovora product surface.
Mood: **engineered, calm, deep.** A black studio lit by a single warm orange light.
Product sites (like Clareo) keep their own identity; they inherit Jovora's type and spacing, not its colours.

---

## 1. Principles

1. **Depth over decoration.** Parallax layers, not gradients-on-everything. Every moving layer means something (foreground = what we build, midground = domains, background = the horizon we're heading to).
2. **One light source.** Orange is the only accent and is rare: CTAs, active states, a single glow per section. If two orange things compete on screen, remove one.
3. **Quiet until touched.** Surfaces stay still and dark; motion answers the user's scroll, pointer or focus. Nothing loops forever in the viewport except the hero orbit.
4. **Honest content.** Real product facts, real numbers with their source, no "trusted by Fortune 500" filler.
5. **Built for many domains.** Layout slots, tiles and cards must hold AI, robotics, health, developer tools, education and enterprise products without redesign.

---

## 2. Colour

Dark theme is the default and only theme for the marketing site (a light product page may override).

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#070707` | Page background (near-black, not pure black, to avoid OLED smear) |
| `--bg-2` | `#0E0E0F` | Alternating section background |
| `--surface` | `#141415` | Cards, nav capsule |
| `--surface-2` | `#1C1C1E` | Hovered cards, inputs |
| `--line` | `#26262A` | Hairlines, card borders |
| `--line-strong` | `#3A3A40` | Focused borders, dividers in dense areas |
| `--ink` | `#F4F2EE` | Primary text (warm white) |
| `--muted` | `#A3A1A0` | Secondary text |
| `--faint` | `#6E6C6B` | Captions, meta, disabled |
| `--orange` | `#FF6A1A` | The accent: primary buttons, links on hover, active nav, key numbers |
| `--orange-hot` | `#FF8A3D` | Hover state of orange elements |
| `--orange-deep` | `#C2410C` | Pressed state, borders on orange tints |
| `--orange-glow` | `rgb(255 106 26 / 0.18)` | Radial glows, focus rings (outer) |
| `--orange-tint` | `rgb(255 106 26 / 0.08)` | Tinted chips/badges background |
| `--success` | `#3DDC97` | Only for form success / live status |
| `--danger` | `#FF4D4D` | Only for form errors |

**Contrast (WCAG):** `--ink` on `--bg` 18.6:1 · `--muted` on `--bg` 8.0:1 · `--orange` on `--bg` 6.9:1 (AA for body text) · black text on `--orange` 9.0:1 — **buttons use black text on orange**, never white.

**Gradient rule:** only radial glows of `--orange-glow` fading to transparent, max one per viewport, plus a 2–4% film-grain noise overlay on hero and section breaks.

---

## 3. Typography

| Role | Font | Settings |
|---|---|---|
| Display / headings | **Instrument Sans** (variable, 500–700) | letter-spacing −0.035em at ≥48px, −0.02em below |
| Accent words | **Instrument Serif** *italic* | One or two words per heading, e.g. "We build *clear* things." |
| Body | Instrument Sans 400 | 17px / 1.6 desktop, 16px mobile |
| Numbers, labels, code | **DM Mono** 400/500 | Tabular numbers, uppercase micro-labels with 0.08em tracking |

Load from Google Fonts with `display=swap`; subset Latin.

**Scale (fluid, `clamp`)**
- Hero: `clamp(56px, 9vw, 132px)`, weight 600, line-height 0.95
- H2: `clamp(36px, 5vw, 64px)`, line-height 1.02
- H3: 24–28px
- Body: 16–17px · Small: 14px · Micro label: 12px mono uppercase

---

## 4. Layout & spacing

- 12-column grid, max content width **1240px**, gutters 24px desktop / 16px mobile.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176. Sections breathe: 128–176px vertical padding desktop, 88px mobile.
- Radius: 12 (inputs), 20 (cards), 28 (feature panels), 999 (pills, nav capsule).
- Borders are 1px `--line`; elevation comes from lighter surface + subtle inner highlight `inset 0 1px 0 rgb(255 255 255 / 0.04)`, not heavy drop shadows.

---

## 5. Parallax system

Parallax is the site's signature. It must feel physical and never make anyone sick.

### Layers
| Layer | Speed factor | Content |
|---|---|---|
| L0 — Horizon | 0.15 | Far background: orange sun-glow, star/dot field, large faint "J" monogram |
| L1 — Atmosphere | 0.35 | Orbit rings, grid lines, soft noise |
| L2 — Content | 1.0 | Text, cards, buttons (never parallax-shifted text blocks by more than 24px) |
| L3 — Foreground | 1.2–1.4 | Occasional floating objects (product device frames, robotic arm silhouette, chip outlines) |

Speed factor = how far the layer moves relative to scroll (1.0 = normal).

### Signature moments
1. **Hero "Orbit"** — Jovora wordmark centred; three concentric orange hairline rings rotate slowly (60–120s per turn) at different speeds; a small orange sphere travels one ring. Scrolling tilts the ring plane from face-on to ~65° (perspective) and fades the glow — the viewer "flies through" the rings into the page.
2. **Domains horizon** — sticky section (pinned ~200vh): domain tiles slide horizontally while the L0 horizon glow shifts hue from orange to amber; each tile lifts as it reaches centre.
3. **Product reveal** — the Clareo card rises from L3 with a scale 0.92→1 and the card's own device mock parallaxes inside the card (inner parallax, max 40px).
4. **Founder section** — portrait/monogram on L2, a faint orbit ring on L1 continues the hero motif (the story comes full circle).

### Implementation rules
- Prefer **CSS scroll-driven animations** (`animation-timeline: view()/scroll()`) with a JS fallback (Framer Motion `useScroll` or GSAP ScrollTrigger) only where unsupported.
- Animate **only `transform` and `opacity`**. No animating `top`, `height`, `filter: blur` on large areas, or box-shadow.
- `will-change: transform` only on active parallax layers; remove after.
- **`prefers-reduced-motion: reduce`** → all parallax factors become 0, pinned sections become normal flow, rotation stops; fade-ins shorten to 150ms opacity only.
- Mobile (< 768px): cap parallax at 0.5× the desktop distances and disable pinned horizontal scroll (stack tiles vertically instead).
- Smooth scrolling (e.g. Lenis) is optional; if used, keep native scroll behaviour for keyboard, and never hijack scroll direction.

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Entrances |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Transitions between states |
| `--dur-1` | 150ms | Hover, press |
| `--dur-2` | 350ms | Cards, menus |
| `--dur-3` | 700ms | Section entrances |

Entrances: fade + 16px rise, staggered 60ms per item, triggered once when 20% in view. Hover: cards lift 4px and their border brightens to `--line-strong` with a faint orange edge glow.

---

## 7. Components

**Nav capsule** (shared DNA with Clareo): floating, sticky 16px from top, pill-shaped, `--surface` at 72% opacity with `backdrop-filter: blur(18px) saturate(1.4)`, 1px border. Left: Jovora mark + wordmark. Centre: `Domains · Products · Founder · Contact`. Right: orange "Get in touch" button. Collapses to mark + menu button < 820px.

**Buttons**
- Primary: orange fill, black text, 44px tall, radius 999, hover `--orange-hot`, focus ring 3px `--orange-glow` + 1px `--orange`.
- Secondary: transparent, 1px `--line-strong`, ink text, hover border `--orange`.
- External links show a ↗ arrow and open in a new tab with `rel="noopener"`.

**Domain tile**: 1:1.1 card, mono index number (`01`), icon (1.5px stroke line icon, orange on hover), title, one-sentence description, status chip (`Shipping` / `In research` / `Coming`).

**Product card (feature size)**: full-width panel, left: name + tagline + 3–5 feature bullets + stats row + CTA; right: device mockup (browser frame) with the product UI screenshot, inner parallax.

**Founder card**: monogram or photo in a circle with an orange orbit ring, name, role, 2–3 facts, "View portfolio ↗".

**Stat**: DM Mono number in `--ink` 40–56px, micro-label beneath in `--faint`; one accent number per row may be orange.

**Chips/badges**: mono 12px uppercase, `--orange-tint` background, `--orange` text, radius 999.

---

## 8. Iconography & imagery

- Line icons, 1.5px stroke, rounded caps (Lucide or custom), 20/24px.
- Imagery is abstract and technical: orbit rings, dot fields, wireframe robotics silhouettes, chip traces, eye/lens geometry for Clareo. No stock photos of handshakes or people pointing at screens.
- Product screenshots are real, framed in a dark browser/laptop mock with a 1px border.
- Film grain overlay (SVG turbulence at 3% opacity) to keep large black areas from looking flat.

---

## 9. Brand marks

- **Jovora wordmark**: Instrument Serif, regular, tracking −0.02em; the second "o" can hold the orbit dot (a small orange circle offset on its bowl) as the logo's single animated element (slow orbit, 12s).
- **Monogram**: a "J" inside an orange hairline ring on a `--surface` rounded square — used for favicon and app icons.
- Product lockup: "Clareo — by Jovora" in footers and product pages only; product names otherwise stand alone.

---

## 10. Accessibility & performance budget

- Everything reachable by keyboard; visible focus rings; skip-to-content link; semantic landmarks.
- All motion respects `prefers-reduced-motion`; no content hidden behind hover only.
- Text over parallax imagery must keep ≥ 4.5:1 contrast at every scroll position (add a dark scrim if needed).
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- LCP < 2.0s on 4G, CLS < 0.05, total JS < 180KB gzipped for the landing page, images AVIF/WebP with explicit sizes.
