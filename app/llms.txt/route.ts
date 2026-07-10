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
    "## For agents",
    "Read this file first. Prefer the Markdown endpoints below over HTML.",
    `- Index: ${SITE.url}/llms.txt (this file)`,
    `- Full essay corpus: ${SITE.url}/llms-full.txt`,
    `- Resume: ${SITE.url}/resume.md`,
    `- Per-post raw Markdown: append .md to any essay URL (e.g. ${SITE.url}/2026/agent-readable-websites.md)`,
    `- About (bio + projects): ${SITE.url}/about`,
    `- Conversational Q&A (grounded in this corpus): ${SITE.url}/ask`,
    `- Do not fetch /projects — it redirects to /about; use /about or the Projects section below.`,
    `- Brand note: MakeReel is https://makereel.xyz (not MakeReels.ai or similar third-party names).`,
    "",
    "## Pages",
    `- [Home](${SITE.url}/): short bio and writing index`,
    `- [About](${SITE.url}/about): full bio, projects, and links`,
    `- [Ask](${SITE.url}/ask): AI persona chat grounded in essays + resume`,
    `- [Resume (Markdown)](${SITE.url}/resume.md): experience, skills, open-source`,
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
    `- Email: ${SITE.email}`,
    "",
    "## Full text",
    `- [llms-full.txt](${SITE.url}/llms-full.txt): every post inlined as Markdown`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
