import Link from "next/link";
import { MapLink } from "@/components/MapLink";
import { getSiteConfig } from "@/lib/content";
import { getChurchMapDestination } from "@/lib/maps";

const site = getSiteConfig();

export function Footer() {
  const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
  const churchMaps = getChurchMapDestination();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-serif text-lg font-semibold text-white">Visit Us</h3>
            <p className="text-base">{site.address.place}</p>
            <p className="text-base">
              <MapLink
                webUrl={churchMaps.web}
                lat={churchMaps.lat}
                lng={churchMaps.lng}
                label={churchMaps.label}
                address={churchMaps.address}
                className="inline-block py-1 hover:text-white hover:underline"
              >
                {fullAddress}
              </MapLink>
            </p>
            <p className="mt-2 text-base">Sunday Mornings at 10:30 a.m.</p>
          </div>

          <div>
            <h3 className="mb-3 font-serif text-lg font-semibold text-white">Stay Connected</h3>
            <ul className="space-y-1 text-base">
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 hover:text-white"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 hover:text-white"
                >
                  YouTube
                </a>
              </li>
              <li>
                <Link href="/contact" className="inline-block py-2 hover:text-white">
                  Contact Us or Request Prayer
                </Link>
              </li>
              <li>
                <a
                  href={site.giveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 hover:text-white"
                >
                  Give Online
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {site.name} — {site.location}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}