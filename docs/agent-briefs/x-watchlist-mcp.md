# Agent brief: x-watchlist MCP (ops expansion)

> **Paste this entire file** into a coding agent session whose cwd is  
> `mastering-social-media/repos/x-watchlist`.  
> **Consumer:** Howard’s writing agent on `howard-site` (Grok Build / Claude).  
> **Authorship of this brief:** written from howard-site; implement only in x-watchlist.

## Why

x-watchlist already exposes a **read-only HTTP MCP** at `/mcp` so external agents can ground copy in what the xAI cohort is saying. That covers **pre-write research**.

**Gap:** after a post ships, Howard still needs **who to follow / soft-@ / QT / reply**. The data already exists as exported JSON (`following-agg`, member tags, graph), but is **not MCP’d**. Add thin tools; do not redesign the poll pipeline.

Parent design: `howard-site/docs/writing-ops-mcp-bridge.md`.

## Current surface (do not break)

| Tool | Role |
|------|------|
| `list_cohorts` | Valid cohort ids + counts |
| `discussion_digest` | Hot dimensions, complaints, wishes, competitors — *what to write* |
| `hot_posts` | Top reach posts (filter by type) |
| `activity_pulse` | Volume / type mix / top posters |
| `search_posts` | Keyword search over 30d timeline |
| `member` | One handle: bio + recent posts + dimensions |

Implementation today: `mcp.mjs` (mounted by `server.mjs`). Data: exported JSON under `$OUT_DIR` / volume, **not** live SQLite queries. Auth: optional `MCP_TOKEN` → `X-MCP-Token` or `Authorization: Bearer`.

Roadmap context: `docs/mcp-roadmap.md` (Phase 0–1 live; 2–5 planned).

## Work to do (priority)

### P0 — must ship for writing ops

| Tool name | Input | Behavior / return shape | Data source |
|-----------|--------|-------------------------|-------------|
| `shared_attention` | `cohort?` (default `xai`), `limit?` (default 20) | Leaderboard of accounts the **cohort collectively follows** (outside or mixed). Each row: `handle`, `displayName?`, `followers?`, `score` / rank, `category?` if present, `inCohort?`. | `{cohort}-following-agg.json` (`globalRanked` or equivalent) |
| `directory_search` | `cohort?`, `query?` (substring on handle/bio/name), `tags?` (string[]), `tier?`, `limit?` | Filtered member directory. Each: `handle`, `bio`, `followers`, `tags[]`, activity metrics if available. | `{cohort}.json` handles |

### P1 — high value

| Tool name | Input | Behavior | Data source |
|-----------|--------|----------|-------------|
| `engagement_targets` | `cohort?`, `topic?` (optional keyword), `limit?` (default 10) | **Composite** list for “today’s amplify list”: active posters on topic (from digest/timeline) + mid-band external attention from following-agg. Return ranked handles with `reason` (why listed), `url?` of a sample post, `actionHint` ∈ `reply` \| `qt` \| `follow` \| `soft_at`. | digest + timeline + following-agg |
| `data_freshness` | `cohort?` | `{ generatedAt, cohorts, filesPresent[] }` so agents know staleness. | `manifest.json` + file mtimes if useful |

### P2 — backlog (only if P0/P1 done and easy)

Align with `docs/mcp-roadmap.md`:

- `trend_delta` — week-over-week topic movement  
- `rising_members` — volume/engagement jump  
- `thread` — post + reply chain context  
- Do **not** implement write-side `submit_insight` or monetization in this task unless Howard explicitly expands scope  

## Implementation constraints

1. **Read-only.** No OAuth post, no queue writes, no twitterapi calls from MCP handlers.
2. **Same pattern as existing tools:** load JSON via the existing loader; slim payloads; `ok` / `err` helpers in `mcp.mjs`.
3. **Log usage** through existing `logUsage` wrapper (demand radar).
4. **Do not expose** `TWITTERAPI_KEY`, SQLite path contents beyond what’s already in export JSON, or `x_oauth_tokens`.
5. Keep optional `cohort` default `"xai"`; call `list_cohorts` still documents valid ids.
6. Update README MCP tool table + a short note in `docs/mcp-roadmap.md` backlog (mark shipped items).

## Transport + auth

- **Transport:** existing Streamable HTTP at `/mcp` (no new stdio binary required).
- **Auth:** existing `MCP_TOKEN` gate. Do not hardcode tokens in repo.
- **Local test:** `pnpm build && node server.mjs` → `http://localhost:4173/mcp` (port may match project default).

## Out of scope

- Opening MCP to external paying customers  
- Multi-tenant `MCP_TOKENS` map (roadmap Phase 2) — optional later  
- LLM-backed `draft_angles` inside this service  
- Changing poll/classify cost path  
- Anything in find-your-niche or video-and-voice-transcript repos  

## Definition of done

1. `tools/list` on `/mcp` includes the new P0 tools (and P1 if implemented).
2. Manual check (replace host/token):

```bash
# tools/list
curl -sS "$XWATCH_MCP_URL" \
  -H "Authorization: Bearer $MCP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# shared_attention smoke (shape depends on SDK; or use an MCP client)
# Expect: non-empty ranked handles when following-agg export exists
```

3. From a **separate** agent session (howard-site or any MCP host), calling `shared_attention` + `directory_search` returns usable JSON without cloning this repo’s SQLite.
4. No secrets in responses or committed files.

## In-repo references (read first)

| Path | Why |
|------|-----|
| `mcp.mjs` | Server + tool registration pattern |
| `server.mjs` | Mount `/mcp`, token, `JSON_DIR` |
| `README.md` (MCP section) | Public connect docs — update tool table |
| `docs/mcp-roadmap.md` | Phases + backlog |
| `docs/content-ops-strategy.md` | Who to amplify (product intent) |
| `docs/architecture.md` / `docs/pipeline-spec.md` | Export shapes |
| Exported JSON samples under `dist/data/` or `public/data/` / `data-runtime/json/` | Real field names for following-agg and directory |

## Suggested commit message (if you commit)

```
feat(mcp): add shared_attention and directory_search for writing ops
```

## Success for the writing agent

After this ships, a blog/X session can:

1. Research with existing digest/hot_posts/search  
2. After draft/publish, call `engagement_targets` or `shared_attention` + `directory_search`  
3. Hand Howard a **10-handle checklist** with reasons — still human-executed follows/replies  
