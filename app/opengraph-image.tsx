import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

const TITLE = "Scott Barclay";
const SUBTITLE = "Software engineer & founder";

export const alt = `${TITLE} · ${SUBTITLE}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Record system tokens (globals.css): --paper, --ink, --accent
const PAPER = "#faf8f4";
const INK = "#141310";
const ACCENT = "#8f621c";

export default async function Image() {
  const [schibsted, inter] = await Promise.all([
    loadGoogleFont("Schibsted Grotesk", 700, TITLE),
    loadGoogleFont("Inter", 400, SUBTITLE),
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
          padding: "0 100px",
          backgroundColor: PAPER,
        }}
      >
        <div
          style={{
            width: 88,
            height: 3,
            backgroundColor: ACCENT,
            marginBottom: 44,
          }}
        />
        <div
          style={{
            fontFamily: "Schibsted Grotesk",
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: INK,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 38,
            marginTop: 30,
            color: ACCENT,
          }}
        >
          {SUBTITLE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Schibsted Grotesk",
          data: schibsted,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
