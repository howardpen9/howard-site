import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Per-post raw Markdown: /2026/my-post.md -> handled by /raw/2026/my-post
      { source: "/:year(\\d{4})/:slug.md", destination: "/raw/:year/:slug" },
    ];
  },
  async redirects() {
    return [
      // Projects now live on /about; keep old links alive.
      { source: "/projects", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
