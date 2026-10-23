import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/config";

export const ogAlt = `${SITE.name} — ${SITE.role}`;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Shared card for the homepage and /about. Tokens match app/globals.css.
export default async function OgImage() {
  const [sans, mono] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#171717",
        }}
      >
        <div style={{ width: 14, height: "100%", background: "#0068d6" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 26,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#8f8f8f",
            }}
          >
            howard-peng.xyz
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontFamily: "Geist",
              fontSize: 88,
              lineHeight: 1,
              letterSpacing: "-0.045em",
              color: "#171717",
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontFamily: "Geist Mono",
              fontSize: 34,
              color: "#0068d6",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE.role}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sans, style: "normal", weight: 600 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
