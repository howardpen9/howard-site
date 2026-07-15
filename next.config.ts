import type { NextConfig } from "next";

/** Long-lived browser cache for content-addressed static assets under /public. */
const STATIC_ASSET_CACHE = "public, max-age=31536000, immutable";

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
  async headers() {
    return [
      // Post media (figures, banners, promo clips) — filenames change when content changes.
      {
        source: "/posts/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
      {
        source: "/projects/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
      // Root-level static files in /public (avatar, icons, svgs).
      {
        source: "/:file(.*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico|mp4|webm|woff2))",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
    ];
  },
  images: {
    // Blog figures are diagrams/screenshots; quality 80 is a good default.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
