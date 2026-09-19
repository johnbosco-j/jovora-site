import type { NextConfig } from "next";
import { CLAREO_URL } from "./content/site";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // jovora.ai/clareo → Clareo (subdomain by default). One link to share, one place to change.
  async redirects() {
    return [{ source: "/clareo", destination: CLAREO_URL, permanent: false }];
  },
};

export default nextConfig;
