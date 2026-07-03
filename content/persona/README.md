# Persona context for /chat

Drop Markdown files here (`resume.md`, `faq.md`, `hidden-context.md`, …) and they are
concatenated into the chat system prompt on the next deploy. `README.md` is skipped.

- **Everything here is effectively public** — anyone can extract it through the chat.
  Don't put phone numbers, addresses, or anything you wouldn't publish.
- Keep it lean: this text is sent with every single chat message, so size = cost.
  A few thousand words total is a good ceiling.
- PDFs are not read — drop raw PDFs into `src/` (gitignored) and ask Claude to
  convert them to Markdown here.
- Files must be committed to git, or the Vercel build won't include them.
