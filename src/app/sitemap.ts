import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/home`, lastModified: new Date() },
    { url: `${siteConfig.url}/whitelist`, lastModified: new Date() },
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
  ];
}
