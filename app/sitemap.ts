import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

// A one-page site: the sitemap lists the home page, with the build time as its last change.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
