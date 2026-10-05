import { diagramImage } from "@/lib/og-diagram";

// Made once, at build time.
export const dynamic = "force-static";

/**
 * The on-sale system's share image: the venue loop's still, 1200 by 630.
 * The one share image on the site that is a picture. The system has no
 * page of its own (a link to /#employer-02 is a link to the home page,
 * whose card it shares); the pages of its three projects share this
 * (components/work/employers).
 */
export function GET() {
  return diagramImage("on-sale-system-still");
}
