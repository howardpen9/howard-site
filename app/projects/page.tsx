import type { Metadata } from "next";
import { PROJECTS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Howard Peng has built — products, research tooling, and agent-readable data layers.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return (
    <div className="py-4">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-3 text-muted">Products, research tooling, and agent-readable data layers I&apos;ve built.</p>

      <ul className="mt-10 space-y-1">
        {PROJECTS.map((p) => {
          const inner = (
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-medium transition-colors group-hover:text-accent">{p.name}</span>
                <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-faint">{p.year}</span>
            </div>
          );
          return (
            <li key={p.name}>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-3 block rounded-lg px-3 py-3 transition-colors hover:bg-card"
                >
                  {inner}
                </a>
              ) : (
                <div className="-mx-3 px-3 py-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-12 text-sm text-faint">
        More at{" "}
        <a href="https://github.com/howardpen9" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
          github.com/howardpen9
        </a>
        .
      </p>
    </div>
  );
}
