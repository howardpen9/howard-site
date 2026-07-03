// Build-time fetch of Howard's most recently pushed repos → chat persona.
// Runs before `next build` (see package.json); fails soft so an API hiccup
// never breaks a deploy — the previous file (if any) just stays in place.
import fs from "node:fs";

const OUT = "content/persona/github-activity.md";

try {
  const res = await fetch("https://api.github.com/users/howardpen9/repos?sort=pushed&per_page=20", {
    headers: { "User-Agent": "howard-site-build" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos = await res.json();
  const lines = repos
    .filter((r) => !r.fork)
    .slice(0, 12)
    .map(
      (r) =>
        `- ${r.name} (last push ${r.pushed_at.slice(0, 10)}, ${r.stargazers_count}★${r.language ? `, ${r.language}` : ""})` +
        `${r.description ? ` — ${r.description}` : ""}`,
    );
  const md = `# GitHub activity (auto-generated at build, most recently pushed first)

These are Howard's most recently active public repos. When describing what he is building right now, lead with the top entries here.

${lines.join("\n")}
`;
  fs.mkdirSync("content/persona", { recursive: true });
  fs.writeFileSync(OUT, md);
  console.log(`[github-activity] wrote ${lines.length} repos to ${OUT}`);
} catch (err) {
  console.warn(`[github-activity] skipped (${err.message}) — keeping previous file`);
}
