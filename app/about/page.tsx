import type { Metadata } from "next";
import Image from "next/image";
import { SITE, LINKS } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: SITE.bio,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="py-4">
      <div className="flex items-center gap-4">
        <Image src={SITE.avatar} alt={SITE.name} width={72} height={72} className="rounded-xl border" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{SITE.name}</h1>
          <p className="font-mono text-sm text-accent">{SITE.role}</p>
        </div>
      </div>

      <div className="prose mt-8">
        <p>{SITE.bio}</p>
        <p>
          I care about systems where incentives, not supervision, keep agents honest — designing
          markets, protocols, and the data layers that let both people and machines reason over them.
          Much of my recent work is built to be read by AI agents as much as by humans.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-faint">Elsewhere</h2>
        <ul className="divide-y">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-accent"
              >
                <span>{link.label}</span>
                {link.handle && <span className="font-mono text-xs text-faint">{link.handle}</span>}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/contact.vcf"
          className="mt-6 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted transition-colors hover:text-foreground hover:bg-card"
        >
          Download vCard
        </a>
      </section>
    </div>
  );
}
