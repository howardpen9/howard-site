import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatMonthDay } from "@/lib/format";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="py-8">
      {posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post, i) => {
            const showYear = i === 0 || posts[i - 1].year !== post.year;
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
                    {post.title}
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
      )}
    </div>
  );
}
