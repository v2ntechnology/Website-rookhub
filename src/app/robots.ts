import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

// Valor conhecido em build — necessário para o export estático.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
