# 2026 posts index

Scan this file instead of `ls` or starting localhost.

**Sort:** `date` desc (same idea as `lib/posts.ts`).  
**One row = one essay** (`<slug>.mdx`). Sidecars are columns, not rows.

Canonical public host: [howard-peng.xyz](https://howard-peng.xyz) (not howardpeng.com).

---

## How to read progress

| Field | Meaning |
|-------|---------|
| **Status** | `live` / `draft` / `wip` — publish gate (`draft` frontmatter or no `.mdx` yet) |
| **Stage** | Pipeline step (0–6), more useful than binary draft |
| **Progress** | Rough % + bar — subjective; stage is the source of truth |
| **Theme** | Loose cluster (same as Themes table below) |
| **Next** | Single next action to move the essay forward |

### Stage ladder

| Stage | Label | Meaning |
|------:|-------|---------|
| 0 | `idea` | Only a thought — no board, no body |
| 1 | `board` | Spine / RAW KEEP (`.board.html` or locked thesis) |
| 2 | `zh` | Chinese primary has shape (`.mdx`) |
| 3 | `en` | English twin exists (`.en.mdx`) |
| 4 | `gates` | Anti-machine gates treated (RAW KEEP → X CUTS) |
| 5 | `polish` | Figs, refs, title/desc ship-ready; checklist before `draft: false` |
| 6 | `live` | `draft: false` / unset — ships on Vercel |

**Default bar map** (tweak by hand when the body is thicker/thinner than the stage):

| Stage | Progress | Bar |
|------:|---------:|-----|
| 0 | 5% | `█░░░░░░░░░` |
| 1 | 15% | `██░░░░░░░░` |
| 2 | 30% | `███░░░░░░░` |
| 3 | 55% | `██████░░░░` |
| 4 | 75% | `████████░░` |
| 5 | 90% | `█████████░` |
| 6 | 100% | `██████████` |

Per-essay detail (optional): top YAML in `<slug>.notes.md` — same fields as the table. Notes are gitignored; **this README is the shared dashboard**.

---

## Draft

| Date | Title | Stage | Progress | Theme | EN | notes | board | Next |
|------|-------|------:|----------|-------|----|-------|-------|------|
| 2026-07-13 | 你缺的不是又一個 MCP，是 peer · [`you-dont-need-another-mcp-you-need-a-peer`](./you-dont-need-another-mcp-you-need-a-peer.mdx) | 5 polish | `█████████░` 90% | Agent DX / cost | ✓ | ✓ | — | Ship checklist: real `/codex` shot if possible, public plugin link or soft language, then `draft: false` |
| 2026-07-12 | 注意力的極限 · [`ai-saas-as-rent`](./ai-saas-as-rent.mdx) | 3 en | `███░░░░░░░` 35% | Agent DX / cost | ✓ | ✓ | — | Expand beats / decide if it merges with intent-burns-tokens; thicken body |
| 2026-07-02 | 你以為在聽 463 個人說話,其實只有五個人在說 · [`xai-voice-is-ten-people`](./xai-voice-is-ten-people.mdx) | 3 en | `██████░░░░` 55% | xAI / X data | ✓ | ✓ | — | Frozen numbers vs live SQLite gap; gates + ship pass |
| 2026-07-02 | 沒有人在找儀表板——他們在找這三件事 · [`selling-behavior-data`](./selling-behavior-data.mdx) | 3 en | `██████░░░░` 55% | xAI / X data | ✓ | ✓ | — | Confirm pricing language; gates + ship pass |
| 2026-06-29 | 不可驗證,才是定價權 · [`priced-not-verified`](./priced-not-verified.mdx) | 3 en | `███████░░░` 65% | Verify / price / GEO | ✓ | ✓ | — | Gates + polish (figs/refs); longest non-peer draft |

## Live

| Date | Title | Stage | Progress | Theme | EN | notes | board |
|------|-------|------:|----------|-------|----|-------|-------|
| 2026-07-10 | 訊息能查,人查不了 · [`harder-to-verify-a-person`](./harder-to-verify-a-person.mdx) | 6 live | `██████████` 100% | Verify / price / GEO | ✓ | ✓ | — |
| 2026-06-30 | 在 xAI 工作的這些人,到底在意什麼? · [`what-xai-people-care-about`](./what-xai-people-care-about.mdx) | 6 live | `██████████` 100% | xAI / X data | ✓ | ✓ | — |
| 2026-06-27 | DeepSeek 開源的不是模型,是商業屠殺 ft. DeepSpec · [`ai-four-layer-cake`](./ai-four-layer-cake.mdx) | 6 live | `██████████` 100% | Structure / capital | ✓ | ✓ | — |
| 2026-06-26 | 價值 vs 注意力: X.com 上的 7 倍倒掛 · [`attention-vs-value`](./attention-vs-value.mdx) | 6 live | `██████████` 100% | xAI / X data | ✓ | — | — |
| 2026-06-25 | Build websites that agents can read · [`agent-readable-websites`](./agent-readable-websites.mdx) | 6 live | `██████████` 100% | Verify / price / GEO | —¹ | — | — |
| 2026-05-22 | 他們的地板,是我們的天花板 · [`their-floor-was-our-ceiling`](./their-floor-was-our-ceiling.mdx) | 6 live | `██████████` 100% | Structure / capital | ✓ | — | — |

¹ Single file is EN-leaning; no separate `.en.mdx` twin.

## WIP / orphan

| Date | Title | Stage | Progress | Theme | Kind | Path | Next |
|------|-------|------:|----------|-------|------|------|------|
| 2026-07-14 | Intent Burns Tokens | 1 board | `██░░░░░░░░` 15% | Agent DX / cost | board only | [`intent-burns-tokens.board.html`](./intent-burns-tokens.board.html) | Open `intent-burns-tokens.mdx` from locked thesis (tokens ⇄ intent) |

---

## Themes (loose)

| Cluster | Slugs |
|---------|--------|
| xAI / X data | `what-xai-people-care-about`, `xai-voice-is-ten-people`, `attention-vs-value`, `selling-behavior-data` |
| Verify / price / GEO | `harder-to-verify-a-person`, `priced-not-verified`, `agent-readable-websites` |
| Structure / capital | `their-floor-was-our-ceiling`, `ai-four-layer-cake` |
| Agent DX / cost | `you-dont-need-another-mcp-you-need-a-peer`, `ai-saas-as-rent`, `intent-burns-tokens` (wip) |

---

## File convention

```text
<slug>.mdx           # primary body (usually zh; see agent-readable-websites exception)
<slug>.en.mdx        # English twin
<slug>.notes.md      # writing notes + optional status YAML — not loaded by the site
<slug>.board.html    # optional local spine board — not loaded by the site
```

### notes status YAML (optional, recommended for draft/wip)

Put this **at the top** of `<slug>.notes.md` (gitignored). Keep fields in sync with this README when stage moves.

```yaml
---
slug: example-slug
status: draft          # wip | draft | live
stage: 3               # 0–6
stage_label: en        # idea | board | zh | en | gates | polish | live
progress: 55           # 0–100
theme: "Agent DX / cost"
next: "One concrete next action"
updated: "2026-07-15"
---
```

Images live under `public/posts/<slug>/`, not here.

**Do not** nest topic folders under `posts/2026/` — `lib/posts.ts` uses the parent folder name as `year`.

---

## Refresh

When you add, retitle, or move a post along the ladder:

1. Update this README (date / title / status section / stage / progress / theme / EN / notes / board / **Next**).
2. If `<slug>.notes.md` exists, update its top status YAML to match.

Not auto-generated. Stage is the authority; the bar is a glance aid.
