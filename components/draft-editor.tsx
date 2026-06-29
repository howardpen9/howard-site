"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * DraftEditor — explicit Edit/Save mode for DRAFT posts on localhost.
 *
 * Reading mode by default. Click "編輯" to enter edit mode: every plain prose
 * block (p / h2 / h3 / h4 / li) becomes contentEditable and shows a dashed
 * outline. Edit text in place, then "存檔 ⌘S" serializes the changed blocks
 * back to Markdown and patches them into the source .mdx via /api/draft-edit
 * (unique-match). "完成" leaves edit mode.
 *
 * Only mounted when the post is a draft AND not on Vercel (see page.tsx), so it
 * never ships interactivity to production. Component-rendered blocks
 * (LayerCake/BarChart captions carry inline styles), code, tables, and tweets
 * are skipped — they don't round-trip to a single source line.
 */

// Reverse of the Markdown→HTML the site renders, for the inline marks we use.
function serializeInline(node: Node): string {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += child.nodeValue ?? "";
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const inner = serializeInline(el);
    switch (el.tagName.toLowerCase()) {
      case "strong":
      case "b":
        out += `**${inner}**`;
        break;
      case "em":
      case "i":
        out += `*${inner}*`;
        break;
      case "code":
        out += `\`${inner}\``;
        break;
      case "a":
        out += `[${inner}](${el.getAttribute("href") ?? ""})`;
        break;
      case "br":
        out += "\n";
        break;
      case "div":
        out += (out && !out.endsWith("\n") ? "\n" : "") + inner;
        break;
      default:
        out += inner;
    }
  });
  return out;
}

function serializeBlock(el: HTMLElement): string {
  const inner = serializeInline(el).replace(/ /g, " ").trim();
  const m = el.tagName.toLowerCase().match(/^h([1-6])$/);
  return m ? `${"#".repeat(Number(m[1]))} ${inner}` : inner;
}

const SKIP_SELECTOR = "pre, code, table, figure, .react-tweet, [data-rehype-pretty-code-figure]";

export function DraftEditor({
  year,
  slug,
  lang,
  children,
}: {
  year: string;
  slug: string;
  lang: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const originals = useRef(new Map<HTMLElement, string>());
  const dirty = useRef(new Set<HTMLElement>());
  const [editing, setEditing] = useState(false);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<string>("");

  const recount = useCallback(() => {
    let n = 0;
    dirty.current.forEach((el) => {
      if (serializeBlock(el) !== originals.current.get(el)) n++;
      else dirty.current.delete(el);
    });
    setCount(n);
  }, []);

  const save = useCallback(async () => {
    const root = rootRef.current;
    if (!root || root.offsetParent === null) return; // skip the hidden lang pane
    const items: { el: HTMLElement; original: string; updated: string }[] = [];
    dirty.current.forEach((el) => {
      const original = originals.current.get(el);
      const updated = serializeBlock(el);
      if (original != null && updated !== original) items.push({ el, original, updated });
    });
    if (!items.length) return;

    setStatus("存檔中…");
    try {
      const res = await fetch("/api/draft-edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          year,
          slug,
          lang,
          patches: items.map(({ original, updated }) => ({ original, updated })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`✗ ${data.error ?? res.status}`);
        return;
      }
      const results: { status: string }[] = data.results ?? [];
      let failed = 0;
      items.forEach((it, i) => {
        if (results[i]?.status === "ok") {
          originals.current.set(it.el, it.updated);
          dirty.current.delete(it.el);
          it.el.classList.remove("de-unsaved");
        } else {
          failed++;
          it.el.classList.add("de-unsaved");
        }
      });
      recount();
      setStatus(
        `✓ 存了 ${data.applied}/${data.total}` +
          (failed ? ` · ${failed} 筆沒對上(可能有格式或重複,需手改原始檔)` : " 到 .mdx"),
      );
    } catch (e) {
      setStatus(`✗ ${e instanceof Error ? e.message : "save failed"}`);
    }
  }, [year, slug, lang, recount]);

  // Enter/leave edit mode: toggle contentEditable + listeners on prose blocks.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !editing) return;

    // Skip blocks rendered by custom components (their element or a wrapper
    // carries an inline style). Bound the search at `root` — <html>/<body>
    // carry inline styles too (next-themes color-scheme), so an unbounded
    // closest("[style]") would match every block and disable all editing.
    const styledWithin = (el: HTMLElement) => {
      let n: HTMLElement | null = el;
      while (n && n !== root) {
        if (n.hasAttribute("style")) return true;
        n = n.parentElement;
      }
      return false;
    };
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("p, h2, h3, h4, li")).filter(
      (el) =>
        !styledWithin(el) &&
        !el.closest(SKIP_SELECTOR) &&
        !el.querySelector("p, ul, ol, pre, table"),
    );

    const onInput = (e: Event) => {
      // Mark the edited block dirty, then recount. Without the add, recount
      // (which only prunes unchanged blocks) never sees the edit → count stays
      // 0 → save is a no-op. This was the "saved but nothing persisted" bug.
      const el = e.currentTarget as HTMLElement | null;
      if (el) dirty.current.add(el);
      recount();
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      document.execCommand("insertText", false, e.clipboardData?.getData("text/plain") ?? "");
    };

    dirty.current.clear();
    setCount(0);
    setStatus("");
    blocks.forEach((el) => {
      originals.current.set(el, serializeBlock(el));
      el.contentEditable = "true";
      el.classList.add("de-editable");
      el.addEventListener("input", onInput);
      el.addEventListener("paste", onPaste);
    });

    return () => {
      blocks.forEach((el) => {
        el.contentEditable = "false";
        el.classList.remove("de-editable", "de-unsaved");
        el.removeEventListener("input", onInput);
        el.removeEventListener("paste", onPaste);
      });
    };
  }, [editing, recount]);

  // ⌘S / Ctrl+S saves while editing.
  useEffect(() => {
    if (!editing) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing, save]);

  const done = () => {
    if (count > 0 && !window.confirm(`還有 ${count} 處未存的改動,確定離開編輯?`)) return;
    setEditing(false);
  };

  const pill = {
    position: "fixed",
    left: "50%",
    bottom: "1.25rem",
    transform: "translateX(-50%)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.45rem 0.5rem 0.45rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
    fontSize: "0.8rem",
  } as const;

  const btn = (active: boolean) =>
    ({
      borderRadius: "999px",
      border: "1px solid var(--border)",
      padding: "0.3rem 0.8rem",
      fontSize: "0.78rem",
      fontFamily: "var(--font-mono)",
      cursor: active ? "pointer" : "default",
      opacity: active ? 1 : 0.45,
      background: active ? "var(--accent)" : "transparent",
      color: active ? "#fff" : "var(--muted)",
      whiteSpace: "nowrap",
    }) as const;

  return (
    <div ref={rootRef} className={editing ? "de-root de-editing-mode" : "de-root"}>
      <style>{`
        .de-editing-mode .de-editable { border-radius: 3px; cursor: text; outline: 1px dashed var(--border); outline-offset: 3px; }
        .de-editing-mode .de-editable:focus { outline: 1px solid var(--accent); }
        .de-unsaved { outline: 1px dashed var(--accent) !important; }
      `}</style>
      {children}
      <div style={pill}>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} style={btn(true)}>
            ✎ 編輯
          </button>
        ) : (
          <>
            <span style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>
              {status || (count ? `✎ ${count} 處改動` : "點段落直接打字")}
            </span>
            <button type="button" onClick={() => void save()} disabled={count === 0} style={btn(count > 0)}>
              存檔 ⌘S
            </button>
            <button
              type="button"
              onClick={done}
              style={{
                borderRadius: "999px",
                border: "1px solid var(--border)",
                padding: "0.3rem 0.7rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                background: "transparent",
                color: "var(--muted)",
                whiteSpace: "nowrap",
              }}
            >
              完成
            </button>
          </>
        )}
      </div>
    </div>
  );
}
