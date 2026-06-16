import Link from "next/link";
import { MapLink } from "@/components/MapLink";
import { getSiteConfig } from "@/lib/content";
import { getChurchMapDestination } from "@/lib/maps";

export function ServiceInfoBar() {
  const site = getSiteConfig();
  const worship = site.serviceTimes.find((s) => s.name === "Worship Service");
  const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
  const churchMaps = getChurchMapDestination();

  return (
    <section className="border-b border-gold/20 bg-cream px-5 py-5 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Join Us Sunday
          </p>
          <p className="font-serif text-lg font-semibold text-navy md:text-xl">
            {worship?.time ?? "10:30 AM"} Worship
          </p>
          <p className="text-sm text-gray-700">
            {site.address.place} · {fullAddress}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <MapLink
            webUrl={churchMaps.web}
            lat={churchMaps.lat}
            lng={churchMaps.lng}
            label={churchMaps.label}
            address={churchMaps.address}
            className="rounded-sm border border-navy/15 bg-white px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-primary hover:text-primary"
          >
            Get Directions
          </MapLink>
          <Link
            href="/service-times"
            className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Service Times
          </Link>
        </div>
      </div>
    </section>
  );
}