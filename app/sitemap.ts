import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const base = site.url;

  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/plan-your-visit", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/service-times", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}