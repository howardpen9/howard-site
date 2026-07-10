import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/ask`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/resume.md`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/llms.txt`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/llms-full.txt`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/feed.xml`, changeFrequency: "weekly", priority: 0.5 },
  ];
  const postRoutes: MetadataRoute.Sitemap = posts.flatMap((p) => [
    {
      url: `${SITE.url}/${p.year}/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    {
      // Agent-readable twin; listed so crawlers discover the Markdown surface.
      url: `${SITE.url}/${p.year}/${p.slug}.md`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ]);
  return [...staticRoutes, ...postRoutes];
}
