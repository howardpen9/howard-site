import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LangSwitch } from "./lang-switch";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/ask", label: "Ask" },
];

export function Header() {
  return (
    <header className="flex items-center justify-between py-8">
      <Link href="/" className="font-medium tracking-tight hover:text-accent">
        Howard Peng
      </Link>
      <nav className="flex items-center gap-5 text-sm text-muted">
        {NAV.slice(1).map((item) => (
          <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
            {item.label}
          </Link>
        ))}
        <LangSwitch />
        <ThemeToggle />
      </nav>
    </header>
  );
}
