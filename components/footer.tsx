"use client";

import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/config";

// Article reading pages (/YYYY/slug) get a minimal footer: the post already
// carries its own tag footer, so we don't re-show the social links there.
const isArticle = (pathname: string) => /^\/\d{4}\/[^/]+$/.test(pathname);

export function Footer() {
  const article = isArticle(usePathname() ?? "");

  return (
    <footer className="mt-24 border-t py-8 text-sm text-muted">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {!article &&
          LINKS.slice(0, 2).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        <a
          href="/llms.txt"
          className={`${article ? "" : "ml-auto"} font-mono text-xs text-faint transition-colors hover:text-foreground`}
        >
          llms.txt
        </a>
      </div>
      <p className="mt-4 text-xs text-faint">© {new Date().getFullYear()} Howard Peng</p>
    </footer>
  );
}
