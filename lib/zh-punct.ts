// Platform rule: Chinese text should use full-width punctuation.
//
// We normalize at read time (see lib/posts.ts) so every surface — the rendered
// article, home cards, RSS, llms.txt, the .md twin, JSON-LD and OG meta — shows
// the same corrected text, regardless of what half-width punctuation an author
// happened to type.
//
// The transform only fires when a punctuation mark is *adjacent to a CJK
// character*, so it is a no-op on English posts and never touches decimals
// ("3.14"), thousands separators ("4,321"), domains ("x.com") or version
// strings. Code fences, inline code and JSX/HTML tags are protected verbatim.

// Han (incl. Ext-A + compatibility) · Kana · Hangul · CJK symbols · full-width forms
const CJK = /[㐀-鿿豈-﫿぀-ヿ가-힯　-〿＀-￯]/;

const isCJK = (ch: string | undefined): boolean => ch !== undefined && CJK.test(ch);

// Half-width → full-width for clause/sentence punctuation.
const SENTENCE: Record<string, string> = {
  ",": "，",
  ":": "：",
  ";": "；",
  "?": "？",
  "!": "！",
};

// Convert an ASCII "(" … ")" pair to full-width when the enclosed text contains
// any CJK. Pairing (rather than per-char adjacency) avoids producing a mismatched
// "（ … )" and leaves markdown link/image parens — e.g. `](/path)` — untouched.
function fixParens(chars: string[]): void {
  const stack: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "(") stack.push(i);
    else if (chars[i] === ")" && stack.length) {
      const open = stack.pop()!;
      if (chars.slice(open + 1, i).some((c) => CJK.test(c))) {
        chars[open] = "（";
        chars[i] = "）";
      }
    }
  }
}

function transform(segment: string): string {
  const chars = [...segment];
  fixParens(chars);
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const prev = chars[i - 1];
    const next = chars[i + 1];
    if (SENTENCE[c]) {
      if (isCJK(prev) || isCJK(next)) chars[i] = SENTENCE[c];
    } else if (c === ".") {
      // Period → 。 only after CJK and not part of a decimal, domain or ellipsis.
      if (isCJK(prev) && !(next !== undefined && /[0-9A-Za-z.]/.test(next))) chars[i] = "。";
    }
  }
  return chars.join("");
}

// Split off protected spans (fenced code, inline code, JSX/HTML tags) so they
// pass through verbatim; transform only the prose between them.
const PROTECTED = /(```[\s\S]*?```|`[^`\n]*`|<\/?[A-Za-z][^>]*>)/g;

export function zhPunct(input: string): string {
  if (!input) return input;
  return input
    .split(PROTECTED)
    .map((part, i) => (i % 2 === 1 ? part : transform(part)))
    .join("");
}
