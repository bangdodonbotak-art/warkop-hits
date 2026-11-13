import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.siteUrl,
      lastModified: new Date("2026-11-13"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
