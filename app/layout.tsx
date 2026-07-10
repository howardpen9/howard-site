import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { SITE, LINKS } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${SITE.name} — RSS` }],
      "text/plain": [
        { url: "/llms.txt", title: "llms.txt" },
        { url: "/resume.md", title: "Resume (Markdown)" },
      ],
    },
  },
  openGraph: {
    type: "website",
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
  },
  twitter: { card: "summary", site: "@0xhoward_peng" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.url,
  email: SITE.email,
  image: `${SITE.url}${SITE.avatar}`,
  description: SITE.bio,
  sameAs: LINKS.filter((l) => l.href.startsWith("http")).map((l) => l.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <body className="min-h-full">
        <ThemeProvider>
          <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <JsonLd data={personJsonLd} />
      </body>
    </html>
  );
}
