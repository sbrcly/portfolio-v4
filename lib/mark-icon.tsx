import { ImageResponse } from "next/og";
import { loadGoogleFont } from "./og-font";

// Palette, from app/tokens.css.
const GROUND = "#121A16";
const TEXT = "#E4DBCB";
const BRASS = "#E0AE62";

/**
 * The SB mark: two brass verticals flanking "SB" in JetBrains Mono, a tick
 * above and below, on the ground color. It is drawn at 12px type with 18px
 * verticals and 5px ticks; `unit` is one of those pixels at this icon's
 * scale, and strokes never go below one whole pixel.
 */
export async function markIcon(size: number, unit: number) {
  const mono = await loadGoogleFont("JetBrains Mono", 400, "SB");
  const stroke = Math.max(1, Math.round(unit));
  const type = Math.round(12 * unit);
  const tracking = 0.14 * type;

  const tick = (
    <div
      style={{ width: stroke, height: Math.round(5 * unit), background: BRASS }}
    />
  );
  const vertical = (
    <div
      style={{ width: stroke, height: Math.round(18 * unit), background: BRASS }}
    />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: GROUND,
        }}
      >
        {tick}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: `${Math.round(3 * unit)}px 0`,
          }}
        >
          {vertical}
          <div
            style={{
              display: "flex",
              // The tracking after the last letter is taken back so the
              // letters sit centered between the verticals.
              margin: `0 ${Math.round(7 * unit - tracking)}px 0 ${Math.round(7 * unit)}px`,
              fontFamily: "JetBrains Mono",
              fontSize: type,
              lineHeight: 1,
              letterSpacing: tracking,
              color: TEXT,
            }}
          >
            SB
          </div>
          {vertical}
        </div>
        {tick}
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
