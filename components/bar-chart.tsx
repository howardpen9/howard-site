/**
 * BarChart — RSC data-visualization component for MDX articles.
 *
 * Renders a horizontal stacked-reach bar (top) + per-category legend rows
 * that each carry TWO sub-bars: reach share (solid) and post-count share
 * (faded, same scale). That dual-bar makes a "posts ≠ reach" inversion
 * immediately visible when a category posts a lot but wins little reach.
 *
 * No client JS, no charting library — pure server-rendered HTML + CSS.
 * Colors fall back to a built-in 6-step palette; each step is legible in
 * both dark and light themes. CSS variables (`var(--border)`, etc.) honour
 * the site's theme tokens automatically.
 *
 * Authoring in MDX:
 *   <BarChart
 *     data={[
 *       { label: "Category", value: 55.9, count: 66 },
 *     ]}
 *     caption="Source note"
 *   />
 *
 * Agent / .md twin degradation: all numbers live in the JSX props as plain
 * text — no separate markdown table is needed. The raw .mdx source is
 * machine-readable as-is.
 */

const PALETTE = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#f59e0b", // amber
  "#ef4444", // coral-red
  "#14b8a6", // teal
];

export type BarEntry = {
  label: string;
  /** Reach share, 0–100. */
  value: number;
  /** Post count (absolute). */
  count: number;
  /** Optional override; defaults to PALETTE[i]. */
  color?: string;
};

export function BarChart({
  data,
  total,
  unit = "%",
  caption,
}: {
  data: BarEntry[];
  /** Total posts used to compute count-share bars. Auto-sum if omitted. */
  total?: number;
  unit?: string;
  caption?: string;
}) {
  // Defensive guard: next-mdx-remote strips JSX expression props when blockJS
  // is true (the default). If blockJS is not disabled in the MDX options, data
  // arrives as undefined. Return null gracefully rather than crashing.
  if (!data?.length) return null;

  const resolved = data.map((d, i) => ({
    ...d,
    color: d.color ?? PALETTE[i % PALETTE.length],
  }));

  const totalCount = total ?? resolved.reduce((s, d) => s + d.count, 0);

  /* Inline styles are used throughout so this component is self-contained and
     portable — it does not depend on Tailwind classes being in the build. */

  const card = {
    margin: "1.5rem 0",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    padding: "1rem 1.25rem",
    fontSize: "0.875rem",
  } as const;

  const track = {
    flex: 1,
    height: "5px",
    background: "var(--border)",
    borderRadius: "999px",
    overflow: "hidden",
  } as const;

  return (
    <div style={card}>
      {/* ── Top stacked bar ── shows reach share by category */}
      <div
        style={{
          display: "flex",
          height: "20px",
          width: "100%",
          overflow: "hidden",
          borderRadius: "4px",
          gap: "1px",
        }}
      >
        {resolved.map((d) => (
          <div
            key={d.label}
            style={{
              width: `${d.value}%`,
              flexShrink: 0,
              background: d.color,
            }}
            title={`${d.label}: ${d.value}${unit} reach, ${d.count} posts`}
          />
        ))}
      </div>

      {/* ── Legend rows ── */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
        }}
      >
        {resolved.map((d) => {
          const countPct = (d.count / totalCount) * 100;

          return (
            <div key={d.label}>
              {/* Header: dot · label · stats */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "5px",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    background: d.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {d.value}
                  {unit} · {d.count} posts
                </span>
              </div>

              {/* Reach bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "17px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--faint)",
                    width: "2.5rem",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  reach
                </span>
                <div style={track}>
                  <div
                    style={{
                      height: "100%",
                      width: `${d.value}%`,
                      background: d.color,
                      borderRadius: "999px",
                    }}
                  />
                </div>
              </div>

              {/* Count bar — same 0-100% scale as reach, faded */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "17px",
                  marginTop: "3px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--faint)",
                    width: "2.5rem",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  posts
                </span>
                <div style={track}>
                  <div
                    style={{
                      height: "100%",
                      width: `${countPct}%`,
                      background: d.color,
                      borderRadius: "999px",
                      opacity: 0.4,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {caption && (
        <p
          style={{
            marginTop: "0.875rem",
            fontSize: "0.75rem",
            color: "var(--faint)",
            textAlign: "center",
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

// ── StatCards ─────────────────────────────────────────────────────────────
/**
 * StatCards — a row of big-number + caption stat tiles.
 *
 * Authoring in MDX:
 *   <StatCards stats={[
 *     { value: "9.3M", label: "Total views" },
 *   ]} />
 */

export type StatEntry = {
  /** Display value, e.g. "9.3M" or "80%". */
  value: string;
  /** Short caption below the value. */
  label: string;
};

export function StatCards({ stats }: { stats: StatEntry[] }) {
  if (!stats?.length) return null;
  const cols = Math.min(stats.length, 4);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "0.625rem",
        margin: "1.5rem 0",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            padding: "0.875rem 1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              marginTop: "0.25rem",
              lineHeight: 1.35,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
