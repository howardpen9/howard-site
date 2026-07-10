# Source assets (not used by the site)

Published files live one level up:
- `banner.jpg` — site OG / frontmatter `image`
- `banner@2x.jpg` — X article upload (3000×1200)
- `fig-1-trust-chain.png`
- `fig-2-iltb-peak-guy.jpg`
- `fig-3-t2i-same-prompt-bias.jpg`

| folder | contents |
|---|---|
| `banner/` | HTML source + intermediate 2× renders |
| `diagrams/` | trust-chain HTML sources |
| `t2i/` | six-lab originals + cropped cells for grid rebuild |
| `frames/` | ILTB Peak Guy frame candidates |

Rebuild banner:
```bash
Chrome --headless --force-device-scale-factor=2 --window-size=1500,600 \
  --screenshot=_src/banner/banner-2x.png \
  file://$PWD/_src/banner/banner.html
# then LANCZOS → ../banner.jpg + ../banner@2x.jpg
```
