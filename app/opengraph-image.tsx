import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function serif() {
  // Instrument Serif for the wordmark; falls back to the default font if offline at build.
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Instrument+Serif&text=Jovora", {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/533 (KHTML) Safari/533" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype|woff)'\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const font = await serif();
  const rings = [360, 560, 780];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#070707", position: "relative" }}>
        <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: 9999, background: "radial-gradient(circle, rgba(255,106,26,0.2) 0%, rgba(255,106,26,0) 50%)", display: "flex" }} />
        {rings.map((d, i) => (
          <div key={d} style={{ position: "absolute", width: d, height: d, borderRadius: 9999, border: `1.5px solid rgba(255,106,26,${0.7 - i * 0.2})`, display: "flex" }} />
        ))}
        <div style={{ position: "absolute", left: 600 + 280 * Math.cos(-0.6) - 9, top: 315 + 280 * Math.sin(-0.6) - 9, width: 18, height: 18, borderRadius: 9999, background: "#FF6A1A", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 140, color: "#F4F2EE", ...(font ? { fontFamily: "Instrument Serif" } : {}), letterSpacing: -3, lineHeight: 1 }}>Jovora</div>
          <div style={{ marginTop: 24, fontSize: 22, color: "#A3A1A0", letterSpacing: 4, textTransform: "uppercase" }}>Clear technology for the real world</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }] : undefined },
  );
}
