<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:howard-writing-rules -->
# Writing Workflow

When helping Howard with blog ideas, voice notes, bilingual drafts, `/write-blog`,
late-stage `/supplement` (`/補充`), or writing-memory updates, read
`content/writing-process.md` first. Then read `content/writing-voice.md` before
drafting or inserting prose.

- New post / thesis work → `/write-blog`
- ~80% draft + fuzzy add-on idea → `/supplement` or `/補充`
- North star: preserve spoken intent under pressure; do not polish into AI essay EN
  (kills X distribution). Required gates: RAW KEEP, STT SUSPECTS, CN GATE,
  EN pressure+anti-AI, X CUTS — see process Anti-machine gates.
- Chat writing UX: optional local `posts/<year>/<slug>.board.html` visual spine
  (template: `content/writing-board-template.html`). Say 看板 / board to request.

Treat Howard's current raw conversation as primary source material. Published posts are
calibration, not stronger authority than the current raw wording.
<!-- END:howard-writing-rules -->

<!-- BEGIN:howard-site-facts -->
# Key facts

- Public domain is **howard-peng.xyz**, NOT howardpeng.com (post frontmatter
  `source_url` is stale — do not copy it into promo materials, videos, or
  links). See `docs/context/site-domain.md` for details.
<!-- END:howard-site-facts -->

<!-- BEGIN:howard-memory -->
# Situational memory (not published prose)

For who Howard is *right now*, product walls, dogfood decisions, and Gita-style
agent onboarding, read `docs/context/howard-memory.md` **if the file exists
locally**.

- **Private:** gitignored. Not on GitHub. Not part of the public site bundle.
  Mini / second machine: rsync or copy the file; do not commit it.
- **Do** use it for strategy / onboarding / product context / raw material when
  curating what might later feed `/ask`.
- **Do not** treat it as writing-voice or paste its "撞牆" framing into every post.
  Prose still follows `content/writing-voice.md` + current raw conversation.
- **Do not** copy it wholesale into `content/persona/` — that folder is the
  curated public chat corpus for https://howard-peng.xyz/ask. Only ship facts
  Howard has explicitly approved for the public agent.
<!-- END:howard-memory -->

<!-- BEGIN:local-skill-mirrors -->
# Local skill mirrors

The tracked source of truth is `.claude/skills/`. `.grok/` and `.codex/` are
gitignored host mirrors; use relative symlinks only. After cloning, recreate them:

```sh
mkdir -p .grok/skills .codex/skills
ln -sfn ../../.claude/skills/write-blog .grok/skills/write-blog
ln -sfn ../../.claude/skills/supplement .grok/skills/supplement
ln -sfn ../../.claude/skills/write-blog .codex/skills/write-blog
ln -sfn ../../.claude/skills/supplement .codex/skills/supplement
```

`docs/context/howard-memory.md` is private and local, not part of the public
`/ask` corpus. Public `/ask` material lives in `content/persona/`.
<!-- END:local-skill-mirrors -->
