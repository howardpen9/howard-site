"use client";

import { useSiteLang } from "./lang-store";

/** Shows the reading estimate for the site-wide selected language. */
export function ReadingMeta({ stats }: { stats: Record<string, string> }) {
  const lang = useSiteLang();
  const label = stats[lang] ?? stats.en ?? Object.values(stats)[0];
  if (!label) return null;
  return <span className="font-mono">{label}</span>;
}
