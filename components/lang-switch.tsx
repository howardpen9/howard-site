"use client";

import { usePathname } from "next/navigation";
import { useSiteLang, setSiteLang } from "./lang-store";

const OPTIONS = [
  ["en", "EN"],
  ["zh", "中"],
] as const;

const isArticle = (pathname: string) => /^\/\d{4}\/[^/]+$/.test(pathname);

/** Header copy. On an article the same control sits in the reading meta row. */
export function HeaderLangSwitch() {
  const article = isArticle(usePathname() ?? "");
  if (article) return null;
  return <LangSwitch />;
}

/** Global language toggle — drives the whole site. */
export function LangSwitch() {
  const lang = useSiteLang();
  return (
    <div className="flex items-center gap-0.5 font-mono text-xs">
      {OPTIONS.map(([code, label]) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setSiteLang(code)}
          className={
            "rounded px-1.5 py-0.5 transition-colors " +
            (lang === code ? "text-foreground" : "text-faint hover:text-foreground")
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
