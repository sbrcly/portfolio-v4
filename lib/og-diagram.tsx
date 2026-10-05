import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadGoogleFont } from "./og-font";
import { OG_SIZE } from "./og-image";

// Where JetBrains Mono's baseline sits in a line as tall as its size, from
// the line's top: the font's ascent, less half of what its own line height
// (1.32) has over 1.
const BASELINE = 0.86;

const decode = (text: string) =>
  text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");

/**
 * A drawing from public/diagrams as a share image: the file as it is, at
 * the card's size. The drawing's shapes are rasterized as an image, which
 * has no fonts; its text is set over them here, in JetBrains Mono, where
 * each text element puts it. So the drawing's text must be plain text
 * elements under no transform, as the still's are.
 */
export async function diagramImage(name: string) {
  const source = await readFile(
    join(process.cwd(), "public", "diagrams", `${name}.svg`),
    "utf8"
  );
  // The rasterizer knows no CSS variables: each gives way to its fallback.
  const literal = source.replace(/var\(--[\w-]+, ([^)]+)\)/g, "$1");

  const texts = [...literal.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)].map(
    ([, attributes, content]) => {
      const attribute = (key: string) =>
        new RegExp(`(?:^| )${key}="([^"]*)"`).exec(attributes)?.[1];
      return {
        x: Number(attribute("x")),
        y: Number(attribute("y")),
        size: Number(attribute("font-size")),
        fill: attribute("fill"),
        spacing: Number(attribute("letter-spacing") ?? 0),
        middle: attribute("text-anchor") === "middle",
        content: decode(content),
      };
    }
  );
  const shapes = literal.replace(/<text [^>]*>[^<]*<\/text>\n?/g, "");

  const mono = await loadGoogleFont(
    "JetBrains Mono",
    400,
    texts.map(({ content }) => content).join("")
  );

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={`data:image/svg+xml;base64,${Buffer.from(shapes).toString("base64")}`}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
        />
        {texts.map(({ x, y, size, fill, spacing, middle, content }, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: y - size * BASELINE,
              display: "flex",
              // Text anchored at its middle is centered in a box that is.
              ...(middle
                ? {
                    left: x - OG_SIZE.width,
                    width: OG_SIZE.width * 2,
                    justifyContent: "center",
                  }
                : { left: x }),
              fontFamily: "JetBrains Mono",
              fontSize: size,
              lineHeight: 1,
              letterSpacing: spacing,
              whiteSpace: "nowrap",
              color: fill,
            }}
          >
            {content}
          </div>
        ))}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "JetBrains Mono", data: mono, style: "normal", weight: 400 }],
    }
  );
}
