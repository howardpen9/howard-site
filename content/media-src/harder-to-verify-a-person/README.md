# Source assets (not deployed)

This folder lives under `content/media-src/` so it is **not** copied to Vercel
via `public/`. Published files for the site are under:

`public/posts/harder-to-verify-a-person/`

Current published names (WebP):

- `banner.webp` — site OG / frontmatter `image`
- `fig-1-trust-chain.webp`
- `fig-2-iltb-peak-guy.webp`
- `fig-3-t2i-same-prompt-bias.webp`

| folder | contents |
|---|---|
| `banner/` | HTML source + intermediate 2× renders |
| `diagrams/` | trust-chain HTML sources |
| `t2i/` | six-lab originals + cropped cells for grid rebuild |
| `frames/` | ILTB Peak Guy frame candidates |

Rebuild banner (from this directory):

```bash
Chrome --headless --force-device-scale-factor=2 --window-size=1500,600 \
  --screenshot=banner/banner-2x.png \
  file://$PWD/banner/banner.html
# then convert → ../../../public/posts/harder-to-verify-a-person/banner.webp
```
