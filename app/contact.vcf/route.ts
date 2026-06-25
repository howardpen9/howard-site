import { SITE, LINKS } from "@/lib/config";

export const dynamic = "force-static";

export function GET() {
  const urls = LINKS.filter((l) => l.href.startsWith("http")).map((l) => `URL;TYPE=${l.label}:${l.href}`);
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${SITE.name}`,
    "N:Peng;Howard;;;",
    `TITLE:${SITE.role}`,
    `EMAIL;TYPE=INTERNET:${SITE.email}`,
    ...urls,
    `URL:${SITE.url}`,
    "END:VCARD",
    "",
  ].join("\r\n");

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Howard-Peng.vcf"',
    },
  });
}
