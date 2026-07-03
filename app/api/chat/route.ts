import { buildSystemPrompt } from "@/lib/chat/persona";
import { checkAndCount, checkBurst, logChat } from "@/lib/chat/rate-limit";
import { notifyTelegram } from "@/lib/chat/notify";

// Vercel Hobby caps function duration at 60s; a slow gemini thinking pass
// plus one retry needs the full window.
export const maxDuration = 60;

// Public "chat with Howard" endpoint. Cost controls, in order:
// cheap model, capped output tokens, capped input length + history,
// per-email / per-IP / global daily limits (see lib/chat/rate-limit.ts).
const BASE_URL = process.env.CLAWROUTER_BASE_URL ?? "https://clawrouter.com";
const MODEL = process.env.CHAT_MODEL ?? "gemini-3.5-flash";
const LIMIT_EMAIL = Number(process.env.CHAT_LIMIT_EMAIL ?? 10);
const LIMIT_IP = Number(process.env.CHAT_LIMIT_IP ?? 30);
const LIMIT_GLOBAL = Number(process.env.CHAT_LIMIT_GLOBAL ?? 500);

const MAX_MSG_CHARS = 1000;
const MAX_HISTORY = 8; // turns sent upstream (excluding system prompt)
// Gemini/MiniMax burn hidden reasoning tokens inside max_tokens (~500 for
// gemini-3.5-flash), so this must be well above the visible-reply budget.
const MAX_OUTPUT_TOKENS = 2048;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Turn = { role: "user" | "assistant"; content: string };

function parseTurns(input: unknown): Turn[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const turns: Turn[] = [];
  for (const m of input) {
    const role = m?.role;
    const content = typeof m?.content === "string" ? m.content.trim() : "";
    if ((role !== "user" && role !== "assistant") || !content) return null;
    turns.push({ role, content: content.slice(0, MAX_MSG_CHARS) });
  }
  if (turns[turns.length - 1].role !== "user") return null;
  return turns.slice(-MAX_HISTORY);
}

export async function POST(request: Request) {
  const apiKey = process.env.CLAWROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Chat is not configured yet." }, { status: 503 });
  }

  // Same-origin only: browsers send Origin on fetch POSTs; curl-style scripts
  // that skip it (or spoof another site) get bounced before costing anything.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: { email?: unknown; messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "Please provide a valid email." }, { status: 400 });
  }
  const turns = parseTurns(body.messages);
  if (!turns) {
    return Response.json({ error: "Invalid messages." }, { status: 400 });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const [global, perIp, perEmail, burst] = await Promise.all([
    checkAndCount("global", LIMIT_GLOBAL),
    checkAndCount(`ip:${ip}`, LIMIT_IP),
    checkAndCount(`email:${email}`, LIMIT_EMAIL),
    checkBurst(`ip:${ip}`, 5, 60), // max 5 requests/min per IP — humans never hit this
  ]);
  if (!burst.ok) {
    return Response.json({ error: "慢一點 — Too fast. Wait a minute and try again." }, { status: 429 });
  }
  if (!global.ok) {
    return Response.json(
      { error: "今天的整體額度用完了，明天再來 — 或直接寄信給 Howard。/ The chat has hit today's overall capacity. Come back tomorrow, or just email Howard directly." },
      { status: 429 },
    );
  }
  if (!perEmail.ok || !perIp.ok) {
    return Response.json(
      { error: "你今天的訊息用完了，明天再來 — 真人 Howard 也回 email 的。/ You've used today's messages. Come back tomorrow, or email Howard — the real one replies too.", remaining: 0 },
      { status: 429 },
    );
  }

  // ClawRouter flakes occasionally — one retry absorbs most transient failures.
  // Safe to retry because nothing has been streamed to the client yet.
  let upstream: Response | null = null;
  for (let attempt = 0; attempt < 2 && !upstream?.ok; attempt++) {
    try {
      upstream = await fetch(`${BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: buildSystemPrompt() }, ...turns],
          max_tokens: MAX_OUTPUT_TOKENS,
          temperature: 0.7,
          stream: true,
        }),
        signal: AbortSignal.timeout(50_000),
      });
      if (!upstream.ok) {
        console.error(`[chat] upstream ${upstream.status} (attempt ${attempt + 1}):`, (await upstream.text()).slice(0, 500));
      }
    } catch (err) {
      console.error(`[chat] upstream fetch failed (attempt ${attempt + 1}):`, err);
      upstream = null;
    }
  }
  if (!upstream?.ok || !upstream.body) {
    return Response.json(
      { error: "模型暫時連不上，等一下再試。/ The model is unreachable right now. Try again in a minute." },
      { status: 502 },
    );
  }

  // Proxy the upstream SSE as a plain text stream, hiding any inline
  // <think>…</think> reasoning some relayed models emit. `visible()` is the
  // reasoning-free view of everything received so far; only its growth is sent.
  const question = turns[turns.length - 1].content;
  const upstreamBody = upstream.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let raw = "";
  let sentChars = 0;
  let sseBuf = "";

  const visible = () => {
    let v = raw.replace(/<think>[\s\S]*?<\/think>/g, "");
    const open = v.lastIndexOf("<think>"); // unclosed block still being generated
    if (open !== -1) v = v.slice(0, open);
    return v;
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          sseBuf += decoder.decode(value, { stream: true });
          const lines = sseBuf.split("\n");
          sseBuf = lines.pop() ?? "";
          for (const line of lines) {
            const s = line.trim();
            if (!s.startsWith("data:")) continue;
            const payload = s.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
              if (typeof delta === "string") raw += delta;
            } catch {
              // ignore malformed SSE fragments
            }
          }
          const v = visible();
          if (v.length > sentChars) {
            controller.enqueue(encoder.encode(v.slice(sentChars)));
            sentChars = v.length;
          }
        }
      } catch (err) {
        console.error("[chat] stream read failed:", err);
      }
      const reply = visible().trim();
      const notify =
        perEmail.used === 1 && reply
          ? // First message today from this email → push the lead to Telegram.
            notifyTelegram(`💬 New chat lead\n${email} (${ip})\n\nQ: ${question.slice(0, 300)}\n\nA: ${reply.slice(0, 300)}`)
          : Promise.resolve();
      await Promise.all([logChat({ email, ip, question, reply: reply.slice(0, 500) }), notify]).catch(() => {});
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Remaining": String(perEmail.remaining),
    },
  });
}
