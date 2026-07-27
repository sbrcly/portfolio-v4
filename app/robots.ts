import type { MetadataRoute } from "next";

// TODO: replace with the real production domain before deploying.
const BASE_URL = "https://scottbarclay.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
