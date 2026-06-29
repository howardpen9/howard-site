/**
 * QuadrantChart — RSC 2×2 scatter for MDX articles.
 *
 * Plots labelled points on an attention (x) × value (y) plane, split into four
 * quadrants by a dashed center cross. Use it to make an inversion visible —
 * e.g. spectacle clustering bottom-right (high attention, low value) while
 * substance is stranded top-left (high value, low attention).
 *
 * No client JS, no charting library — pure server-rendered HTML + CSS, inline
 * styles + theme CSS variables so it works in light/dark.
 *
 * Authoring in MDX:
 *   <QuadrantChart
 *     xAxis={{ label: "Attention", low: "low", high: "high" }}
 *     yAxis={{ label: "Value", low: "low", high: "high" }}
 *     quadrants={{ tl: "…", tr: "…", bl: "…", br: "…" }}
 *     points={[{ x: 90, y: 10, label: "AI video", tone: "spectacle" }]}
 *     caption="…"
 *   />
 *
 * x and y are 0–100 (x = attention left→right, y = value bottom→top).
 * Agent / .md twin degradation: every coordinate and label lives in the JSX
 * props as plain text — the raw .mdx source is machine-readable as-is.
 */

const TONE = {
  spectacle: "#e0852f", // amber — cheap attention
  substance: "#3fc08a", // green — real value
  neutral: "#9ca3af",
} as const;

type Axis = { label: string; low?: string; high?: string };

export type QuadrantPoint = {
  /** Attention, 0–100 (left→right). */
  x: number;
  /** Value, 0–100 (bottom→top). */
  y: number;
  label: string;
  tone?: keyof typeof TONE;
};

const qStyle = {
  position: "absolute",
  maxWidth: "44%",
  fontSize: "0.62rem",
  lineHeight: 1.3,
  color: "var(--faint)",
} as const;

export function QuadrantChart({
  xAxis,
  yAxis,
  quadrants,
  points,
  caption,
}: {
  xAxis: Axis;
  yAxis: Axis;
  quadrants?: { tl?: string; tr?: string; bl?: string; br?: string };
  points: QuadrantPoint[];
  caption?: string;
}) {
  // Defensive: if blockJS is left default, expression props are stripped.
  if (!points?.length) return null;
  const q = quadrants ?? {};

  return (
    <figure style={{ margin: "1.75rem 0" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Y axis */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--faint)",
            paddingBottom: "1.1rem",
          }}
        >
          <span>{yAxis.high}</span>
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "var(--muted)" }}>
            {yAxis.label}
          </span>
          <span>{yAxis.low}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Plot box (square) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "var(--card)",
            }}
          >
            {/* Center cross */}
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px dashed var(--border)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: "1px dashed var(--border)" }} />

            {/* Quadrant labels */}
            {q.tl && <span style={{ ...qStyle, top: "8px", left: "10px" }}>{q.tl}</span>}
            {q.tr && <span style={{ ...qStyle, top: "8px", right: "10px", textAlign: "right" }}>{q.tr}</span>}
            {q.bl && <span style={{ ...qStyle, bottom: "8px", left: "10px" }}>{q.bl}</span>}
            {q.br && <span style={{ ...qStyle, bottom: "8px", right: "10px", textAlign: "right" }}>{q.br}</span>}

            {/* Points */}
            {points.map((p) => {
              const color = TONE[p.tone ?? "neutral"];
              const left = `${p.x}%`;
              const top = `${100 - p.y}%`;
              // Keep labels inside the box: anchor by which edge the point is near.
              const lx = p.x > 60 ? "translateX(-100%)" : p.x < 40 ? "translateX(0)" : "translateX(-50%)";
              const below = p.y >= 25; // low points get their label above instead
              return (
                <div key={p.label}>
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left,
                      top,
                      transform: "translate(-50%, -50%)",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 0 4px ${color}33`,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left,
                      top: below ? `calc(${top} + 10px)` : `calc(${top} - 10px)`,
                      transform: `${lx} ${below ? "translateY(0)" : "translateY(-100%)"}`,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* X axis */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "5px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--faint)",
            }}
          >
            <span>{xAxis.low}</span>
            <span style={{ color: "var(--muted)" }}>{xAxis.label}</span>
            <span>{xAxis.high}</span>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption
          style={{ marginTop: "0.875rem", fontSize: "0.75rem", color: "var(--faint)", textAlign: "center", lineHeight: 1.6 }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
