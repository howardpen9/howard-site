/**
 * LayerCake — RSC stacked-layer diagram for MDX articles.
 *
 * Renders a vertical stack of layers (top of the array = top of the stack),
 * each with a tier badge, title, note, and a state pill. A left-side axis
 * arrow communicates a direction ("scarcity climbs up"); consecutive layers
 * flagged `swept` are wrapped in a dashed group with a corner label so a
 * single release that hits multiple layers reads at a glance.
 *
 * No client JS, no charting library — pure server-rendered HTML + CSS.
 * Tones are semantic translucent tints that stay legible over the site's
 * `var(--card)` background in both light and dark themes.
 *
 * Authoring in MDX:
 *   <LayerCake
 *     axisLabel="scarcity climbs"
 *     sweepLabel="two layers at once"
 *     layers={[
 *       { tier: "L4", title: "Applications", note: "…", state: "scarce", tone: "moat" },
 *       { tier: "L3", title: "Inference", note: "…", state: "opening up", tone: "swept", swept: true },
 *       { tier: "L2", title: "Weights", note: "…", state: "eroding", tone: "swept", swept: true },
 *       { tier: "L1", title: "Compute", note: "…", state: "commodity", tone: "commodity" },
 *     ]}
 *     caption="Source note"
 *   />
 *
 * Agent / .md twin degradation: every label and state lives in the JSX props
 * as plain text — the raw .mdx source is machine-readable as-is.
 */

const TONE = {
  commodity: { border: "#6b7280", bg: "rgba(107,114,128,0.10)", accent: "#9ca3af" },
  swept: { border: "#c2630a", bg: "rgba(194,99,10,0.13)", accent: "#e0852f" },
  moat: { border: "#2f9e6e", bg: "rgba(47,158,110,0.13)", accent: "#3fc08a" },
} as const;

export type CakeLayer = {
  /** Tier badge, e.g. "L4". */
  tier: string;
  /** Layer name. */
  title: string;
  /** Optional sub-line (example player or detail). */
  note?: string;
  /** Short state pill, e.g. "commodity" / "scarce". */
  state?: string;
  /** Color family; defaults to "commodity". */
  tone?: keyof typeof TONE;
  /** Mark this layer as hit by the release being discussed. Consecutive
   *  swept layers are visually grouped with a corner label. */
  swept?: boolean;
};

function LayerBox({ layer }: { layer: CakeLayer }) {
  const tone = TONE[layer.tone ?? "commodity"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        borderRadius: "10px",
        padding: "0.8rem 1.05rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: tone.accent,
          width: "2.1rem",
          flexShrink: 0,
        }}
      >
        {layer.tier}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>
          {layer.title}
        </div>
        {layer.note && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginTop: "2px",
              lineHeight: 1.35,
            }}
          >
            {layer.note}
          </div>
        )}
      </div>
      {layer.state && (
        <span
          style={{
            fontSize: "0.72rem",
            color: tone.accent,
            border: `1px solid ${tone.border}`,
            borderRadius: "999px",
            padding: "2px 9px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {layer.state}
        </span>
      )}
    </div>
  );
}

export function LayerCake({
  layers,
  axisLabel,
  sweepLabel,
  caption,
}: {
  layers: CakeLayer[];
  /** Vertical label next to the upward arrow. */
  axisLabel?: string;
  /** Label on the dashed group wrapping consecutive `swept` layers. */
  sweepLabel?: string;
  caption?: string;
}) {
  // Defensive guard: if blockJS is left at its default, expression props are
  // stripped and `layers` arrives undefined. Render nothing rather than crash.
  if (!layers?.length) return null;

  // Group consecutive swept layers so a single release spanning several layers
  // gets one dashed wrapper + corner label instead of per-row decoration.
  const groups: { swept: boolean; items: CakeLayer[] }[] = [];
  for (const layer of layers) {
    const last = groups[groups.length - 1];
    if (layer.swept && last?.swept) last.items.push(layer);
    else groups.push({ swept: !!layer.swept, items: [layer] });
  }

  return (
    <div style={{ margin: "1.75rem 0" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
        {/* ── Left axis: upward arrow + vertical label ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--faint)",
          }}
        >
          <span aria-hidden style={{ fontSize: "1rem", lineHeight: 1 }}>
            ↑
          </span>
          {axisLabel && (
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: "0.72rem",
                marginTop: "6px",
                letterSpacing: "0.04em",
              }}
            >
              {axisLabel}
            </span>
          )}
        </div>

        {/* ── Stacked layers ── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {groups.map((group, gi) =>
            group.swept ? (
              <div
                key={gi}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "1.1rem 0.6rem 0.6rem",
                  border: `1px dashed ${TONE.swept.border}`,
                  borderRadius: "12px",
                }}
              >
                {sweepLabel && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-9px",
                      right: "14px",
                      background: "var(--background)",
                      padding: "0 8px",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      color: TONE.swept.accent,
                    }}
                  >
                    {sweepLabel}
                  </span>
                )}
                {group.items.map((layer) => (
                  <LayerBox key={layer.tier} layer={layer} />
                ))}
              </div>
            ) : (
              group.items.map((layer) => <LayerBox key={layer.tier} layer={layer} />)
            ),
          )}
        </div>
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
