import { getAllPostParams, getPost } from "@/lib/posts";
import { SITE } from "@/lib/config";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllPostParams();
}

export async function GET(_req: Request, { params }: { params: Promise<{ year: string; slug: string }> }) {
  const { year, slug } = await params;
  const post = getPost(year, slug);
  if (!post) return new Response("Not found", { status: 404 });

  const frontmatter = [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    "",
    `Author: ${SITE.name} (${SITE.url})`,
    `Published: ${post.date}`,
    `Canonical: ${SITE.url}/${year}/${slug}`,
    post.tags?.length ? `Tags: ${post.tags.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const body = `${frontmatter}\n\n---\n\n${post.content.trim()}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
