import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/config";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="py-4">
      <section className="flex items-center gap-4">
        <Image
          src={SITE.avatar}
          alt={SITE.name}
          width={64}
          height={64}
          priority
          className="rounded-xl border"
        />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{SITE.name}</h1>
          <p className="font-mono text-sm text-accent">{SITE.role}</p>
        </div>
      </section>

      <p className="mt-6 leading-relaxed text-muted">{SITE.bio}</p>

      <section className="mt-14">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-faint">Writing</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted">No posts yet.</p>
        ) : (
          <ul className="-mx-2">
            {posts.map((post) => (
              <li key={`${post.year}/${post.slug}`}>
                <Link
                  href={`/${post.year}/${post.slug}`}
                  className="group flex items-baseline justify-between gap-4 rounded-md px-2 py-2.5 transition-colors hover:bg-card"
                >
                  <span className="transition-colors group-hover:text-accent">{post.title}</span>
                  <time dateTime={post.date} className="shrink-0 font-mono text-xs text-faint">
                    {formatDate(post.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
