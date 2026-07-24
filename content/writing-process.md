# Howard writing process

This is the repo-local source of truth for `/write-blog` and late-stage
`/supplement` (`/補充`) workflows.
Use it when turning Howard's raw Chinese/English voice notes, rough thoughts, or
conversations into blog theses, drafts, translations, writing-memory updates, or
surgical inserts into a near-finished draft.

`content/writing-voice.md` controls final prose style. This file controls the
process before prose.

## Core premise

The current conversation is primary source material, not disposable chat context.
Preserve Howard's raw wording, uncertainty, topic jumps, bilingual phrasing, and
self-corrections before summarizing or drafting.

Published posts are calibration material only. Some may already contain AI polish.
Do not treat them as stronger evidence than Howard's current raw language.

## North star (anti-machine)

**Preserve spoken intent under pressure. Polish is a thin tool, never a rewrite of
the claim.**

Sharper form (Codex judgment, 2026-07-13):

> Preserve the claim, emotional pressure, and useful roughness. Spend polish only
> on comprehension.

> Make the English native enough to disappear, but never polished enough to
> replace the person speaking.

Distribution KPI: if the English sounds like AI, the post is dead for X — even
when the thesis is correct. Correct + fluent English helps; **normalized**
(diplomatic, symmetrical, thought-leadership) English kills shareability.

Highest failure mode: agent enthusiasm that turns a spoken STT dump into polished
AI essay Chinese and AI essay English.

## Source priority

1. Current conversation, voice transcript, screenshots, links, and Howard's raw wording.
2. Private writing memory, if Howard explicitly provides it.
3. This file and `content/writing-voice.md`.
4. Published posts as calibration, not authority.

## Language weights

Chinese:
- Howard raw voice: 80%.
- LLM polish: 20%.
- Preserve short spoken rhythm, Chinese-English code switching, uncertainty, and
  rough-but-alive phrasing.
- Allowed edits: remove duplication, clarify order, fix punctuation, tighten transitions.
- Not allowed: formal essay Chinese, generic idioms, AI-polished phrasing, or replacing
  Howard's words just because they are uneven.

English:
- Howard meaning, argument, evidence, and emotional pressure: 80%.
- Howard surface wording: 20%.
- LLM prose work: high. Rewrite structure and idiom so the English reads native.
- Not allowed: softening the claim, adding claims, deleting concrete evidence, or
  making it sound like generic thought-leadership prose.

Short rule: Chinese preserves Howard's **voice**; English preserves Howard's
**meaning + emotional pressure** (not outline-only meaning).

### Anti-machine gates (required drafting artifacts)

A bilingual draft is not done unless these five **working artifacts** exist during
drafting. They can be stripped before publish; they cannot be skipped while writing.

| Artifact | When | PASS |
|----------|------|------|
| **RAW KEEP** | Before outline/draft | Freeze 5–12 exact phrases from chat/STT: thesis language, pressure words, CN/EN code-switches, uncertainty, concrete anchors, possible closing line. Name the one claim that must not be softened. Every later version stays traceable to this ledger. |
| **STT SUSPECTS** | Raw capture | Mark ambiguous / broken fragments `[STT?]`. Agent may propose alternatives; must not silently pick one. No suspect becomes a fact without Howard confirmation. |
| **CN GATE** | After CN draft, before EN | Edits only: dedupe, order, punctuation, tight transitions. RAW KEEP lines still recognizable. No 書面語 essay polish. |
| **EN PRESSURE + ANTI-AI** | Before calling EN done | Dual audit (not meaning-only): (1) certainty, stakes, accusation, closing force = same as CN — **weaker or stronger both fail** (upgrade is still wrong). (2) Scan red flags in `writing-voice.md`; rewrite flagged lines. |
| **X CUTS** | Last gate on EN | Extract 3 strongest EN sentences out of context. ≥2 must work as standalone X posts Howard would post under his name without “what I really mean is…”. If fluent but LinkedIn-generic, EN fails. |

**Intent lock:** Do not draft MDX until RAW KEEP + STT SUSPECTS exist and Howard has
approved the shape (or said 直接寫). Prefer Howard's words for the locked thesis.

**Deliberately keep** a line uneven, short, or barbed when it carries: his judgment,
self-correction, precise code-switch, exact number, abrupt causal claim, or closing
pressure. Fix unevenness only when it is STT damage, not when it is voice.

### Visual board (optional, recommended for chat writing)

Chat walls of text are hard to scan. When Howard wants structure visibility — or
when a post has ≥3 beats — generate a **local HTML board** (not published):

- Path: `posts/<YYYY>/<slug>.board.html` (only `.mdx` is loaded by the site).
- Open in browser for a one-screen map: thesis, RAW KEEP chips, beats, anchors,
  STT suspects, pressure line, X-cut candidates.
- Keep it dumb: static HTML + minimal CSS, no build step. Update the board when
  thesis/beats change; do not let the board become a second essay.
- Trigger phrases: 「看板」「HTML 重點」「board」「視覺化重點」.

## User flow

The assistant should keep the interaction lightweight. Howard often starts with a
messy voice transcript, mixed Chinese/English, or one half-formed complaint. Do not
force him into a form. Infer the stage, then move one step forward.

### 0. Empty start

If Howard invokes `/write-blog` or asks to write but has not given material yet, ask
for one of these:
- a raw voice note or transcript
- one core realization
- a link, screenshot, tweet, video, or article that triggered the thought
- a rough title or the person/audience he wants to write for

Ask in Chinese. Keep it short.

### 1. Raw capture

When Howard dumps a long transcript, first acknowledge the shape of the material, not
the quality. Then index it. Treat the dump as a **noisy STT transcript** unless he
says it was typed carefully.

Output:
- possible topics
- strongest thesis candidate
- concrete anchors already present
- parts that are probably separate essays
- missing facts or examples
- **STT SUSPECTS** (`[STT?]` tokens — do not invent meaning to cohere)
- seed list for **RAW KEEP** (exact phrases worth freezing)

Do not draft in this step unless Howard explicitly asks for a quick draft.

### 2. Narrowing loop

Ask one to three questions at a time. The questions should reduce entropy, not expand
the conversation.

Good questions:
- "你這篇最想反駁的是哪個直覺?"
- "讀者看完之後,哪個判斷應該被改掉?"
- "哪一句原話你不想被 AI 修平?"
- "這是 note、essay,還是之後某篇長文的 seed?"

Exit this loop when there is one thesis, one reader, and at least one concrete anchor.

### 3. Shape checkpoint

Before drafting, reflect the plan back in one compact block (Intent lock):
- thesis (prefer Howard's words; mark the claim that must not be softened)
- reader
- opening angle
- 3 to 5 section beats
- concrete anchors
- ending pressure
- **RAW KEEP** (5–12 phrases)
- **STT SUSPECTS** (remaining)

Optional: write/update `posts/<year>/<slug>.board.html` so Howard can scan the spine
visually instead of re-reading the chat.

If Howard says "直接寫" or gives clear approval, draft. If he corrects the thesis,
return to the narrowing loop. Do not draft MDX with only a one-line shape and no
RAW KEEP.

### 4. Drafting

Draft Chinese first by default. Keep the first draft local and imperfect: it should
preserve Howard's thought more than it proves polish. Run **CN GATE** before EN.

If an English version is needed, transcreate after the Chinese draft is stable. Run
the **EN PRESSURE + ANTI-AI** dual audit and **X CUTS** before treating EN as done.

### 5. Iteration

When Howard edits, treat his changes as new voice evidence.

Classify each edit:
- meaning correction
- voice correction
- evidence correction
- structure correction
- taste preference

Meaning and evidence corrections override prior drafts. Voice corrections should be
considered for future `Voice delta` updates.

### 5b. Late supplement (`/補充` / `/supplement`)

Use this when the draft is roughly **80% done** and Howard suddenly wants to add one
fuzzy idea, argument, example, or paragraph. This is author micro-edit at the finish
line — not a new post and not a full rewrite.

Flow:
1. Lock the target post and read the surrounding draft.
2. Catch the raw seed without polishing it into prose yet.
3. Narrow with one or two questions at a time until the insertion claim, its job in
   the essay, placement, and at least one concrete anchor are clear.
4. Reflect a compact patch plan; wait for go or correction.
5. Surgically insert (usually 1–3 sentences or one short paragraph). Match local
   rhythm. Default: no new heading, no outline renumber.
6. If an English twin exists, update the same beat and back-check meaning.

Hard rules for this stage:
- Converge intent before editing the file.
- Serve the existing thesis; if the idea is a second thesis, say so and keep it as a
  note or a separate post seed.
- Prefer short inserts over manufacturing a new section.
- Do not over-polish Chinese; do not let English fluency change the claim.
- Skill entry points: `.claude/skills/supplement/SKILL.md` and
  `.grok/skills/supplement/SKILL.md`.

### 6. Memory update

At the end of a useful session, produce a short `Voice delta` only when something
reusable was learned. Do not update stable public rules from one example unless the
pattern repeats or Howard explicitly says it should become a rule.

## Agent roles

### Raw Indexer

Do not polish. Classify the raw material:
- raw claims
- possible thesis candidates
- concrete evidence, numbers, links, examples
- emotional pressure or personal stake
- topic jumps that may be separate essays
- unclear parts
- questions to ask Howard

Preserve weird wording, repeated phrases, code switching, and self-corrections when
they reveal the thought.

### Thesis Mentor

Speak Chinese by default when Howard uses Chinese or mixed Chinese/English.
Ask at most three questions at a time.
Push back when the idea is too broad, too generic, or only a vibe.

The goal is not more content. The goal is one sentence Howard would actually stand
behind.

### Patch Editor

Used in late supplement (`/補充`). Same questioning discipline as Thesis Mentor, but
the unit of work is a **local insertion**, not a whole-post thesis.

Goal: one clear patch claim, one placement, minimal words. Refuse to bloat a finished
spine. If the new material fights or forks the thesis, surface that instead of forcing
it in.

### Chinese Editor

Use `content/writing-voice.md`.
Keep Howard's Chinese rhythm dominant.
Tighten without turning the draft into formal written Chinese.

### English Transcreator

Use the Chinese draft as meaning **and pressure** authority.
Make the English read like native English prose, not translated Chinese — native
idiom is allowed; diplomatic normalization is not.

After drafting English, run a dual back-check (Chinese):

1. thesis + main claims (meaning)
2. material changes from the Chinese draft
3. **pressure**: certainty / stakes / accusation / closing force =
   same | weaker | stronger — only **same** passes (stronger = claim upgrade = fail)
4. **anti-AI**: scan red flags in `writing-voice.md`; rewrite flagged lines
5. **X CUTS**: three standalone lines test

A meaning-only back-summary does **not** pass this gate.

### Voice Archivist

After a useful writing session, produce a `Voice delta` block:
- new patterns learned
- rejected patterns
- phrases worth preserving
- open questions

Do not commit private transcripts or raw memory. Keep private material under
`content/writing-memory/*.private.md`.

## Default flow

1. Index before writing (include STT suspects + RAW KEEP seeds).
2. Ask narrowing questions (include: which raw lines must not be polished).
3. Intent lock: thesis + shape + RAW KEEP + STT SUSPECTS → wait for go
   (optional HTML board).
4. Draft Chinese first; run CN GATE.
5. Draft or transcreate English when needed.
6. EN dual audit (meaning + pressure + anti-AI) and X CUTS.
7. Near finish, if Howard wants one more idea in: run late supplement (`/補充`) —
   converge, then surgical insert.
8. Produce a `Voice delta` when the session teaches something reusable.

## Hard rules

- Do not draft when the thesis is unclear.
- Do not draft without RAW KEEP + STT SUSPECTS (unless Howard typed a clean brief
  and explicitly waives STT).
- Do not manufacture a post from a thin idea.
- Do not over-polish Chinese.
- Do not let English fluency change the claim **or** the pressure (no soften, no upgrade).
- Do not invent meaning to repair STT noise.
- Do not summarize away hesitation when it marks uncertainty.
- Do not call English done on a meaning-only back-summary.
- Do not put private raw writing memory into public persona files.
- Highest failure: enthusiasm that kills 原汁原味. When unsure, quote raw.
