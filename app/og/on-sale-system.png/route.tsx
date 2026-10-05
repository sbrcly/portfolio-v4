import { diagramImage } from "@/lib/og-diagram";

// Made once, at build time.
export const dynamic = "force-static";

/**
 * The on-sale system's share image: the venue loop's still, 1200 by 630.
 * The one share image on the site that is a picture. The system has no
 * page, and a link to its employer's block (/#employer-02) is a link to
 * the home page, whose card it shares; so no page names this image yet.
 */
export function GET() {
  return diagramImage("on-sale-system-still");
}
