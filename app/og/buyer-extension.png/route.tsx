import { diagramImage } from "@/lib/og-diagram";

// Made once, at build time.
export const dynamic = "force-static";

/**
 * The buyer extension's share image: the hero loop's still, 1200 by 630.
 * The one share image on the site that is a picture; the Featured page
 * names it in place of its card (components/work/employers).
 */
export function GET() {
  return diagramImage("buyer-extension-still");
}
