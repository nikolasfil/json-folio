import type { NextConfig } from "next";

// GitHub Pages project site lives at /<repo>, user site at /
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Required for GitHub Pages (static hosting)
  output: "export",
  trailingSlash: true,
  // Make assets resolve correctly under /<repo>
  basePath,
  assetPrefix: basePath,
  images: {
    // Static export cannot use the built-in image optimization API.
    unoptimized: true,
    // Allow images from any external URL (both http and https)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
