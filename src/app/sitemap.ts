import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/precos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
