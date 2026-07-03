"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSiteLang } from "./lang-store";

type Turn = { role: "user" | "assistant"; content: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STORAGE_KEY = "chat-email";
const STORAGE_EVENT = "chat-email-change";

// localStorage-backed saved email, hydration-safe: the server snapshot is
// null (gate shown), the client snapshot re-syncs right after hydration.
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

function useSavedEmail(): [string | null, (v: string | null) => void] {
  const saved = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(STORAGE_KEY),
    () => null,
  );
  const set = (v: string | null) => {
    if (v) localStorage.setItem(STORAGE_KEY, v);
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  };
  return [saved && EMAIL_RE.test(saved) ? saved : null, set];
}

const GREETING_EN: Turn = {
  role: "assistant",
  content:
    "Hi, I'm Howard — well, an AI version of me, grounded in my writing and resume. I'm a protocol engineer & mechanism designer: prediction markets, pay-per-call AI infra, and how incentives keep agents honest. Ask me anything about my work, my thinking, or whether I'm the right person for your team — the questions below are good places to start. 中文也可以。",
};

const GREETING_ZH: Turn = {
  role: "assistant",
  content:
    "嗨，我是 Howard——或者說，他的 AI 版本，以他的文章與履歷為基礎。我是協議工程師與機制設計師，專注於預測市場、按次計費的 AI 基礎設施，以及如何用激勵機制讓 agent 保持誠實。歡迎問我任何關於我的工作、思考方式，或者我是否是你在找的人——下面幾個問題是不錯的起點。",
};

const SUGGESTIONS_EN = [
  "What's your framework for evaluating projects and investments?",
  "What ideas or questions are you most excited about right now?",
  "Walk me through your background in 60 seconds.",
  "你最近在 build 什麼？為什麼是這個題目？",
];

const SUGGESTIONS_ZH = [
  "你評估項目和投資機會的框架是什麼？",
  "你最近最興奮的想法或問題是什麼？",
  "用 60 秒介紹一下你自己。",
  "你最近在 build 什麼？為什麼是這個題目？",
];

export function Chat() {
  const lang = useSiteLang();
  const isZh = lang === "zh";

  const [savedEmail, setSavedEmail] = useSavedEmail();
  const [emailInput, setEmailInput] = useState("");
  const [messages, setMessages] = useState<Turn[]>([GREETING_EN]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  function enter(e: React.FormEvent) {
    e.preventDefault();
    const value = emailInput.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setError(isZh ? "這不像是有效的 email。" : "That doesn't look like an email.");
      return;
    }
    setError(null);
    setSavedEmail(value);
  }

  async function sendMessage(question: string) {
    if (!question || loading || !savedEmail) return;

    const next: Turn[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Skip the canned greeting; the server rebuilds its own system prompt.
        body: JSON.stringify({ email: savedEmail, messages: next.slice(1) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? (isZh ? "發生錯誤。" : "Something went wrong."));
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch {
      setError(isZh ? "網路錯誤，請再試一次。" : "Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input.trim());
  }

  if (!savedEmail) {
    return (
      <form onSubmit={enter} className="mt-8 rounded-xl border bg-card p-5">
        <p className="text-sm leading-relaxed text-muted">
          {isZh
            ? "留下 email 才能開始——這是限流憑證（每天 10 則），也讓真人 Howard 可以後續跟進。"
            : "Leave an email to start — it’s the rate-limit key (10 messages a day), and how the real Howard can follow up if you ask something interesting."}
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            required
          />
          <button
            type="submit"
            className="shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-card hover:text-accent"
          >
            {isZh ? "開始" : "Start"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    );
  }

  const suggestions = isZh ? SUGGESTIONS_ZH : SUGGESTIONS_EN;
  // For the initial greeting (messages[0]), render the localized version so it
  // switches live when the user toggles EN/中 before sending any message.
  const greetingContent = isZh ? GREETING_ZH.content : GREETING_EN.content;

  return (
    <div className="mt-8">
      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-xl rounded-br-sm border bg-card px-4 py-2.5 text-sm leading-relaxed"
                  : "max-w-[85%] py-1 text-sm leading-relaxed whitespace-pre-wrap"
              }
            >
              {i === 0 && m.role === "assistant" ? greetingContent : m.content}
            </div>
          </div>
        ))}
        {loading && <p className="animate-pulse font-mono text-xs text-faint">thinking…</p>}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && !loading && (
        <div className="mt-5 flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="rounded-full border px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <form onSubmit={send} className="mt-6 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder={
            isZh ? "問問我的工作、背景、或合作可能……" : "Ask about my work, background, availability…"
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:text-accent disabled:opacity-40"
        >
          {isZh ? "傳送" : "Send"}
        </button>
      </form>

      <div className="mt-3 flex items-baseline justify-between font-mono text-xs text-faint">
        <span>
          {savedEmail}{" "}
          <button
            type="button"
            className="underline decoration-dotted hover:text-foreground"
            onClick={() => {
              setSavedEmail(null);
              setRemaining(null);
              setMessages([GREETING_EN]);
            }}
          >
            {isZh ? "更換" : "change"}
          </button>
        </span>
        {remaining !== null && (
          <span>
            {isZh ? `今天還有 ${remaining} 則訊息` : `${remaining} messages left today`}
          </span>
        )}
      </div>
    </div>
  );
}
