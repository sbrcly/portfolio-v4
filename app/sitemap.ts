import type { MetadataRoute } from "next";

const BASE_URL = "https://scottbarclay.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work/prava"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.9,
  }));
}
