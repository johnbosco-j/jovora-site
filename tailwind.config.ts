import type { Config } from "tailwindcss";

// Tokens mirror design.md §2–6. Components use these names only — never raw hex.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#070707", 2: "#0E0E0F" },
        surface: { DEFAULT: "#141415", 2: "#1C1C1E" },
        line: { DEFAULT: "#26262A", strong: "#3A3A40" },
        ink: "#F4F2EE",
        muted: "#A3A1A0",
        faint: "#6E6C6B",
        orange: {
          DEFAULT: "#FF6A1A",
          hot: "#FF8A3D",
          deep: "#C2410C",
          glow: "rgb(255 106 26 / 0.18)",
          tint: "rgb(255 106 26 / 0.08)",
        },
        amber: "#FFB02E",
        success: "#3DDC97",
        danger: "#FF4D4D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(56px, 9vw, 132px)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        h2: ["clamp(36px, 5vw, 64px)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        micro: ["12px", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      maxWidth: { content: "1240px" },
      borderRadius: { input: "12px", card: "20px", panel: "28px" },
      spacing: { 22: "88px", 32: "128px", 44: "176px" },
      transitionTimingFunction: {
        out: "cubic-bezier(.16, 1, .3, 1)",
        "in-out": "cubic-bezier(.65, 0, .35, 1)",
      },
      transitionDuration: { 1: "150ms", 2: "350ms", 3: "700ms" },
      boxShadow: {
        hairline: "inset 0 1px 0 rgb(255 255 255 / 0.04)",
        "orange-edge": "inset 0 1px 0 rgb(255 255 255 / 0.04), 0 0 0 1px rgb(255 106 26 / 0.10), 0 12px 40px -16px rgb(255 106 26 / 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
