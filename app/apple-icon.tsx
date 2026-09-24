import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141415" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="21" fill="none" stroke="#FF6A1A" strokeWidth="1.8" />
          <circle cx="50.2" cy="21.5" r="3.2" fill="#FF6A1A" />
          <text x="32" y="33" textAnchor="middle" dominantBaseline="central" fill="#F4F2EE" fontFamily="Georgia, serif" fontSize="30">
            R
          </text>
        </svg>
      </div>
    ),
    size,
  );
}
