import { getAllPosts } from "@/lib/posts";
import { SITE, PROJECTS, LINKS } from "@/lib/config";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.role}. ${SITE.description}`,
    "",
    SITE.bio,
    "",
    "## Pages",
    `- [Home](${SITE.url}/): bio and writing index`,
    `- [About](${SITE.url}/about): full bio and links`,
    `- [Projects](${SITE.url}/projects): things built`,
    "",
    "## Writing",
    ...posts.map(
      (p) => `- [${p.title}](${SITE.url}/${p.year}/${p.slug}.md): ${p.description} (${p.date})`,
    ),
    "",
    "## Projects",
    ...PROJECTS.map((p) => `- ${p.name}: ${p.tagline}${p.href ? ` (${p.href})` : ""}`),
    "",
    "## Elsewhere",
    ...LINKS.map((l) => `- ${l.label}: ${l.href}`),
    "",
    "## Full text",
    `- [llms-full.txt](${SITE.url}/llms-full.txt): every post inlined as Markdown`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
