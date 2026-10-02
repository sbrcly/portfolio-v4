import type { MetadataRoute } from "next";

const BASE_URL = "https://scottbarclay.dev";
// Set by hand when the content of the site changes.
const LAST_MODIFIED = new Date("2026-10-02");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work/prava"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.9,
  }));
}
