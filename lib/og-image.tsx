import { ImageResponse } from "next/og";
import { loadGoogleFont } from "./og-font";

export const OG_SIZE = { width: 1200, height: 630 };

// Palette, from app/tokens.css.
const GROUND = "#0E1512";
const TEXT = "#E4DBCB";
const BRASS = "#E0AE62";
const LIT = "#F3C77E";

/**
 * The share card: the lit rule, a title in Spectral 200, one line beneath
 * in JetBrains Mono. Flat ground, nothing else.
 */
export async function ogImage(title: string, line: string) {
  const [spectral, mono] = await Promise.all([
    loadGoogleFont("Spectral", 200, title),
    loadGoogleFont("JetBrains Mono", 400, line),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: GROUND,
        }}
      >
        <div
          style={{
            width: 120,
            height: 3,
            background: LIT,
            boxShadow:
              "0 0 12px rgba(243,199,126,.6), 0 0 36px rgba(224,174,98,.35)",
          }}
        />
        <div
          style={{
            marginTop: 56,
            fontFamily: "Spectral",
            fontWeight: 200,
            fontSize: 148,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: TEXT,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            letterSpacing: "0.04em",
            color: BRASS,
          }}
        >
          {line}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Spectral", data: spectral, style: "normal", weight: 200 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
