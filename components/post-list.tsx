"use client";

import Link from "next/link";
import { formatMonthDay } from "@/lib/format";
import { useSiteLang } from "./lang-store";

export type PostListItem = {
  year: string;
  slug: string;
  date: string;
  draft: boolean;
  titles: { zh?: string; en?: string };
  fallback: string;
};

export function PostList({ posts }: { posts: PostListItem[] }) {
  const lang = useSiteLang();

  if (posts.length === 0) return <p className="text-sm text-muted">No posts yet.</p>;

  return (
    <ul>
      {posts.map((post, i) => {
        const showYear = i === 0 || posts[i - 1].year !== post.year;
        const title =
          post.titles[lang as "zh" | "en"] || post.titles.en || post.titles.zh || post.fallback;
        return (
          <li key={`${post.year}/${post.slug}`}>
            <Link
              href={`/${post.year}/${post.slug}`}
              className="group flex items-baseline gap-4 rounded-md py-2.5 transition-colors"
            >
              <span className="w-12 shrink-0 font-mono text-sm text-faint">
                {showYear ? post.year : ""}
              </span>
              <span className="flex-1 transition-colors group-hover:text-accent">
                {title}
                {post.draft && (
                  <span className="ml-2 rounded border border-accent/40 px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                    draft
                  </span>
                )}
              </span>
              <time dateTime={post.date} className="shrink-0 font-mono text-sm text-faint">
                {formatMonthDay(post.date)}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
