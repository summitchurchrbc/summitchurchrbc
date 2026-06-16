import { getSiteConfig } from "@/lib/content";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const site = getSiteConfig();
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Church"],
    name: `${site.name} ${site.location}`,
    url: site.url,
    description: site.description,
    logo: `${site.url}/images/logo.webp`,
    sameAs: [site.social.facebook, site.social.youtube],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
  };
  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const site = getSiteConfig();
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.name} - ${site.location}`,
    url: site.url,
    description: site.tagline,
    publisher: { "@type": "Organization", name: site.name },
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  const site = getSiteConfig();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
  return <JsonLd data={data} />;
}