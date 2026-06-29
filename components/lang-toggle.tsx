"use client";

import { useSiteLang, setSiteLang } from "./lang-store";

export type LangPane = { code: string; label: string; node: React.ReactNode };

export function LangToggle({ panes }: { panes: LangPane[] }) {
  const lang = useSiteLang();

  if (panes.length <= 1) return <>{panes[0]?.node}</>;

  // Respect the global preference; fall back to the first available pane.
  const active = panes.some((p) => p.code === lang) ? lang : panes[0].code;

  return (
    <div>
      <div className="mb-6 flex items-center gap-1 text-xs font-mono">
        {panes.map((p) => (
          <button
            key={p.code}
            type="button"
            aria-pressed={active === p.code}
            onClick={() => setSiteLang(p.code)}
            className={
              "rounded-md px-2 py-1 transition-colors " +
              (active === p.code ? "bg-card text-foreground" : "text-faint hover:text-foreground")
            }
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Render every pane; hide the inactive ones so both stay in the DOM. */}
      {panes.map((p) => (
        <div key={p.code} className={active === p.code ? "" : "hidden"}>
          {p.node}
        </div>
      ))}
    </div>
  );
}
