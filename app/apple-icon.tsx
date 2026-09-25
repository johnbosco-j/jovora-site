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
          <path d="M25 19v26M25 19h8.5a6.5 6.5 0 0 1 0 13H25M32.5 32 41 45" fill="none" stroke="#F4F2EE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
