import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostList, type PostListItem } from "@/components/post-list";
import { SITE } from "@/lib/config";

export default function Home() {
  const posts: PostListItem[] = getAllPosts().map((p) => ({
    year: p.year,
    slug: p.slug,
    date: p.date,
    draft: !!p.draft,
    titles: { zh: p.langs.zh?.title, en: p.langs.en?.title },
    fallback: p.title,
  }));

  return (
    <div className="py-8">
      <section className="mb-10">
        <p className="text-[15px] leading-relaxed text-muted">{SITE.bio}</p>
        <p className="mt-4 font-mono text-xs text-faint">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <span className="mx-2">·</span>
          <Link href="/resume.md" className="transition-colors hover:text-foreground">
            resume.md
          </Link>
          <span className="mx-2">·</span>
          <Link href="/llms.txt" className="transition-colors hover:text-foreground">
            llms.txt
          </Link>
          <span className="mx-2">·</span>
          <Link href="/ask" className="transition-colors hover:text-foreground">
            Ask
          </Link>
        </p>
      </section>
      <PostList posts={posts} />
    </div>
  );
}
