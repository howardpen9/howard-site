import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostMeta = {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  year: string;
  slug: string;
  tags?: string[];
  // Agent/GEO-friendly provenance fields.
  source_url?: string;
  captured_at?: string;
};

export type Post = PostMeta & { content: string };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

export function getAllPosts(): Post[] {
  return walk(POSTS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const slug = path.basename(file, ".mdx");
      const year = path.basename(path.dirname(file));
      return {
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? `${year}-01-01`),
        year,
        slug,
        tags: data.tags as string[] | undefined,
        source_url: data.source_url as string | undefined,
        captured_at: data.captured_at as string | undefined,
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(year: string, slug: string): Post | undefined {
  return getAllPosts().find((p) => p.year === year && p.slug === slug);
}

export function getAllPostParams() {
  return getAllPosts().map((p) => ({ year: p.year, slug: p.slug }));
}
