import type { MetadataRoute } from "next";

// TODO: replace with the real production domain before deploying.
const BASE_URL = "https://scottbarclay.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/work/prava",
    "/work/incognito-wraps",
    "/experience",
    "/about",
    "/connect",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/work/prava" ? 0.9 : 0.6,
  }));
}
