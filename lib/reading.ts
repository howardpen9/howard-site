// Rough length estimate for a post body. Strips MDX/JSX/markdown noise, then
// counts words (latin) or characters (CJK). Approximate by design.

function strip(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/<[A-Za-z][\s\S]*?\/>/g, " ") // self-closing JSX components (multiline)
    .replace(/<\/?[A-Za-z][^>]*>/g, " ") // remaining tags (e.g. <Aside>…</Aside>)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → link text
    .replace(/[#>*_`~|]/g, " "); // markdown symbols
}

export function readingLabel(raw: string, lang: string): string {
  const text = strip(raw);
  if (lang === "zh") {
    const chars = (text.match(/[㐀-鿿぀-ヿ]/g) || []).length;
    const mins = Math.max(1, Math.round(chars / 400));
    return `${chars.toLocaleString()} 字 · ${mins} 分鐘`;
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${words.toLocaleString()} words · ${mins} min read`;
}
