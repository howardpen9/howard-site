# Writing Ops MCP Bridge

> **Status:** bridge design + consumer registration notes for **howard-site**.  
> Source repos own implementation. Do **not** treat this as a license to edit other repos from a howard-site session.

Howard’s long-form writing and X ops pull from three local systems. The bridge pattern is: **each repo owns its data; each exposes a thin read-only MCP; the writing agent on howard-site consumes tools, never raw DBs.**

| System | Path | Role in writing | MCP today |
|--------|------|-----------------|-----------|
| **video-and-voice-transcript** | `~/Projects/video-and-voice-transcript` | Source material (YouTube, voice, interviews) | None — needs stdio MCP (see brief) |
| **find-your-niche** | hawkfish worktree (see below); main `~/Projects/find-your-niche` after merge | Social DB: who to @ / reply / quote; post search; action packet | **Live v1** — `pnpm social-db:mcp` (3 tools) |
| **x-watchlist** | `~/Projects/x-watchlist` | Cohort talk, quotes, people angles, follow targets | **Live** HTTP MCP (6 tools); ops tools still optional |
| **howard-site** (this repo) | `~/Projects/howard-site` | Draft MDX (`/write-blog`, `/supplement`) | Consumer only |
| **Typefully** (SaaS) | external | Thread packaging, schedule, queue, self-analytics | **Live** HTTP MCP (25 tools) — see [typefully-mcp-dd.md](./typefully-mcp-dd.md) |

### find-your-niche social-db (v1 — implemented)

| Item | Value |
|------|--------|
| Worktree (current) | `/Users/howard/orca/workspaces/find-your-niche/hawkfish` |
| Command | `pnpm social-db:mcp` → `scripts/social-db-mcp.ts` |
| Logic | `lib/socialTargets.ts` |
| Canonical doc | hawkfish `docs/social-db-mcp.md` |
| Cost | Cheap: **read-only DB**. No extra X.com API. Expensive part is distill/poll/cron on the FYN side. |

**Tools:**

| Tool | Use in writing |
|------|----------------|
| `recommend_interaction_targets` | Give draft/article text → 3–5 X handles worth reply / quote / soft-@ |
| `search_social_posts` | Search ingested posts by topic / handle / lane |
| `get_latest_action_packet` | Operator action packet; may return `warning` if prod not migrated yet |

Grok user config registers this as `find-your-niche-social-db` in `~/.grok/config.toml` (loads hawkfish `.env` via `cd`; no `DATABASE_URL` in the config file). **Restart session or `/mcps` refresh** after config changes.

## Writing flywheel (three stages)

```
[1] Source          [2] Angle + draft           [3] Package & schedule      [4] Post-publish ops
    │                     │                            │                           │
    ▼                     ▼                            ▼                           ▼
 video MCP           x-watchlist                  Typefully MCP              fyn social-db
 x-watchlist         (digest / member)            thread / queue / time      recommend_interaction_targets
 (quotes)            fyn angles* (not MCP yet)    self-analytics             search_social_posts
    │                     │                            │                       x-watchlist member/search
    └──────────►  howard-site write-blog  ─────────────┘
                 writing-process + voice
```

\* Daily angles / lane board still live in FYN UI + scripts until a later MCP expansion.

| Stage | Question | Preferred tools |
|-------|----------|-----------------|
| **1. Source** | What did I watch / hear / read? | video (future); x-watchlist: `search_posts`, `hot_posts`, `member`; fyn: `search_social_posts` |
| **2. Angle + draft** | Is this on-lane? What’s the hook? | x-watchlist: `discussion_digest`, `activity_pulse`; FYN dashboard/angles until MCP expands |
| **3. Ops** | Who to reply / QT / follow / soft-@? | **fyn `recommend_interaction_targets` (primary)**; fyn `get_latest_action_packet`; x-watchlist `member` / search |

## Ownership rules

1. **No shared monorepo DB for the writing agent.** howard-site only talks **MCP**.
2. **Read-only consumption.** No post-to-X, no migrations, no poll triggers from the writing agent.
3. **Decision-sized payloads.** Targets + evidence posts, not full table dumps.
4. **Secrets stay in the owning service.** FYN: `DATABASE_URL` in hawkfish `.env` only.

## When the writing agent should call what

1. **Video / voice source** → video MCP when it exists; else paste / open that repo.
2. **X / Grok / xAI culture seed** → x-watchlist `discussion_digest` → `search_posts` / `hot_posts` / `member`.
3. **Draft ready / about to publish / just published** →  
   `recommend_interaction_targets` with the draft (or thesis) text → hand Howard a **3–5 handle checklist** with `recommendedAction` + `why` + recent post URLs. Do **not** auto-follow or auto-reply.
4. **Need evidence posts on a topic** → `search_social_posts`.
5. **Operator daily packet** → `get_latest_action_packet` (tolerate warning if tables missing).
6. **Always** keep Howard’s raw wording primary (`content/writing-process.md`). MCP is evidence and targeting, not the thesis.

## Suggested remaining build order

| Order | Repo | Work | Status |
|-------|------|------|--------|
| **1** | find-your-niche | social-db MCP (3 tools) | **Done** (hawkfish) |
| **2** | x-watchlist | Ops tools: shared_attention / directory_search | Brief ready |
| **3** | video-and-voice-transcript | stdio transcript MCP | Brief ready |
| **4** | find-your-niche | Optional: angles / lanes / score_draft tools | P2 — see brief |
| **5** | howard-site | write-blog skill auto-calls MCP | Later |

## Grok registration (live)

Already in user config (`~/.grok/config.toml`). Pattern used:

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

Why `bash -lc` + `cd`: Grok has no `cwd` on `mcp add`; process must run inside hawkfish so `dotenv/config` loads that repo’s `.env`. **After merge to main**, change path to this workspace's `repos/find-your-niche`.

### Other hosts (Codex / Claude)

See hawkfish `docs/social-db-mcp.md`. JSON shape:

```json
{
  "mcpServers": {
    "find-your-niche-social-db": {
      "command": "pnpm",
      "args": ["social-db:mcp"],
      "cwd": "/Users/howard/orca/workspaces/find-your-niche/hawkfish",
      "env": { "DATABASE_URL": "<from env, not committed>" }
    }
  }
}
```

### x-watchlist (HTTP)

```json
{
  "mcpServers": {
    "x-watchlist": {
      "type": "http",
      "url": "https://<your-x-watchlist-host>/mcp",
      "headers": { "X-MCP-Token": "<from env MCP_TOKEN>" }
    }
  }
}
```

### video-and-voice-transcript (stdio — not built yet)

See [video-transcript-mcp.md](./agent-briefs/video-transcript-mcp.md).

## Agent briefs & DD

| Doc | Role |
|-----|------|
| [typefully-mcp-dd.md](./typefully-mcp-dd.md) | **DD: Typefully for writing packaging + ops (not essay SoT)** |
| [find-your-niche-mcp.md](./agent-briefs/find-your-niche-mcp.md) | Live social-db + optional P2 gaps |
| [x-watchlist-mcp.md](./agent-briefs/x-watchlist-mcp.md) | Ops expansion brief for x-watchlist agent |
| [video-transcript-mcp.md](./agent-briefs/video-transcript-mcp.md) | Build transcript MCP brief |

## Related in this repo

- Writing process SoT: `content/writing-process.md`
- Voice: `content/writing-voice.md`
- Skill: `.claude/skills/write-blog/SKILL.md`
