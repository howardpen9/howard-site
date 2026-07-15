# Site performance notes

Public domain: **howard-peng.xyz** (see also `site-domain.md`).

## 1. DNS / edge routing (ops, not code)

From Asia, Vercel custom nameservers sometimes resolve the apex to Anycast IPs
with poor BGP paths (high RTT + packet loss), e.g. `64.29.17.x`. Classic Vercel
A records such as `76.76.21.21` and `cname.vercel-dns.com` are usually better
routed for the same region.

**Recommended (manual, in domain registrar / DNS panel):**

1. Move DNS off Vercel nameservers to Cloudflare (or any recursive DNS).
2. Keep the **orange cloud off** (DNS-only) unless you intentionally want CF CDN
   in front of Vercel.
3. Records:
   - `A` `howard-peng.xyz` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
4. In Vercel → Project → Domains, keep both hostnames attached and valid.

This is outside git. Re-test with `dig` + multi-probe ping after the change.

## 2. Static media (handled in repo)

| Lever | Where |
| --- | --- |
| Long `Cache-Control` on `/public` media | `next.config.ts` `headers()` |
| MDX `img` / `video` → optimized components | `components/mdx-media.tsx` via `components/mdx.tsx` |
| Prefer WebP sources under `public/posts`, `public/projects` | committed assets |
| Authoring scrap / T2I sources **not** under `public/` | `content/media-src/` (not deployed) |

When replacing a figure, change the filename (or path) so immutable caches pick
up the new file.

## 3. Turbopack scripts in production HTML

Next.js **16** uses Turbopack as the **default production bundler**. Chunks named
`turbopack-*.js` in the live HTML are expected, not a mis-deploy of `next dev`.

- Production build: `pnpm build` → `node scripts/github-activity.mjs && next build`
- Local low-RAM dev uses webpack on purpose: `pnpm dev` (`--webpack`)
- Optional Turbopack dev: `pnpm dev:turbo` (can use a lot of memory)

Do **not** “fix” production by forcing webpack unless you hit a real Turbopack
bug. Prefer fixing the real bottlenecks: DNS path, media weight, cache headers.

## 4. Quick verify after deploy

```bash
# HTML should still list turbopack chunks (Next 16) — OK
curl -s https://howard-peng.xyz/ | grep -o 'turbopack-[^"]*'

# Static figure should advertise long cache
curl -sI https://howard-peng.xyz/posts/ai-four-layer-cake/fig-1-four-layer-cake.webp \
  | grep -i cache-control

# Image optimizer path (MDX figures go through next/image)
curl -sI 'https://howard-peng.xyz/_next/image?url=%2Fposts%2Fai-four-layer-cake%2Ffig-1-four-layer-cake.webp&w=640&q=75' \
  | head -20
```
