import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostParams, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { Mdx } from "@/components/mdx";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/config";

type Params = { year: string; slug: string };

export function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { year, slug } = await params;
  const post = getPost(year, slug);
  if (!post) return {};
  const url = `/${year}/${slug}`;
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
    },
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

  return (
    <article className="py-4">
      <Link href="/" className="font-mono text-xs text-faint transition-colors hover:text-foreground">
        ← back
      </Link>
      <header className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-faint">
          <time dateTime={post.date} className="font-mono">{formatDate(post.date)}</time>
          <a href={`/${year}/${slug}.md`} className="font-mono transition-colors hover:text-foreground">
            view as .md
          </a>
        </div>
      </header>
      <div className="mt-8">
        <Mdx source={post.content} />
      </div>
      <JsonLd data={articleJsonLd} />
    </article>
  );
}
