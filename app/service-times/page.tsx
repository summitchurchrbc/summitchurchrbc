import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { MinistryCard } from "@/components/MinistryCard";
import { PageSection } from "@/components/PageSection";
import { WeeklyServiceCard } from "@/components/WeeklyServiceCard";
import { buildMetadata } from "@/lib/seo";
import { getPrograms, getSiteConfig } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Connect With Us",
  description:
    "Connect with Summit Church in Rainbow City, AL. Service times, ministries, location, and ways to get involved. Sunday worship at 10:30 AM.",
  path: "/service-times",
});

export default function ServiceTimesPage() {
  const site = getSiteConfig();
  const programs = getPrograms();
  const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Connect With Us", path: "/service-times" },
        ]}
      />

      <PageSection>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="font-serif text-3xl font-semibold md:text-4xl">Connect With Us</h1>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-center font-serif text-xl font-semibold md:text-2xl">
            Weekly Gatherings
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            {programs.weeklyServices.map((service) => (
              <WeeklyServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-2 text-center font-serif text-xl font-semibold md:text-2xl">
            Ministries &amp; Small Groups
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-gray-600 md:text-base">
            Beyond Sunday morning — ways to connect throughout the month.
          </p>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {programs.ministries.map((program) => (
              <MinistryCard key={program.id} program={program} />
            ))}
            <MinistryCard program={programs.summitChurchSchool} imageFit="banner" />
          </div>
        </section>

        <section className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-serif text-xl font-semibold md:text-2xl">
            Visit Us
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-sm border border-gray-200 bg-surface/40 px-5 py-5">
                <h3 className="mb-2 font-semibold text-gray-900">{site.address.place}</h3>
                <p className="text-gray-800">{fullAddress}</p>
              </div>
              <div className="rounded-sm border border-gray-200 bg-surface/40 px-5 py-5">
                <h3 className="mb-2 font-semibold text-gray-900">Contact</h3>
                <p className="text-gray-800">
                  <a
                    href={`mailto:${programs.contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {programs.contact.email}
                  </a>
                </p>
                <p className="mt-2 text-sm text-gray-600">{programs.contact.visitNote}</p>
              </div>
            </div>

            <div className="aspect-video overflow-hidden rounded-sm border border-gray-200">
              <iframe
                src={site.googleMapsEmbed}
                title="Summit Church location map"
                className="h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </PageSection>
    </>
  );
}