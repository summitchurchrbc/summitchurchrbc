import type { Metadata } from "next";
import { getSiteConfig } from "./content";

interface PageMeta {
  title: string;
  description?: string;
  path: string;
  image?: string;
}

export function buildMetadata({ title, description, path, image }: PageMeta): Metadata {
  const site = getSiteConfig();
  const fullTitle = title === "Home" ? `${site.name} - ${site.location}` : `${title} | ${site.name}`;
  const desc = description ?? site.description;
  const url = `${site.url}${path}`;
  const ogImage = image ?? `${site.url}/images/hero/summit-church-cover.webp`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(site.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: `${site.name} - ${site.location}`,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    verification: {
      google: site.verification.google,
      other: { "msvalidate.01": site.verification.bing },
    },
  };
}