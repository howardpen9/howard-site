# find-your-niche MCP — status for writing agents

> **Consumer:** Howard’s writing agent on `howard-site` (Grok / Claude / Codex).  
> **Canonical implementation doc:** hawkfish `docs/social-db-mcp.md`  
> **Do not** re-import FYN schema from other repos — use MCP only.

## Status: v1 live (social-db)

A **read-only stdio MCP** is implemented in the **hawkfish** worktree (not yet necessarily on `~/Projects/find-your-niche` main):

| Item | Value |
|------|--------|
| Worktree | `/Users/howard/orca/workspaces/find-your-niche/hawkfish` |
| Script | `scripts/social-db-mcp.ts` |
| Scoring / recommend | `lib/socialTargets.ts` |
| package.json | `"social-db:mcp": "tsx scripts/social-db-mcp.ts"` |
| Run | `cd …/hawkfish && pnpm social-db:mcp` |
| DB | `DATABASE_URL` via dotenv from that directory’s `.env` |

**Validated by FYN agent:** empty Postgres + migrations, seed + MCP client calls, `tsc --noEmit`, `pnpm build`.

Grok user registration (no secrets in config) — see `~/.grok/config.toml` and parent [writing-ops-mcp-bridge.md](../writing-ops-mcp-bridge.md).

## Live tools (3)

### `recommend_interaction_targets`

Given a draft/post/topic, return **3–5** high-value X accounts to interact with.

Typical input:

```json
{
  "text": "Draft/article/post content or idea",
  "laneId": "ai-video-gen",
  "limit": 5,
  "windowDays": 30,
  "listId": "2069756097318277531"
}
```

Output (shape): `{ ok, targets[] }` each with `handle`, `displayName`, `bio`, `followers`, `recommendedAction`, `why[]`, `recentPosts[]`, `score`.

**Writing use:** after a blog draft or X thread is ready → call with full or condensed text → hand Howard a checklist (reply / quote / soft-@). Human executes; agent does not post.

### `search_social_posts`

Search posts already in the social DB (no live X.com pull).

Typical input: `query`, optional `handle`, `laneId`, `windowDays`, `listId`, `limit`.

**Writing use:** cite recent in-DB posts on a theme; find URLs for References.

### `get_latest_action_packet`

Latest operator action packet. If production tables are not migrated yet:

```json
{ "ok": true, "packet": null, "warning": "..." }
```

Does not crash the host agent.

## Boundary (do not violate)

| Do | Don’t |
|----|--------|
| Call named MCP tools | Import Drizzle schema / raw SQL from other repos |
| Treat results as recommendations | Auto-follow / auto-reply / write to DB |
| Expect read-only, local stdio | Expose this MCP as public HTTP |
| Tolerate empty/stale data + warnings | Assume every table is migrated |

**Cost:** MCP is a **consumption layer** (DB reads only). Ingestion cost lives in distill / list poll / cron.

## Grok connect (already registered)

```toml
[mcp_servers.find-your-niche-social-db]
command = "bash"
args = [
  "-lc",
  "cd /Users/howard/orca/workspaces/find-your-niche/hawkfish && exec pnpm social-db:mcp",
]
enabled = true
startup_timeout_sec = 45
```

After social-db lands on main, switch `cd` path to this workspace's `repos/find-your-niche`.

JSON form for Claude/Codex (with explicit env if not using dotenv cwd):

```json
{
  "mcpServers": {
    "find-your-niche-social-db": {
      "command": "pnpm",
      "args": ["social-db:mcp"],
      "cwd": "/Users/howard/orca/workspaces/find-your-niche/hawkfish",
      "env": { "DATABASE_URL": "<not committed>" }
    }
  }
}
```

## Optional P2 (not required for writing ops)

Earlier aspirational brief wanted angles / lanes / playbook tools. **Not shipped** as MCP yet; still available via FYN UI + scripts:

| Gap tool | Why still useful | Where today |
|----------|------------------|-------------|
| `get_daily_angles` | Blank-page killer for “what to write” | `lib/angles.ts`, `/angles`, `angle_runs` |
| `get_lane_board` | Identity vs market heat | `lib/laneHotness.ts` |
| `get_candidates` | 48h momentum slate | `lib/candidates.ts` |
| `score_draft` | operator-agent will-it-live | `docs/operator-agent.md` + LLM |
| `get_amplifiers` / `get_self_pulse` | Post-hoc who amplified | `repost_events`, engagement samples |

If a FYN coding agent expands MCP later: keep the same **read-only, named-tool, no raw SQL** rules; add tools beside `social-db-mcp.ts` or grow that server carefully without breaking the 3 contracts above.

## Related

| Path | Role |
|------|------|
| hawkfish `docs/social-db-mcp.md` | **SoT for tools + host configs** |
| hawkfish `scripts/social-db-mcp.ts` | MCP server |
| hawkfish `lib/socialTargets.ts` | Recommend / search logic |
| `howard-site/docs/writing-ops-mcp-bridge.md` | Cross-project flywheel |
| `docs/operator-agent.md` (FYN) | Scoring persona (UI/Claude-in-repo) |
| x-watchlist MCP | Deep xAI cohort digest (separate server) |

## Success for the writing agent

1. Draft ready → `recommend_interaction_targets` → 3–5 handles with reasons + post URLs.  
2. Need quotes/evidence → `search_social_posts`.  
3. Daily ops check → `get_latest_action_packet` (ok with warning).  
4. Never opens Postgres schema from howard-site.
