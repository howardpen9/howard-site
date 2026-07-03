/**
 * DataTable — RSC comparison-table component for MDX articles.
 *
 * Replaces raw markdown tables when the data is dense (multi-column
 * comparisons with long cells). Renders a semantic <table> inside a card,
 * styled via `.dt-*` classes in globals.css:
 *   - desktop: real table, first column as row header, zebra-free minimal look
 *   - mobile (≤640px): each row collapses into a stacked card with the
 *     column headers repeated as small labels
 *
 * No client JS, no library — pure server-rendered HTML + CSS. Colors use the
 * site's theme tokens (`var(--border)`, etc.) so dark/light both work.
 *
 * Authoring in MDX:
 *   <DataTable
 *     columns={["產業", "被商品化的那層", "價值跑去哪"]}
 *     rows={[
 *       ["電信", "頻寬", "IM(WhatsApp、Telegram)"],
 *     ]}
 *     highlightRow={4}   // optional: 0-based row to tint (e.g. the punchline row)
 *     highlightCol={3}   // optional: 0-based column to emphasize (e.g. the payoff)
 *     caption="Source note"
 *   />
 *
 * Agent / .md twin degradation: all cell text lives in the JSX props as plain
 * strings — the raw .mdx source stays machine-readable as-is.
 */

import type { ReactNode } from "react";

export function DataTable({
  columns,
  rows,
  caption,
  highlightRow,
  highlightCol,
}: {
  columns: string[];
  rows: ReactNode[][];
  caption?: string;
  /** 0-based index of a row to tint (e.g. the "now" / punchline row). */
  highlightRow?: number;
  /** 0-based index of a column to emphasize (e.g. the payoff column). */
  highlightCol?: number;
}) {
  // Defensive guard: next-mdx-remote strips JSX expression props when blockJS
  // is true (the default), so props can arrive undefined. Fail soft.
  if (!columns?.length || !rows?.length) return null;

  return (
    <figure className="dt">
      <div className="dt-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri === highlightRow ? "dt-hl-row" : undefined}>
                {row.map((cell, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={ci} className={ci === highlightCol ? "dt-hl-col" : undefined}>
                      <span className="dt-label" aria-hidden>
                        {columns[ci]}
                      </span>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="dt-caption">{caption}</figcaption>}
    </figure>
  );
}
