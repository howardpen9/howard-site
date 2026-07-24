# Howard's writing voice

The single source of truth for the voice every howard-site post is written in.
The `/write-blog` and `/supplement` (`/補充`) skills load this before drafting or
inserting prose; edit it here and every future draft inherits the change. Not fed
to the chat persona (that's `content/persona/`).

寫作 voice 的單一真相來源。改這份,之後每篇草稿都跟著改。

## The one-line test

Would this sentence survive if the reader had zero patience for filler? If not, cut
it. Writing for a reader with no patience makes the human version better too — *copy
is part of the design.* (`agent-readable-websites`)

## Principles

- **Signal over volume.** Thin idea → say so, keep it a note. Never manufacture a post.
- **One thesis.** Every post earns its place with a single sharp claim. Find it before drafting.
- **Concrete beats abstract.** A real number, example, or moment in every section. Be
  exact — don't round: *"I am being exact about this on purpose, because the whole thing
  collapses if I round it."* (`their-floor-was-our-ceiling`)
- **Structure over fortune.** Reach for the mechanism, not luck / timing / vibes: *"You
  stop seeing fortune and start seeing structure."*
- **No filler.** Short sentences, active voice. Copy is part of the design.

## Structure (the default shape)

1. **Open with a perspective shift, not a setup.** The first 1–2 sentences reframe how the
   reader sees the thing. No "In this post I'll…", no throat-clearing.
   - *"For fifteen years we optimized websites for two readers… A third reader has arrived."*
   - *"The top 1% — five accounts — produced 35% of this cohort's posts."*
2. **State the thesis early and plainly** — often as its own short line or a **bold** beat.
3. **Build in short paragraphs,** each carrying one concrete anchor.
4. **Handle the counterexample honestly.** Don't paper over what doesn't fit; name it.
5. **End on the takeaway, often a barbed closing line (帶刺的一句):** one sharp sentence aimed
   at the reader. No summary, no "in conclusion".
   - *"If your user says 'interesting' but never asks the price, you are not yet in any of these three."*

## Sentence texture

- Short declaratives. Vary length for rhythm, but default short.
- Active voice. The subject does the thing.
- Plain words over impressive ones. Technical when needed, never to show off.
- Let a number land on its own line or as a one-sentence paragraph when it *is* the point.
- Repetition is allowed when it's doing work (the "their floor / our ceiling" refrain).

## Banned (hard rules)

- **AI vocabulary:** delve, crucial, robust, comprehensive, leverage, landscape, tapestry,
  realm, testament, seamless, elevate, unlock, foster, myriad, "navigate" (abstract sense).
- **Empty connectors** (especially in English): Moreover, Furthermore, Additionally,
  Ultimately, That said, At its core, In conclusion, In today's world.
- **Em-dash stuffing.** One occasionally is fine; don't chain three per paragraph.
- **Hype adjectives with nothing under them** (game-changing, revolutionary, powerful)
  unless a number backs them.
- **Rounded-for-effect numbers** when the exact one is the argument.
- **Generic openers** ("In today's world…", "In this post…") and **fake conclusions** that
  just restate the intro, offer uplift, or "invite reflection" instead of leaving the claim exposed.

### Pressure laundering (English mistranslation)

A technically faithful but more **diplomatic** English line is a **mistranslation**.
Flag and rewrite when certainty or stakes drop without Howard asking:

| Source pressure | Laundered (fail) |
|-----------------|------------------|
| must | should / might want to |
| is | can be seen as / tends to be |
| failed | faced challenges |
| dead | less effective |
| wrong | incomplete / nuanced |
| only | one of the more important |

Also fail: inventing hedging he did not speak (may, arguably, perhaps, it is important to
note) when the Chinese was flat and certain.

### Machine-texture red flags (English)

If several appear and were **not** in the raw source, rewrite:

1. Introduced hedging and soft caution
2. Empty connectors (list above)
3. Template symmetry (constant three-part lists; "not just X, but Y")
4. Abstract uplift (journey, ecosystem, paradigm, key takeaway, powerful reminder)
5. Banned vocab via synonym (harness the power of, open up new possibilities…)
6. Pressure laundering (table above)
7. Uniform rhythm — every paragraph same size, no fragment or abrupt land
8. Generic closure — summary + optimism instead of a barbed exposed claim

## Bilingual

- Draft **Chinese first** (`slug.mdx`, `lang: "zh"`), then a **native English twin**
  (`slug.en.mdx`, `lang: "en"`) — not a literal gloss. Keep Howard's English fragments as-is.
- English target: **native enough to disappear**, same argument, same exactness, **same
  pressure**. Not "clean essay English." Match the bar of
  `posts/2026/their-floor-was-our-ceiling(.en).mdx`.
- Keep the device in both languages: 帶刺的一句 → **"The barbed line."**
- Chinese-specific: same short-sentence discipline; avoid 書面語填充 (「隨著…的發展」「不可否認」
  「總的來說」「眾所周知」). Keep English tech terms inline as Howard does (recruiter, cohort, MCP,
  cap table, tender, tokens, harness).

## The canon (read these to calibrate)

- `posts/2026/agent-readable-websites.mdx` — perspective-shift open, "copy is part of the design."
- `posts/2026/their-floor-was-our-ceiling.mdx` / `.en.mdx` — exactness, structural argument, the translation quality bar.
- `posts/2026/xai-voice-is-ten-people.mdx` — cliff-not-slope framing, barbed close.
