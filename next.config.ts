import type { NextConfig } from "next";

const backendUrl = process.env.URL_BACKEND ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_URL_BACKEND: backendUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
