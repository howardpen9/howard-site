"use client";

import { useSiteLang } from "./lang-store";

export type LangPane = { code: string; label: string; node: React.ReactNode };

/**
 * Renders the post body in the site-wide selected language (the header
 * EN/中 switch drives it). No own buttons — both panes stay in the DOM so
 * agents/crawlers see both languages; the inactive one is hidden.
 */
export function LangToggle({ panes }: { panes: LangPane[] }) {
  const lang = useSiteLang();

  if (panes.length <= 1) return <>{panes[0]?.node}</>;

  const active = panes.some((p) => p.code === lang) ? lang : panes[0].code;

  return (
    <>
      {panes.map((p) => (
        <div key={p.code} className={active === p.code ? "" : "hidden"}>
          {p.node}
        </div>
      ))}
    </>
  );
}
