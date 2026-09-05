import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

// Valor conhecido em build, necessário para o export estático.
export const dynamic = "force-static";

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
    {
      url: `${siteUrl}/contato`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
