# howard-site

Personal site — minimalist, content-first, in the spirit of [rauchg.com](https://rauchg.com),
built with the [Geist](https://vercel.com/geist) design language. First-class **agent-readable**
layer: every page is also available as clean Markdown, plus `llms.txt`, RSS, sitemap, and JSON-LD.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 with Geist design tokens (`app/globals.css`)
- Geist Sans / Geist Mono (`geist` package)
- MDX posts via `next-mdx-remote/rsc` + `gray-matter`, syntax highlighting via `rehype-pretty-code`
- `next-themes` for light (default) / dark
- No database — fully static-friendly, deploys anywhere

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint
```

## Add a post

Create `posts/<year>/<slug>.mdx` with frontmatter:

```mdx
---
title: "My post"
description: "One-line summary, also used for RSS / llms.txt."
date: "2026-07-01"
tags: ["web"]
source_url: "https://howardpeng.com/2026/my-post"
captured_at: "2026-07-01"
---

Body in Markdown / MDX.
```

It auto-appears on the home list, the sitemap, the feed, `llms.txt`, and gets a `.md` twin.

## Routes

| Route | What |
|---|---|
| `/` | Bio + writing index |
| `/about` | Full bio, links, vCard |
| `/projects` | Project list (`lib/config.ts`) |
| `/<year>/<slug>` | A post |
| `/<year>/<slug>.md` | Raw Markdown of a post (rewrite → `/raw/...`) |
| `/llms.txt`, `/llms-full.txt` | Agent index + full corpus |
| `/feed.xml` | RSS 2.0 |
| `/sitemap.xml`, `/robots.txt` | SEO |
| `/contact.vcf` | vCard download |

## Configure

Edit `lib/config.ts` for name, role, bio, links, and projects. Update `SITE.url` once the
custom domain is attached.

## Deploy

Built for Vercel. Push to GitHub and import the repo, or:

```bash
pnpm dlx vercel        # preview
pnpm dlx vercel --prod # production
```

Then set the custom domain in the Vercel dashboard and update `SITE.url` in `lib/config.ts`.
