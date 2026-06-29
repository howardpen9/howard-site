/**
 * Aside — a supplementary callout for definitions / side-notes in MDX.
 *
 * Visually distinct from a blockquote: a soft card with a left accent bar and
 * an optional bold `term` lead-in, for "let me define this word" asides that
 * shouldn't interrupt the main line of argument.
 *
 * Author inline so the children stay inline (no stray <p> margin):
 *   <Aside term="靜態落差">在某個時間點切一刀…天生客單價低。</Aside>
 *
 * Pure RSC, inline styles + theme CSS variables.
 */
export function Aside({ term, children }: { term?: string; children: React.ReactNode }) {
  return (
    <aside
      style={{
        margin: "1.25rem 0",
        padding: "0.8rem 1.1rem",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderLeft: "2px solid var(--accent)",
        borderRadius: "8px",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        color: "var(--muted)",
      }}
    >
      {term && (
        <>
          <strong style={{ color: "var(--foreground)", fontWeight: 600 }}>{term}</strong>
          <span style={{ color: "var(--faint)" }}> — </span>
        </>
      )}
      {children}
    </aside>
  );
}
