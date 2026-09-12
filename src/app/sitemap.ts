import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return Object.values(siteConfig.routes).map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
  }));
}
