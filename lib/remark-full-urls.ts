// Platform rule: reference-style links show the complete URL.
//
// Authors often write a link as `[x.com/deedydas](https://x.com/deedydas/status/123)`
// — short, readable text over a long href. In a References list that truncation
// hides the real destination (two links can both read "x.com/0xHoward_Peng" yet
// point at different tweets). This remark plugin rewrites the *visible text* of
// any link whose text already looks like a URL to the full href (scheme stripped
// for readability). Descriptive-text links — "[I wrote that up separately.](…)" —
// and internal links are left untouched.

// A single-token, whitespace-free string that carries a domain (has a dot + TLD).
const URLISH = /^(https?:\/\/)?[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i;

type Node = {
  type: string;
  url?: string;
  value?: string;
  children?: Node[];
};

function walk(node: Node, fn: (n: Node) => void): void {
  fn(node);
  if (node.children) for (const child of node.children) walk(child, fn);
}

export function remarkFullUrls() {
  return (tree: Node) => {
    walk(tree, (node) => {
      if (node.type !== "link" || !node.url) return;
      // Only expand absolute external links; leave internal routes alone.
      if (!/^https?:\/\//i.test(node.url)) return;
      const kids = node.children ?? [];
      if (kids.length !== 1 || kids[0].type !== "text") return;
      const text = kids[0].value ?? "";
      // Descriptive text (has spaces) or non-URL text stays as authored.
      if (/\s/.test(text) || !URLISH.test(text)) return;
      kids[0].value = node.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    });
  };
}
