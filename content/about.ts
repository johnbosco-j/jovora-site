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
    "Founded in 2026 by Johnbosco J Elanjikal, Jovora works across AI, robotics, health, developer tools and education — one hard problem at a time. Our first product, Clareo, protects the eyes and posture of people who work at screens all day.",
    "Alongside our own products we design and build websites, web apps and AI systems for clients, at a minimal, honest cost.",
  ],

  whyLabel: "Why we’re different",
  whyHeading: { before: "Different by", accent: "design", after: "." },
  why: [
    {
      emote: "Wave",
      says: "Say hi to the people who’ll actually build it.",
      title: "You talk to the builders.",
      body: "No sales layers or hand-offs. The people who scope your idea are the people who write the code.",
    },
    {
      emote: "ThumbsUp",
      says: "Your data stays with you. Always a thumbs-up.",
      title: "Private by default.",
      body: "AI runs on your device or your own servers wherever it can — not quietly on someone else’s cloud.",
    },
    {
      emote: "Yes",
      says: "We measure first. Then we talk.",
      title: "Proof before promises.",
      body: "We benchmark before we claim anything, and we show you exactly how we tested.",
    },
    {
      emote: "Jump",
      says: "Great work doesn’t need a giant budget.",
      title: "Big-company craft, small-team cost.",
      body: "Lean stacks and clear scopes keep budgets minimal without cutting corners on quality.",
    },
    {
      emote: "Dance",
      says: "Clareo is live — worth a little dance.",
      title: "We ship our own products.",
      body: "Clareo is live. Every client project gets the same standard we hold ourselves to.",
    },
  ] satisfies { emote: Emote; says: string; title: string; body: string }[],

  // The robot mascot. Rename freely.
  mascot: {
    name: "Jovo",
    role: "Jovora’s assistant",
    greeting: "Hi, I’m Jovo. Hover over any reason and I’ll explain it.",
    touchGreeting: "Hi, I’m Jovo. Keep scrolling — I’ll react to each point.",
    clicks: [
      { emote: "Wave", says: "Hello again!" },
      { emote: "ThumbsUp", says: "Clear tech gets a thumbs-up." },
      { emote: "Yes", says: "Yes — we build it properly." },
      { emote: "Jump", says: "Whoa, that tickles!" },
      { emote: "Dance", says: "Okay, one little dance." },
    ] satisfies { emote: Emote; says: string }[],
    states: {
      idle: "Standing by",
      looking: "Watching you",
      Wave: "Waving",
      ThumbsUp: "Approving",
      Yes: "Nodding",
      No: "Disagreeing",
      Jump: "Jumping",
      Dance: "Dancing",
      Punch: "Punching the air",
    } as Record<string, string>,
    hint: "Move your cursor · click Jovo",
    touchHint: "Tilt your phone · tap Jovo",
  },

  primary: { label: "Explore our products", href: "#products" },
  secondary: { label: "Meet the founder", href: "#founder" },
};
