import type { Emote } from "@/lib/robot/scene";

// "Who we are" + "Why we're different". Keep claims honest and checkable.

export const about = {
  label: "Who we are",
  // Rendered in Instrument Serif; `accent` words are set in italic orange-free ink.
  statement: [
    { text: "Jovora is a young, engineering-led technology company from Chennai. We build our " },
    { text: "own", accent: true },
    { text: " products — and we build for people who need software done " },
    { text: "properly", accent: true },
    { text: "." },
  ],
  detail: [
    "Founded in 2026 by John Bosco J, Jovora works across AI, robotics, health, developer tools and education — one hard problem at a time. Our first product, Clareo, protects the eyes and posture of people who work at screens all day.",
    "Alongside our own products we design and build websites, web apps and AI systems for clients, at a minimal, honest cost.",
  ],

  whyLabel: "Why we’re different",
  whyHeading: { before: "Different by", accent: "design", after: "." },
  why: [
    {
      emote: "Wave",
      title: "You talk to the builders.",
      body: "No sales layers or hand-offs. The people who scope your idea are the people who write the code.",
    },
    {
      emote: "ThumbsUp",
      title: "Private by default.",
      body: "AI runs on your device or your own servers wherever it can — not quietly on someone else’s cloud.",
    },
    {
      emote: "Yes",
      title: "Proof before promises.",
      body: "We benchmark before we claim anything, and we show you exactly how we tested.",
    },
    {
      emote: "Jump",
      title: "Big-company craft, small-team cost.",
      body: "Lean stacks and clear scopes keep budgets minimal without cutting corners on quality.",
    },
    {
      emote: "Dance",
      title: "We ship our own products.",
      body: "Clareo is live. Every client project gets the same standard we hold ourselves to.",
    },
  ] satisfies { emote: Emote; title: string; body: string }[],

  robotHint: "Move your cursor · click to say hi",
  robotTouchHint: "Tilt your phone · tap to say hi",

  primary: { label: "Explore our products", href: "#products" },
  secondary: { label: "Meet the founder", href: "#founder" },
};
