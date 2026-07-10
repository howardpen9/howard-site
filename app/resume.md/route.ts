import fs from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/config";

export const dynamic = "force-static";

const RESUME_PATH = path.join(process.cwd(), "content", "persona", "resume.md");

export function GET() {
  if (!fs.existsSync(RESUME_PATH)) {
    return new Response("Not found", { status: 404 });
  }

  const resume = fs.readFileSync(RESUME_PATH, "utf8").trim();
  const header = [
    `# ${SITE.name} — Resume`,
    "",
    `Author: ${SITE.name} (${SITE.url})`,
    `Canonical: ${SITE.url}/resume.md`,
    `Role: ${SITE.role}`,
    "",
    "---",
    "",
  ].join("\n");

  return new Response(`${header}${resume}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
