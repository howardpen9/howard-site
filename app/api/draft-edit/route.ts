import fs from "node:fs";
import path from "node:path";

// Dev-only authoring endpoint: patches the raw .mdx source of a draft post.
// It writes to the local filesystem, so it MUST never run on a deployed host.
// `VERCEL` is set in every Vercel build/runtime and unset on localhost.
const POSTS_DIR = path.join(process.cwd(), "posts");
const LANGS = new Set(["zh", "en"]);

function resolveFile(year: string, slug: string, lang: string): string | null {
  if (!/^\d{4}$/.test(year)) return null;
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null; // no dots, slashes, ..
  if (!LANGS.has(lang)) return null;
  const name = lang === "zh" ? `${slug}.mdx` : `${slug}.${lang}.mdx`;
  const full = path.join(POSTS_DIR, year, name);
  if (full !== path.normalize(full) || !full.startsWith(POSTS_DIR + path.sep)) return null;
  return full;
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

const trunc = (s: string) => (s.length > 48 ? s.slice(0, 48) + "…" : s);

type Patch = { original: string; updated: string };

export async function POST(request: Request) {
  if (process.env.VERCEL) {
    return Response.json({ error: "draft editing is disabled in production" }, { status: 403 });
  }

  let body: { year?: string; slug?: string; lang?: string; patches?: Patch[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const file = resolveFile(String(body.year), String(body.slug), String(body.lang));
  if (!file) return Response.json({ error: "invalid target" }, { status: 400 });
  if (!Array.isArray(body.patches) || body.patches.length === 0) {
    return Response.json({ error: "no patches" }, { status: 400 });
  }
  if (!fs.existsSync(file)) return Response.json({ error: "post not found" }, { status: 404 });

  const raw = fs.readFileSync(file, "utf8");
  // Keep the frontmatter block untouched; only patch the body below it.
  const fm = raw.match(/^---\n[\s\S]*?\n---\n/);
  const head = fm ? fm[0] : "";
  let text = raw.slice(head.length);

  const results: { status: string; original: string }[] = [];
  let applied = 0;

  for (const p of body.patches) {
    const original = String(p?.original ?? "");
    const updated = String(p?.updated ?? "");
    if (!original || original === updated) {
      results.push({ status: "skip", original: trunc(original) });
      continue;
    }
    const count = countOccurrences(text, original);
    if (count === 0) {
      results.push({ status: "not-found", original: trunc(original) });
      continue;
    }
    if (count > 1) {
      results.push({ status: "ambiguous", original: trunc(original) });
      continue;
    }
    text = text.replace(original, updated); // string arg → literal, first (only) match
    applied++;
    results.push({ status: "ok", original: trunc(original) });
  }

  if (applied > 0) fs.writeFileSync(file, head + text, "utf8");
  // Observability: surface each save in the dev log (applied + any skips).
  console.log(
    `[draft-edit] ${body.lang} ${body.year}/${body.slug} — applied ${applied}/${body.patches.length}` +
      results
        .filter((r) => r.status !== "ok")
        .map((r) => `\n  ✗ ${r.status}: ${r.original}`)
        .join(""),
  );
  return Response.json({ applied, total: body.patches.length, results });
}
