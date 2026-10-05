import type { Metadata } from "next";

/**
 * What every page says of itself to a share card besides its title, its
 * description and its image. A page that names its own image says this
 * again: one segment's openGraph replaces another's whole.
 */
export const OPEN_GRAPH = {
  siteName: "Scott Barclay",
  type: "website",
  locale: "en_US",
} satisfies Metadata["openGraph"];
