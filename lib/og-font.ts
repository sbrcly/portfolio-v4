// Fetches a glyph-subset TTF from Google Fonts for next/og ImageResponse.
// Runs at build time only: the generated images are static files.
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+"
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(
    /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/
  )?.[1];
  if (!fontUrl) {
    throw new Error(`Could not resolve a font URL for ${family} ${weight}`);
  }
  const res = await fetch(fontUrl);
  if (!res.ok) {
    throw new Error(`Failed to download font ${family} ${weight}`);
  }
  return res.arrayBuffer();
}
