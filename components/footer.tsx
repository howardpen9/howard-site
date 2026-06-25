import { LINKS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t py-8 text-sm text-muted">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {LINKS.map((link) => (
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
        <a href="/llms.txt" className="ml-auto font-mono text-xs text-faint transition-colors hover:text-foreground">
          llms.txt
        </a>
      </div>
      <p className="mt-4 text-xs text-faint">© {new Date().getFullYear()} Howard Peng</p>
    </footer>
  );
}
