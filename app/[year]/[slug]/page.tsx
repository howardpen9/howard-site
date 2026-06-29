import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostParams, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { Mdx } from "@/components/mdx";
import { JsonLd } from "@/components/json-ld";
import { LangToggle, type LangPane } from "@/components/lang-toggle";
import { DraftEditor } from "@/components/draft-editor";
import { ReadingMeta } from "@/components/reading-meta";
import { readingLabel } from "@/lib/reading";
import { Toc } from "@/components/toc";
import { SITE } from "@/lib/config";
import { LANGS } from "@/lib/posts";

const LANG_LABEL: Record<string, string> = { zh: "中文", en: "EN" };

type Params = { year: string; slug: string };

export function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { year, slug } = await params;
  const post = getPost(year, slug);
  if (!post) return {};
  const url = `/${year}/${slug}`;

  const banner = post.image ?? null;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      types: { "text/markdown": [{ url: `${url}.md`, title: `${post.title} (Markdown)` }] },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      images: banner ? [{ url: banner, width: 1200, height: 675, alt: post.title }] : undefined,
    },
    twitter: banner
      ? { card: "summary_large_image", images: [banner], site: "@0xhoward_peng" }
      : undefined,
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { year, slug } = await params;
  const post = getPost(year, slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE.url}/${year}/${slug}`,
    author: { "@type": "Person", name: SITE.name, url: SITE.url },
    keywords: post.tags?.join(", "),
  };

  // Draft posts on localhost get a click-to-edit overlay (never on Vercel).
  const editable = !!post.draft && !process.env.VERCEL;

  // Per-language reading estimate (length cue) for the meta row.
  const readingStats: Record<string, string> = {};
  for (const code of LANGS) {
    const v = post.langs[code];
    if (v) readingStats[code] = readingLabel(v.content, code);
  }

  const panes: LangPane[] = LANGS.filter((code) => post.langs[code]).map((code) => {
    const v = post.langs[code]!;
    return {
      code,
      label: LANG_LABEL[code] ?? code,
      node: (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">{v.title}</h1>
          <div className="mt-8">
            {editable ? (
              <DraftEditor year={year} slug={slug} lang={code}>
                <Mdx source={v.content} />
              </DraftEditor>
            ) : (
              <Mdx source={v.content} />
            )}
          </div>
        </>
      ),
    };
  });

  return (
    <article className="py-4">
      <Link href="/" className="font-mono text-xs text-faint transition-colors hover:text-foreground">
        ← back
      </Link>
      <div className="mt-6 mb-6 flex items-center gap-3 text-sm text-faint">
        {post.draft && (
          <span className="rounded border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            draft · local only
          </span>
        )}
        <time dateTime={post.date} className="font-mono">{formatDate(post.date)}</time>
        <a href={`/${year}/${slug}.md`} className="font-mono transition-colors hover:text-foreground">
          [view as .md]
        </a>
        <ReadingMeta stats={readingStats} />
      </div>
      <LangToggle panes={panes} />
      {post.tags && post.tags.length > 0 && (
        <footer className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs text-faint">
              #{tag}
            </span>
          ))}
        </footer>
      )}
      <Toc />
      <JsonLd data={articleJsonLd} />
    </article>
  );
}
