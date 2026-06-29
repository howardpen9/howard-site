import { getAllPosts } from "@/lib/posts";
import { PostList, type PostListItem } from "@/components/post-list";

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
      <PostList posts={posts} />
    </div>
  );
}
