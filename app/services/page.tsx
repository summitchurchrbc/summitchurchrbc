import { BreadcrumbJsonLd, JsonLd } from "@/components/JsonLd";
import { PageSection } from "@/components/PageSection";
import { ServicesPlayer } from "@/components/ServicesPlayer";
import { buildMetadata } from "@/lib/seo";
import {
  getLatestSundayService,
  getSermons,
  getSiteConfig,
  getYouTubeConfig,
} from "@/lib/content";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Watch past worship services and Sunday School streams from Summit Church in Rainbow City, AL on YouTube.",
  path: "/services",
});

export default function ServicesPage() {
  const sermons = getSermons();
  const site = getSiteConfig();
  const youtube = getYouTubeConfig();
  const latestService = getLatestSundayService();
  const featured = latestService;

  const videoJsonLd = featured
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: featured.title,
        description: `Worship service from ${site.name}`,
        uploadDate: featured.publishedAt ?? featured.date,
        embedUrl: `https://www.youtube.com/embed/${featured.youtubeId}`,
        contentUrl: featured.youtubeUrl,
        publisher: {
          "@type": "Organization",
          name: site.name,
        },
      }
    : null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      {videoJsonLd && <JsonLd data={videoJsonLd} />}

      <PageSection>
        <h1 className="mb-3 text-center font-serif text-3xl font-semibold md:text-4xl">
          Past Services
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-base text-gray-700 md:text-lg">
          Everyone is welcome here. Missed a Sunday? Watch our Sunday Service and Sunday School
          streams from YouTube.
        </p>

        <ServicesPlayer
          sermons={sermons}
          channelId={youtube.channelId}
          channelUrl={youtube.streamsUrl}
        />
      </PageSection>
    </>
  );
}