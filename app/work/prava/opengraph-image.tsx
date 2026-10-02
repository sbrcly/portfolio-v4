import { OG_SIZE, ogImage } from "@/lib/og-image";

const TITLE = "Prava";
const LINE = "An iOS app, designed, built, and shipped alone.";

export const alt = `${TITLE} · ${LINE}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage(TITLE, LINE);
}
