import { getSiteConfig } from "@/lib/content";

export interface MapDestination {
  web: string;
  lat?: number;
  lng?: number;
  label?: string;
  address?: string;
}

const MAPS_URL_PATTERN = /google\.com\/maps|maps\.google/i;

export function isMapsWebUrl(url: string): boolean {
  return MAPS_URL_PATTERN.test(url);
}

export function webUrlToMapDestination(webUrl: string, label?: string): MapDestination {
  const destination: MapDestination = { web: webUrl, label };

  try {
    const url = new URL(webUrl);
    const query =
      url.searchParams.get("query") ??
      url.searchParams.get("q") ??
      url.searchParams.get("destination");

    const ll = url.searchParams.get("ll");
    if (ll) {
      const [lat, lng] = ll.split(",").map(Number);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        destination.lat = lat;
        destination.lng = lng;
      }
    }

    if (query) {
      destination.address = query;
    }
  } catch {
    // keep web-only destination
  }

  return destination;
}

export function getChurchMapDestination(): MapDestination {
  const site = getSiteConfig();
  const address = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

  return {
    web: site.googleMapsUrl,
    lat: site.mapCoordinates.lat,
    lng: site.mapCoordinates.lng,
    label: site.name,
    address,
  };
}

/** Mobile-friendly URL that opens the device maps app (Apple Maps on iOS). */
export function resolveMobileMapUrl(destination: MapDestination): string {
  const { web, lat, lng, label, address } = destination;
  const placeName = label ?? "Location";
  const placeAddress = address ?? label ?? "";

  if (typeof navigator === "undefined") {
    return web;
  }

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isIOS) {
    if (lat != null && lng != null) {
      return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(placeName)}`;
    }
    if (placeAddress) {
      return `https://maps.apple.com/?address=${encodeURIComponent(placeAddress)}`;
    }
  }

  if (isAndroid) {
    if (lat != null && lng != null) {
      return `geo:${lat},${lng}?q=${encodeURIComponent(placeName)}`;
    }
    if (placeAddress) {
      return `geo:0,0?q=${encodeURIComponent(placeAddress)}`;
    }
  }

  return web;
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}