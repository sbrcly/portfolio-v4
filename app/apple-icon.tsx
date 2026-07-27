import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function AppleIcon() {
  const schibsted = await loadGoogleFont("Schibsted Grotesk", 700, "SB");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf8f4",
          color: "#141310",
          fontFamily: "Schibsted Grotesk",
          fontWeight: 700,
          fontSize: 88,
          letterSpacing: "-0.01em",
        }}
      >
        SB
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
      ],
    }
  );
}
