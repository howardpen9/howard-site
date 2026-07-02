"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Heading {
  id: string;
  text: string;
  level: number; // 2 or 3
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "toc-open-v2"; // bumped: default is now collapsed
// max-w-2xl = 42rem; half = 21rem = 336px. TOC is 176px wide, gap 12px.
// left = max(8px, 50vw - 336px - 12px - 176px)
const TOC_WIDTH = 176;

// ─── Module-level localStorage store for open/closed preference ──────────────
//
// useSyncExternalStore needs a stable subscribe/getSnapshot pair that lives
// outside the component. The module-level cache means we only hit localStorage
// once per session; the listener set lets React re-render on writeOpen().

const _openListeners = new Set<() => void>();
let _openCache: boolean | undefined;

function _readOpen(): boolean {
  if (_openCache === undefined) {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      _openCache = s !== null ? s === "true" : false;
    } catch {
      _openCache = false;
    }
  }
  return _openCache;
}

function _writeOpen(val: boolean): void {
  _openCache = val;
  try {
    localStorage.setItem(STORAGE_KEY, String(val));
  } catch {
    // ignore
  }
  _openListeners.forEach((cb) => cb());
}

function _subscribeOpen(cb: () => void): () => void {
  _openListeners.add(cb);
  return () => _openListeners.delete(cb);
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

/** Returns true if an element (or any ancestor) carries the .hidden class. */
function isHidden(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== document.documentElement) {
    if (node.classList.contains("hidden")) return true;
    node = node.parentElement;
  }
  return false;
}

/** Collect headings from visible .prose containers only.
 *
 * Only h2 lands in the TOC. h3 sub-beats (personal asides, minor observations
 * nested under a section) are deliberately excluded so the rail stays a short,
 * curated map of the major movements rather than a flat dump of every heading. */
function scanHeadings(): Heading[] {
  const proseEls = Array.from(document.querySelectorAll<HTMLElement>(".prose"));
  const result: Heading[] = [];
  for (const prose of proseEls) {
    if (isHidden(prose)) continue;
    prose.querySelectorAll<HTMLElement>("h2").forEach((h) => {
      if (h.id && h.textContent) {
        result.push({
          id: h.id,
          text: h.textContent.trim(),
          level: parseInt(h.tagName[1], 10),
        });
      }
    });
  }
  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Toc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  // useSyncExternalStore handles SSR vs client correctly:
  //   server snapshot  → true   (default: TOC open; never rendered server-side anyway)
  //   client snapshot  → reads localStorage
  // React uses the server snapshot during hydration (matching server HTML = nothing,
  // because headings is empty), then switches to the client snapshot automatically.
  const open = useSyncExternalStore(_subscribeOpen, _readOpen, () => false);

  // Stable ref so the IO callback reads the current headings without stale closure.
  const headingsRef = useRef<Heading[]>([]);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const moRef = useRef<MutationObserver | null>(null);

  /** Wire up IntersectionObserver for scroll-spy. */
  const setupIO = useCallback((hs: Heading[]) => {
    ioRef.current?.disconnect();
    if (hs.length === 0) return;

    const visible = new Set<string>();

    ioRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Highlight the topmost heading in the upper viewport zone.
        const first = headingsRef.current.find((h) => visible.has(h.id));
        if (first) setActiveId(first.id);
      },
      // Only headings in the top 30% of the viewport are "active".
      { rootMargin: "0% 0% -70% 0%", threshold: 0 },
    );

    for (const { id } of hs) {
      const el = document.getElementById(id);
      if (el) ioRef.current.observe(el);
    }
  }, []);

  /**
   * Re-scan headings + rewire IO.
   * Called on mount and whenever a language-pane toggle changes DOM visibility.
   * setState calls here (setHeadings, setupIO→setActiveId) are inside a
   * useCallback body, not directly in the useEffect body, so they don't
   * trigger the react-hooks/set-state-in-effect lint rule.
   */
  const refresh = useCallback(() => {
    const hs = scanHeadings();
    headingsRef.current = hs;
    setHeadings(hs);
    setupIO(hs);
  }, [setupIO]);

  useEffect(() => {
    // Initial heading scan.  Wrapped in requestAnimationFrame so that setState
    // (inside refresh → setHeadings) is called inside a callback, satisfying
    // the react-hooks/set-state-in-effect rule which forbids direct setState
    // calls in the effect body.  Headings are server-rendered so they exist
    // in the DOM immediately; the RAF delay is imperceptible.
    const rafId = requestAnimationFrame(() => refresh());

    // Watch for language-pane toggles: the hidden pane gains/loses .hidden.
    // MutationObserver invokes refresh as a callback — allowed by the lint rule.
    const article = document.querySelector("article");
    if (article) {
      moRef.current = new MutationObserver(refresh);
      moRef.current.observe(article, {
        attributes: true,
        attributeFilter: ["class"],
        subtree: true,
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      ioRef.current?.disconnect();
      moRef.current?.disconnect();
    };
  }, [refresh]);

  const toggleOpen = () => _writeOpen(!open);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // headings.length === 0 on server (effects don't run) and on initial client
  // render (before useEffect fires) → returns null both times → no hydration mismatch.
  if (headings.length === 0) return null;

  return (
    // hidden below xl (1280px); above that, fixed and vertically centered in
    // the left margin, hugging the left edge of the centered article column.
    <div
      className="hidden xl:block"
      style={{
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
        left: `max(16px, calc(50vw - 21rem - 28px - ${TOC_WIDTH}px))`,
        width: `${TOC_WIDTH}px`,
        zIndex: 40,
      }}
    >
      {open ? (
        <nav
          aria-label="Table of contents"
          style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "74vh" }}
        >
          {/* A quiet margin rail: stacked left-borders form one continuous
              line; the active section's segment turns foreground. */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto" }}>
            {headings.map(({ id, text, level }) => {
              const isActive = id === activeId;
              return (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      cursor: "pointer",
                      borderLeft: `1px solid ${isActive ? "var(--foreground)" : "var(--border)"}`,
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      padding: level === 3 ? "3px 0 3px 22px" : "3px 0 3px 12px",
                      fontSize: "0.72rem",
                      lineHeight: 1.4,
                      color: isActive ? "var(--foreground)" : "var(--faint)",
                      transition: "color 0.15s ease, border-color 0.15s ease",
                      wordBreak: "break-word",
                    }}
                  >
                    {text}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            onClick={toggleOpen}
            aria-label="Hide table of contents"
            style={{
              alignSelf: "flex-start",
              marginLeft: "12px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "var(--faint)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            hide ‹
          </button>
        </nav>
      ) : (
        /* Collapsed: a minimal vertical handle, no box. */
        <button
          onClick={toggleOpen}
          aria-label="Show table of contents"
          title="Contents"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "var(--faint)",
            background: "none",
            border: "none",
            cursor: "pointer",
            writingMode: "vertical-rl",
            padding: 0,
          }}
        >
          contents ›
        </button>
      )}
    </div>
  );
}
