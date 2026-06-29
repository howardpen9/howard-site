"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide language preference (default English), persisted in localStorage.
 * Drives the home post list, the header switch, and each post's LangToggle so
 * they all stay in sync. useSyncExternalStore keeps SSR/hydration correct:
 * the server snapshot is always the default, the client reads localStorage.
 */
const KEY = "site-lang";
export const DEFAULT_LANG = "en";

const listeners = new Set<() => void>();
let cache: string | undefined;

function read(): string {
  if (cache === undefined) {
    try {
      cache = localStorage.getItem(KEY) || DEFAULT_LANG;
    } catch {
      cache = DEFAULT_LANG;
    }
  }
  return cache;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setSiteLang(value: string): void {
  cache = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // ignore (private mode, etc.)
  }
  listeners.forEach((cb) => cb());
}

export function useSiteLang(): string {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_LANG);
}
