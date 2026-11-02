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
          <li key={`${post.year}/${post.slug}`} className={showYear && i > 0 ? "mt-6" : undefined}>
            <Link
              href={`/${post.year}/${post.slug}`}
              className="group -mx-3 grid grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-baseline gap-x-4 rounded-md px-3 py-2.5 transition-colors hover:bg-card motion-reduce:transition-none"
            >
              <span className="font-mono text-sm text-faint">{showYear ? post.year : ""}</span>
              <span className="min-w-0 transition-colors group-hover:text-accent">
                {title}
                {post.draft && (
                  <span className="ml-2 rounded border border-accent/40 px-1.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                    draft
                  </span>
                )}
              </span>
              <time
                dateTime={post.date}
                className="text-right font-mono text-sm tabular-nums whitespace-nowrap text-faint"
              >
                {formatMonthDay(post.date)}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
