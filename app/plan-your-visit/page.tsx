import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { StepIcon } from "@/components/home/StepIcons";
import { PageSection } from "@/components/PageSection";
import { ServiceScheduleList } from "@/components/ServiceScheduleList";
import { buildMetadata } from "@/lib/seo";
import { MapLink } from "@/components/MapLink";
import { getHomeContent, getPrograms, getSiteConfig } from "@/lib/content";
import { getChurchMapDestination } from "@/lib/maps";

export const metadata = buildMetadata({
  title: "Plan Your Visit",
  description:
    "Planning your first visit to Summit Church in Rainbow City, AL? Learn what to expect, service times, parking, kids ministry, and directions.",
  path: "/plan-your-visit",
});

export default function PlanYourVisitPage() {
  const site = getSiteConfig();
  const programs = getPrograms();
  const { planYourVisit } = getHomeContent();
  const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
  const churchMaps = getChurchMapDestination();
  const sundayService = programs.weeklyServices.find((s) => s.id === "sunday");
  const sundayScheduleItems =
    sundayService?.items.filter((item) => item.group !== "kids") ?? [];
  const kidsMinistryItems = sundayService?.items.filter((item) => item.group === "kids") ?? [];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Plan Your Visit", path: "/plan-your-visit" },
        ]}
      />

      <PageSection>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="mb-4 font-serif text-3xl font-semibold text-navy md:text-4xl">
            {planYourVisit.heading}
          </h1>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">{planYourVisit.intro}</p>
        </div>

        <section className="mx-auto mb-12 max-w-4xl rounded-sm border border-gold/20 bg-cream px-6 py-6 text-center md:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Sunday Morning</p>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:justify-center sm:gap-12">
            {sundayScheduleItems.map((item) => (
              <div key={item.name}>
                <p className="font-serif text-2xl font-semibold text-navy md:text-3xl">{item.time}</p>
                <p className="mt-1 text-sm font-medium text-gray-700 md:text-base">{item.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-8 text-center font-serif text-2xl font-semibold text-navy md:text-3xl">
            What to Expect
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {planYourVisit.whatToExpect.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-primary">
                  <StepIcon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {sundayScheduleItems.length > 0 && (
          <section className="mx-auto mb-12 max-w-3xl">
            <h2 className="mb-4 text-center font-serif text-xl font-semibold text-navy md:text-2xl">
              Sunday Schedule
            </h2>
            <ServiceScheduleList
              items={sundayScheduleItems}
              showKidsGroup={false}
              className="rounded-sm border border-gray-200 bg-white"
            />
          </section>
        )}

        {kidsMinistryItems.length > 0 && (
          <section className="mx-auto mb-12 max-w-3xl">
            <h2 className="mb-3 text-center font-serif text-xl font-semibold text-navy md:text-2xl">
              Kids &amp; Families
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-center text-sm leading-relaxed text-gray-700 md:text-base">
              {planYourVisit.kidsIntro}
            </p>
            <ServiceScheduleList
              items={kidsMinistryItems}
              showKidsGroup={false}
              className="rounded-sm border border-gray-200 bg-white"
            />
          </section>
        )}

        <section className="mx-auto mb-12 max-w-5xl">
          <h2 className="mb-6 text-center font-serif text-xl font-semibold text-navy md:text-2xl">
            Find Us
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-sm border border-gray-200 bg-white px-5 py-5">
                <h3 className="mb-2 font-semibold text-gray-900">{site.address.place}</h3>
                <p className="text-gray-800">{fullAddress}</p>
              </div>
              <MapLink
                webUrl={churchMaps.web}
                lat={churchMaps.lat}
                lng={churchMaps.lng}
                label={churchMaps.label}
                address={churchMaps.address}
                className="inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Open in Maps
              </MapLink>
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

        <section className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-navy md:text-3xl">
              {planYourVisit.learnMore.heading}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-base text-gray-600">
              {planYourVisit.learnMore.subheading}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {planYourVisit.learnMore.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-primary"
              >
                <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-primary">
                  {link.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{link.description}</p>
                <p className="mt-4 text-sm font-medium text-primary">Learn more →</p>
              </Link>
            ))}
          </div>
        </section>
      </PageSection>
    </>
  );
}