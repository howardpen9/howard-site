# Typefully MCP — Due Diligence for Writing & Ops

> **Type:** research / DD (not an implementation plan)  
> **Date:** 2026-07-10  
> **Audience:** Howard + coding/writing agents on howard-site  
> **Status of integration:** Grok user config has `typefully` HTTP MCP registered and smoke-tested (25 tools; analytics + schedule research done on `@0xHoward_Peng`).  
> **Related:** [writing-ops-mcp-bridge.md](./writing-ops-mcp-bridge.md)

---

## 1. Executive summary

**Typefully MCP is a distribution & social-queue layer, not a long-form writing layer.**

| Question | Answer |
|----------|--------|
| Can it help **write blog MDX** on howard-site? | **Indirect only.** It does not draft essays, manage `posts/*.mdx`, or hold thesis/voice memory. |
| Can it help **turn a blog into X (and other platforms)**? | **Yes — primary value.** Draft threads, schedule, media, queue, multi-platform. |
| Can it help **ops after publish**? | **Partially.** Strong on *your* queue/analytics/schedule; weak on *who else to engage* (that stays FYN / x-watchlist). |
| Should howard-site “become Typefully”? | **No.** Keep blog SoT in this repo; Typefully is the **publish rail** after (or beside) long-form. |

**One-line positioning in the stack:**

```
Source MCPs (video / x-watchlist / fyn social-db)
        →  howard-site write-blog (thesis, MDX, voice)
        →  Typefully MCP (thread / schedule / multi-platform / self-analytics)
        →  fyn recommend_interaction_targets (who to reply/QT)
```

---

## 2. What Typefully ships (product facts)

Official surfaces:

- MCP server: Streamable HTTP at `https://mcp.typefully.com/mcp`  
- Auth: **API key in URL or Bearer** — **not OAuth**  
- Docs: [Typefully MCP Server](https://support.typefully.com/en/articles/13128440-typefully-mcp-server)  
- Agent narrative: [typefully.com/ai-agents](https://typefully.com/ai-agents)  
- Optional local path: [typefully/agent-skills](https://github.com/typefully/agent-skills) (skill + script; alternative when MCP auth is awkward)

**What agents can do (vendor claim, verified against live tool list):**

- Create / edit / delete drafts and threads  
- Schedule or publish across **X, LinkedIn, Threads, Bluesky, Mastodon**  
- Queue schedule rules + calendar slots  
- Media upload (presigned S3) + processing status  
- Tags for organization  
- Draft **comment threads** (editor collab / review markers — not X reply inbox)  
- Analytics: post metrics + follower series (currently **X-focused** in analytics tools)  
- LinkedIn org mention resolver  

**What it does *not* do (important for expectations):**

| Missing | Implication |
|---------|-------------|
| No “best time to post” tool | Must derive from `list_social_set_analytics_posts` (we already did this ad hoc) |
| No competitor / cohort discovery | Still need x-watchlist + fyn social-db |
| No long-form blog CMS | howard-site stays SoT for essays |
| No reply-to-random-timeline automation | Not a growth bot; it’s *your* publishing console via API |
| Analytics “X only” (today) | LinkedIn/etc. publish yes; performance analytics for non-X is limited |
| Comment tools ≠ X mentions inbox | Typefully **draft comments** = collab review on a draft, not public conversation management |

---

## 3. Live tool map (25 tools)

Grouped for agents. Prefix in Grok: `typefully__…` (server name + tool).

### 3.1 Identity & accounts (read)

| Tool | Role |
|------|------|
| `typefully_get_me` | Who owns this API key |
| `typefully_list_social_sets` | Accounts (e.g. `0xHoward_Peng`, product brands) |
| `typefully_get_social_set_details` | Platforms linked to a set |

Howard’s sets observed in testing: `0xHoward_Peng`, `howard_pen9_1`, `PredictMeme`, `makereel_xyz`, `MemePost_xyz`. **Primary for personal brand essays: `0xHoward_Peng` (id `188358`).**

### 3.2 Draft lifecycle (write-heavy)

| Tool | Role | Risk |
|------|------|------|
| `typefully_list_drafts` | Filter by `draft` / `scheduled` / `published` / … | Read |
| `typefully_get_draft` | Full multi-platform body + schedule | Read |
| `typefully_create_draft` | Create; can schedule or publish immediately | Write / publish |
| `typefully_edit_draft` | Partial update | Write |
| `typefully_delete_draft` | Delete | Destructive |

`create_draft` respects account settings (Auto-RT, Auto-Plug, **Natural Posting Time** when enabled).

### 3.3 Media

| Tool | Role |
|------|------|
| `typefully_create_media_upload` | Presigned upload URL → put file → `media_id` |
| `typefully_get_media_status` | Poll until ready for draft attach |

Fits blog promo: re-use `public/posts/<slug>/fig-*.png` as thread images (agent uploads then attaches `media_ids`).

### 3.4 Queue & calendar

| Tool | Role |
|------|------|
| `typefully_get_queue_schedule` | Recurring queue rules |
| `typefully_queue_put_queue_schedule` | Replace rules (ADMIN) |
| `typefully_get_queue` | Slots + scheduled drafts in a date range |

### 3.5 Organization & collab

| Tool | Role |
|------|------|
| `typefully_list_tags` / `typefully_create_tag` | Tag taxonomy (e.g. `blog-promo`, `grok-lane`) |
| `typefully_list_comments` … `typefully_delete_thread` | In-editor comment threads on a draft (review workflow) |
| `typefully_linkedin_resolve_linkedin_organization_from_url` | LinkedIn company mention syntax |

### 3.6 Analytics (ops brain — self only)

| Tool | Role |
|------|------|
| `typefully_list_social_set_analytics_posts` | Posts + impressions/engagement in a window |
| `typefully_get_social_set_analytics_followers` | Daily follower series |

This is the lever for “when should *I* publish?” — not vendor magic, **your own history**.

---

## 4. How it helps **writing** (essay / blog)

Typefully does **not** replace `/write-blog`. It assists the **compression & packaging** of a finished (or near-finished) thesis into social units.

### 4.1 High-fit writing assists

| Assist | How MCP is used | Value |
|--------|-----------------|-------|
| **Thread from essay** | After MDX draft: agent compresses thesis → `create_draft` as X thread (multi-`posts[]`) | Converts long-form into platform-native shape without leaving chat |
| **Hook A/B as drafts** | Multiple drafts, tags `hook-a` / `hook-b`, keep blog body fixed | Isolate distribution experiments from essay SoT |
| **Cross-post packaging** | Same draft body variants for X vs LinkedIn in one `create_draft` | One thesis, multiple channels |
| **Figure reuse** | Upload blog figures via media tools → attach to thread | Visual continuity essay ↔ X |
| **Editorial review on the thread** | `create_comment` on draft selected text | Second agent / future-you leaves notes *on the social cut*, not on MDX |
| **Link-first discipline** | Draft always includes canonical `howard-peng.xyz/...` | Protects GEO / “write yourself into the index” thesis of posts like *訊息能查,人查不了* |

### 4.2 Low-fit / do not force

| Temptation | Why skip |
|------------|----------|
| Draft the **essay itself** inside Typefully | Wrong medium; loses MDX, bilingual files, fig paths, voice rules |
| Use Typefully analytics to **choose blog thesis** | Analytics reflect past audience (legacy mix + current lane); thesis should stay conversation-driven (`writing-process.md`) |
| Auto-publish unfinished thinking | Publish tools make accidents easy; default **draft-only** until Howard says schedule |

### 4.3 Recommended writing loop (agent)

```
1. write-blog / supplement → posts/YYYY/slug.mdx (+ .en.mdx)
2. (optional) fyn / x-watchlist for sources & angle check
3. Typefully: create_draft(status=draft) — thread + link + media
4. Howard reviews in Typefully UI or via get_draft
5. Schedule via create/edit_draft or queue — do not default to immediate publish
```

---

## 5. How it helps **ops** (growth / cadence / measurement)

### 5.1 High-fit ops assists

| Assist | Tools | Notes |
|--------|-------|-------|
| **Best time for *this* account** | analytics posts → agent aggregates hour/weekday | Done once for harder-to-verify article; reusable pattern |
| **Cadence visibility** | `get_queue` + `list_drafts(status=scheduled)` | Avoid double-booking or empty weeks |
| **Follower trend** | `get_social_set_analytics_followers` | Lightweight health; not a north star alone |
| **Post-mortem of a promo** | analytics for the published draft window | Did the thread move impressions / profile clicks / link clicks? |
| **Queue rules** | get/put queue schedule | Institutionalize “Tue/Wed + weekend US morning” style rules |
| **Multi-brand ops** | list social sets → post from product accounts | e.g. tool launch on `makereel_xyz` vs personal essay on `0xHoward_Peng` |
| **Tag taxonomy** | create/list tags | `blog-promo`, `reply-bait`, `product`, `zh-only` |

### 5.2 Ops Typefully **cannot** replace

| Need | Better system |
|------|----------------|
| Who in xAI / ICP to reply to | **fyn** `recommend_interaction_targets`, **x-watchlist** |
| What the cohort is debating this week | **x-watchlist** `discussion_digest` |
| Source video / transcript quotes | **video-and-voice-transcript** (future MCP) |
| Long-form SEO / `llms.txt` / site | **howard-site** |

Ops north star in existing docs (fyn operator-agent, x-watchlist content-ops) remains **amplification by ICP + borrowed reach**, not “Typefully scheduled volume.” Typefully is the **execution calendar**, not the strategy brain.

### 5.3 Concrete ops playbooks (agent-ready)

**A. Blog ship day**

1. Analytics → confirm schedule window (or reuse last DD: e.g. Sat 19:00 TPE / 07:00 ET).  
2. `create_draft` thread + canonical URL + 1–2 figures.  
3. `list_drafts` / `get_queue` → no clash.  
4. Schedule.  
5. Call fyn social-db for 3–5 interaction targets.  
6. After 24–48h: pull analytics for that post_id window; note link_clicks.

**B. Weekly drip from one essay**

- One long-form → 3–5 short drafts over 7–14 days (quotes, fig callouts, contrarian one-liners).  
- Tag all `from:<slug>`.  
- Queue, don’t dump same day.

**C. Multi-account**

- Personal thesis → `0xHoward_Peng`.  
- Product proof → product social set.  
- Never cross-contaminate TON-legacy product spam into AI-builder personal lane (operator-agent amphibious rule).

---

## 6. Fit vs other MCPs (stack clarity)

| Layer | Owner | Typefully role |
|-------|-------|----------------|
| Source material | video / x-watchlist | None |
| Niche / who to engage | fyn social-db | None (complement after publish) |
| Long-form SoT | howard-site | None |
| **Packaging & schedule** | **Typefully** | **Core** |
| Self performance history | Typefully analytics | Core for timing & retro |
| Cohort intelligence | x-watchlist | Parallel, not overlapping |

**Boundary rule for agents:**  
If the task is “what should the essay say?” → writing-process + voice + source MCPs.  
If the task is “how do we put this on X this week?” → Typefully.  
If the task is “who do we talk to after it ships?” → fyn / x-watchlist.

---

## 7. Risks & constraints

| Risk | Mitigation |
|------|------------|
| **API key in chat / config.toml** | Rotate keys; prefer `Bearer ${TYPEFULLY_API_KEY}` or env expansion; never commit keys to howard-site git |
| **Accidental publish** | Agent default: create **draft only**; schedule only when Howard explicitly confirms time |
| **Wrong social set** | Always `list_social_sets` first; pin `0xHoward_Peng` = 188358 for personal essays |
| **Legacy audience skew** | Analytics best-times may optimize for old TON/Telegram followers; weight **recent 30d** + ICP engagement, not raw 90d impressions alone |
| **Scope creep of howard-site** | Site remains blog/product site; Typefully stays external SaaS — document here, don’t rebuild a scheduler in Next.js |
| **Destructive tools** | `delete_draft`, delete comment/thread — require explicit user confirmation |
| **Session load** | Grok may need new session / `/mcps` refresh after config change for tools to appear in `search_tool` |

---

## 8. DD verdict

| Dimension | Score (1–5) | Comment |
|-----------|-------------|---------|
| Writing-core (essay quality) | **2** | Packaging only |
| Writing-adjacent (distribution of writing) | **5** | Best-in-class MCP for this |
| Ops cadence / schedule | **5** | Queue + drafts + schedule |
| Ops intelligence (who/what externally) | **2** | Self-only analytics |
| Cost / complexity | **4** | Cheap HTTP MCP; key hygiene is the real cost |
| Strategic fit with GEO / “write into index” | **4** | Forces public, linkable, scheduled corpus |

**Recommendation:** Keep Typefully MCP **enabled for writing sessions** as the **publish & measure** companion to write-blog. Do **not** expand howard-site product scope to reimplement Typefully. Optionally later: a short skill section in write-blog (“when draft is ready, offer Typefully thread packaging”) — separate task.

---

## 9. Optional follow-ups (not in this DD)

1. Rotate API key; re-register MCP with env-based secret.  
2. One-shot skill snippet: “package current MDX as Typefully draft (draft-only).”  
3. Monthly automated retro: agent pulls 30d analytics → markdown note under `docs/` or fyn insights.  
4. Tag convention: `blog:<slug>`, `lane:grok-xai`, `lang:zh|en`.  
5. Wire “after schedule” handoff prompt that always calls fyn `recommend_interaction_targets` with thread text.

---

## 10. Appendix — Howard live smoke (2026-07-10)

- MCP doctor: 25 tools, handshake OK.  
- Primary set: `0xHoward_Peng` / id `188358`.  
- Analytics sample: 300 posts / 90d; strongest personal windows leaned **weekend** and **TPE 08 / 15 / 19**; **Friday weakest**.  
- Practical schedule used for *訊息能查,人查不了* promo research: **Sat 19:00 Asia/Taipei ≈ 07:00 America/New_York**.  
- No dedicated best-time endpoint; method = aggregate `typefully_list_social_set_analytics_posts`.

---

## 11. References

- Typefully MCP help: https://support.typefully.com/en/articles/13128440-typefully-mcp-server  
- Typefully AI agents hub: https://typefully.com/ai-agents  
- Agent skills repo: https://github.com/typefully/agent-skills  
- Typefully blog (generic best times on X): https://typefully.com/blog/best-time-to-post-on-twitter  
- Local stack map: [writing-ops-mcp-bridge.md](./writing-ops-mcp-bridge.md)  
- FYN social-db brief: [agent-briefs/find-your-niche-mcp.md](./agent-briefs/find-your-niche-mcp.md)
