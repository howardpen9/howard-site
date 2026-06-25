import type { Metadata } from "next";
import Image from "next/image";
import { SITE, LINKS, PROJECTS } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: SITE.bio,
  alternates: { canonical: "/about" },
};

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  building: "Building",
  private: "Private",
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span className="rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-faint">
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function About() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

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
          Right now most of that energy goes into <strong>pay-per-call AI video</strong>: laying the
          value-transmission rail (x402 + crypto) before the killer use cases land, and shipping
          proof along the way.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="mb-5 text-xs font-medium uppercase tracking-widest text-faint">Building</h2>
        <div className="space-y-4">
          {featured.map((p) => {
            const card = (
              <article className="rounded-xl border bg-card transition-colors hover:border-foreground/20">
                {p.image && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl border-b">
                    <Image src={p.image} alt={`${p.name} screenshot`} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{p.name}</h3>
                    <StatusBadge status={p.status} />
                    {p.href && (
                      <span className="ml-auto font-mono text-xs text-faint">
                        {p.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.tagline}</p>
                </div>
              </article>
            );
            return p.href ? (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="block">
                {card}
              </a>
            ) : (
              <div key={p.name}>{card}</div>
            );
          })}
        </div>

        {rest.length > 0 && (
          <ul className="mt-6 space-y-1">
            {rest.map((p) => {
              const inner = (
                <div className="flex items-baseline justify-between gap-4">
                  <span>
                    <span className="transition-colors group-hover:text-accent">{p.name}</span>
                    <span className="ml-2 text-sm text-muted">{p.tagline}</span>
                  </span>
                </div>
              );
              return (
                <li key={p.name}>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="group -mx-2 block rounded-md px-2 py-2 transition-colors hover:bg-card">
                      {inner}
                    </a>
                  ) : (
                    <div className="-mx-2 px-2 py-2">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-14">
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
      </section>
    </div>
  );
}
