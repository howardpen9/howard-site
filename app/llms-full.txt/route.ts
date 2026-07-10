import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/config";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const header = [`# ${SITE.name} — full text`, "", `> ${SITE.description}`, "", SITE.bio, ""];

  const body = posts.map((p) =>
    [
      "",
      "---",
      "",
      `# ${p.title}`,
      "",
      `URL: ${SITE.url}/${p.year}/${p.slug}`,
      `Published: ${p.date}`,
      "",
      p.content.trim(),
    ].join("\n"),
  );

  return new Response([...header, ...body].join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
