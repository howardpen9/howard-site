# Agent brief: video-and-voice-transcript MCP (source corpus)

> **Paste this entire file** into a coding agent session whose cwd is  
> `mastering-social-media/repos/video-and-voice-transcript`.  
> **Consumer:** Howard’s writing agent on `howard-site` (Grok Build / Claude).  
> **Authorship of this brief:** written from howard-site; implement only in this repo.

## Why

Long-form posts often start from a **YouTube video, interview, or voice note**. This repo already turns media into structured understanding:

- `projects/<slug>/transcripts/*` (refined text, summaries, provider JSON)
- `config/*speakers.yaml` (URL, title, channel, topics)
- `highlights/*.highlights.json` (timestamped quotable spans)
- `topics/**` (cross-source lessons)

There is **no MCP, no HTTP API, no DB index**. Writing sessions on howard-site cannot pull this corpus without opening this folder. Build a **thin read-only MCP over the filesystem** so agents can list, search, and fetch summaries/clips without re-running ASR.

Parent design: `howard-site/docs/writing-ops-mcp-bridge.md`.

## Work to do

### Transport

- **stdio MCP** (recommended v1). Python (FastMCP / official MCP SDK) fits this repo; Node is fine if preferred.
- Env: `REPO_ROOT` defaulting to this repo’s absolute path.
- Entry: document a single command, e.g. `uv run python -m mcp_server` or `uv run pipeline mcp` — pick one and put it in README.
- **Do not require** `OPENAI_API_KEY` / `ASSEMBLYAI_API_KEY` for **read** tools.

### Tools (v1)

| Tool | Input | Behavior | Prefer reading |
|------|--------|----------|----------------|
| `list_sources` | `limit?`, `query?` (optional filter on slug/title) | List project slugs with metadata: `slug`, `title`, `channel`, `url`, `upload_date?`, `has_summary` bool | `projects/*/config/*.speakers.yaml` `source:`; fallback `audio/*.source.json` |
| `get_summary` | `slug` (required) | Return markdown summary body + path. Prefer `*.summary.md`, then `*.summary.en.md`. Error clearly if missing. | `projects/<slug>/transcripts/` |
| `search_transcripts` | `query` (required), `limit?` (default 20) | Case-insensitive search over transcript text + summaries. Each hit: `slug`, `path`, `snippet` (±2 lines), optional `score`. | `rg` over `projects/**/transcripts/*.{txt,md}` (and optionally `topics/**/*.md`) |
| `get_transcript` | `slug`, `mode?` ∈ `summary` \| `full` \| `highlights` (default `summary`) | `summary` → same as get_summary; `full` → prefer `.refined.txt` then `.assemblyai.txt` then any `.txt` (cap length or paginate if huge — e.g. max ~80k chars with note); `highlights` → `highlights.json` | paths via `lib/paths.py` conventions |
| `get_clip` | `slug`, `start_s`, `end_s` | Filter segment JSON by time window; return text (+ speaker labels if present). | `*.refined.json` or `*.assemblyai.json` `segments[]` |
| `list_topics` | none or `prefix?` | List markdown files under `topics/` | `topics/**` |
| `get_topic` | `path` relative to `topics/` | Return topic markdown body | `topics/<path>` |

Optional nice-to-have (same PR if cheap):

| Tool | Notes |
|------|--------|
| `get_source_metadata` | Full parsed `speakers.yaml` `source` + pipeline fields for one slug |

### Path conventions (must respect)

- New layout: `projects/<slug>/{input,audio,transcripts,highlights,config}/`
- Legacy flat layout may still exist at repo root (`transcripts/`, etc.) — support via existing `lib/paths.py` if possible.
- Heavy media may live on external volume via symlink; **MCP only needs local text/json/md**, not mp4/wav.

### Response shape

Return JSON-serializable text content (MCP `content: [{ type: "text", text: "..." }]`). Prefer structured JSON strings for list/search; markdown OK for full summary bodies.

Example list item:

```json
{
  "slug": "2026-05-08-anthropic-memory-dreaming",
  "title": "…",
  "channel": "Claude (Anthropic)",
  "url": "https://www.youtube.com/watch?v=…",
  "has_summary": true
}
```

## Out of scope (v1)

- Triggering `pipeline fetch` / `transcribe` / `cut` via MCP (needs keys, ffmpeg, long jobs)
- Building SQLite FTS / embeddings (may come later; v1 = `rg` + files is enough)
- Uploading new voice notes through MCP
- HTTP/Railway hosting
- Editing transcripts or highlights
- Touching howard-site, find-your-niche, or x-watchlist code

## Implementation hints

1. Reuse `lib/paths.py`, `lib/srt.py`, `lib/config.py` for path + segment parsing where possible.
2. Keep the server **stateless** and read-only.
3. If a project has no summary yet, `get_summary` should fail with a helpful message (“run review in Claude / create summary”) rather than dumping a 2-hour raw transcript by default.
4. Document in **this repo’s** `README.md` or `docs/README.md`: how to run MCP + example client config for Grok/Claude.

## Transport + client config (for consumers)

After implement, consumers add something like:

```json
{
  "mcpServers": {
    "video-transcript": {
      "command": "uv",
      "args": ["run", "python", "-m", "mcp_server"],
      "cwd": "/Users/howard/orca/projects/mastering-social-media/repos/video-and-voice-transcript",
      "env": {
        "REPO_ROOT": "/Users/howard/orca/projects/mastering-social-media/repos/video-and-voice-transcript"
      }
    }
  }
}
```

Adjust `command`/`args` to match what you ship.

## Definition of done

1. MCP process starts with one documented command; `tools/list` shows the v1 tools.
2. Against a known rich project (if present), e.g. `2026-05-08-anthropic-memory-dreaming`:
   - `list_sources` includes it (or documents empty corpus)
   - `get_summary` returns non-empty markdown
   - `search_transcripts` with a distinctive keyword from that summary returns a hit with correct `slug`
   - `get_clip` with a valid window returns segment text
3. No network required for read tools; no secrets in tool output.
4. README section “MCP for writing agents” exists in this repo.

## In-repo references (read first)

| Path | Why |
|------|-----|
| `README.md` | Pipeline overview |
| `docs/README.md` | Doc map |
| `CLAUDE.md` | Agent SOP for this repo |
| `lib/paths.py` | Layout / path resolution |
| `lib/srt.py` | Segment schema IO |
| `lib/config.py` | speakers.yaml schema |
| `pipeline.py` | CLI surface (do not require for MCP reads) |
| `projects/` | Live corpus |
| `topics/` | Cross-source knowledge |
| Example project | `projects/2026-05-08-anthropic-memory-dreaming/` |
| Archive wishlist | `_archive/2026-05-25-pre-channel-strategy/DISCUSSION.md` (search as desired feature) |

## Suggested commit message (if you commit)

```
feat(mcp): read-only stdio server for transcripts and topics
```

## Success for the writing agent

Howard says “我看了 Anthropic memory 那支” → writing agent calls `search_transcripts` / `get_summary` → thesis grounded in real quotes + timestamps → References include the YouTube URL from metadata — **no screenshot required**.
