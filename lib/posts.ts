import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { zhPunct } from "./zh-punct";

const POSTS_DIR = path.join(process.cwd(), "posts");

// Drafts (frontmatter `draft: true`) are visible locally but hidden on Vercel,
// so they never reach production (or any deployed URL). `VERCEL` is set in
// every Vercel build/runtime and unset on localhost (dev or `pnpm build`).
const SHOW_DRAFTS = !process.env.VERCEL;

export const DEFAULT_LANG = "en";
export const LANGS = ["zh", "en"] as const;
export type Lang = (typeof LANGS)[number];

export type LangVersion = { title: string; description: string; content: string };

export type PostMeta = {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  year: string;
  slug: string; // base slug, without any language suffix
  tags?: string[];
  draft?: boolean;
  lang?: string;
  source_url?: string;
  captured_at?: string;
  image?: string; // social/OG banner, e.g. /posts/<slug>/banner.png
};

export type Post = PostMeta & {
  content: string; // default-language body (back-compat for raw .md, etc.)
  langs: Partial<Record<Lang, LangVersion>>; // available translations
};

type RawEntry = {
  year: string;
  base: string;
  lang: string;
  draft: boolean;
  data: Record<string, unknown>;
  content: string;
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

// Filename `<slug>.<lang>.mdx` (e.g. foo.en.mdx) is a translation of `<slug>.mdx`.
// A bare `<slug>.mdx` is the default language (zh).
function parseName(fileBase: string, frontmatterLang: unknown): { base: string; lang: string } {
  const parts = fileBase.split(".");
  const maybeLang = parts.length > 1 ? parts[parts.length - 1] : "";
  if ((LANGS as readonly string[]).includes(maybeLang)) {
    return { base: parts.slice(0, -1).join("."), lang: String(frontmatterLang ?? maybeLang) };
  }
  return { base: fileBase, lang: String(frontmatterLang ?? DEFAULT_LANG) };
}

function readRaw(): RawEntry[] {
  return walk(POSTS_DIR).map((file) => {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    const fileBase = path.basename(file, ".mdx");
    const year = path.basename(path.dirname(file));
    const { base, lang } = parseName(fileBase, data.lang);
    return { year, base, lang, draft: data.draft === true, data, content };
  });
}

export function getAllPosts(): Post[] {
  const groups = new Map<string, RawEntry[]>();
  for (const e of readRaw()) {
    const key = `${e.year}/${e.base}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(e);
  }

  const posts: Post[] = [];
  for (const [, entries] of groups) {
    // Meta comes from the default-language file when present, else the first.
    const primary = entries.find((e) => e.lang === DEFAULT_LANG) ?? entries[0];
    const { data, year, base } = primary;

    const langs: Partial<Record<Lang, LangVersion>> = {};
    for (const e of entries) {
      if ((LANGS as readonly string[]).includes(e.lang)) {
        langs[e.lang as Lang] = {
          title: zhPunct(String(e.data.title ?? base)),
          description: zhPunct(String(e.data.description ?? "")),
          content: zhPunct(e.content),
        };
      }
    }

    posts.push({
      title: zhPunct(String(data.title ?? base)),
      description: zhPunct(String(data.description ?? "")),
      date: String(data.date ?? `${year}-01-01`),
      year,
      slug: base,
      tags: data.tags as string[] | undefined,
      draft: primary.draft,
      lang: primary.lang,
      source_url: data.source_url as string | undefined,
      captured_at: data.captured_at as string | undefined,
      image: data.image as string | undefined,
      content: zhPunct(primary.content),
      langs,
    });
  }

  return posts
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(year: string, slug: string): Post | undefined {
  return getAllPosts().find((p) => p.year === year && p.slug === slug);
}

export function getAllPostParams() {
  return getAllPosts().map((p) => ({ year: p.year, slug: p.slug }));
}
