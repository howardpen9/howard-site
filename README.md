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

---

## 編輯指南(中文)

這個站的內容幾乎都集中在兩個地方:`lib/config.ts`(個人資料、連結、專案)和 `posts/`(文章)。改完 push 到 GitHub,Vercel 會自動重新部署。

### 改個人資料 / 連結 / 專案 — `lib/config.ts`

- **`SITE`**:姓名、職稱、bio、email、網址。接好自訂網域後記得把 `SITE.url` 改成正式網址(目前是佔位的 `https://howardpeng.com`),否則 RSS、sitemap、JSON-LD、`.md` 裡的連結都會指向錯的網域。
- **`LINKS`**:首頁 footer 與 About 頁的社群連結。一行一個,`handle` 可省略。
  ```ts
  { label: "X", href: "https://x.com/0xhoward_peng", handle: "@0xhoward_peng" },
  ```
- **`PROJECTS`**:`/projects` 頁的清單。`href` 省略時就只顯示文字、不可點。

### 新增一篇文章 — `posts/<年>/<slug>.mdx`

1. 在 `posts/2026/` 底下建一個 `my-post.mdx`(檔名就是網址 slug)。
2. 最上面放 frontmatter,然後寫 Markdown/MDX 內文:
   ```mdx
   ---
   title: "文章標題"
   description: "一句話摘要,會用在 RSS 與 llms.txt"
   date: "2026-07-01"
   tags: ["web"]
   source_url: "https://howardpeng.com/2026/my-post"
   captured_at: "2026-07-01"
   ---

   這裡開始寫內文。
   ```
3. 存檔即可。文章會**自動**出現在首頁清單、sitemap、RSS、`llms.txt`,並產生對應的 `/<年>/<slug>.md` 純文字版。首頁依日期新到舊排序,年份相同時左欄年份只顯示一次。

> `date` 用 `YYYY-MM-DD`;改網域後,文章裡的 `source_url` 也要一起換成正式網址。

### 改外觀(顏色 / 字體 / 間距)— `app/globals.css`

- 顏色 token 在 `:root`(淺色)與 `.dark`(深色)兩個區塊,例如 `--accent` 是連結/強調色。
- 字體用 Geist(`app/layout.tsx` 載入),不要在這裡硬寫字級;沿用既有的 token 與 `.prose` 樣式即可。

### 改導覽列 / 頁尾

- 導覽列項目在 `components/header.tsx` 的 `NAV`。
- 頁尾連結直接讀 `LINKS`,改 `lib/config.ts` 就會跟著變;結構在 `components/footer.tsx`。

### 本機預覽與上線

```bash
pnpm dev      # 本機預覽 http://localhost:3000
pnpm build    # 上線前先確認 build 過(會跑型別檢查)
```

確認沒問題後 `git add` → `git commit` → `git push`,Vercel 會自動部署。
