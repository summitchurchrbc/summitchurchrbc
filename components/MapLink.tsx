"use client";

import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import {
  isMobileDevice,
  resolveMobileMapUrl,
  webUrlToMapDestination,
  type MapDestination,
} from "@/lib/maps";

type MapLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  webUrl: string;
  lat?: number;
  lng?: number;
  label?: string;
  address?: string;
};

export function MapLink({
  webUrl,
  lat,
  lng,
  label,
  address,
  target,
  rel = "noopener noreferrer",
  children,
  ...props
}: MapLinkProps) {
  const destination: MapDestination = { web: webUrl, lat, lng, label, address };
  const [href, setHref] = useState(webUrl);
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (!isMobileDevice()) {
      setHref(webUrl);
      setOpenInNewTab(true);
      return;
    }

    const resolved = webUrlToMapDestination(webUrl, label);
    const mobileDestination: MapDestination = {
      web: webUrl,
      lat: lat ?? resolved.lat,
      lng: lng ?? resolved.lng,
      label: label ?? resolved.label,
      address: address ?? resolved.address,
    };

    setHref(resolveMobileMapUrl(mobileDestination));
    setOpenInNewTab(false);
  }, [webUrl, lat, lng, label, address]);

  return (
    <a
      href={href}
      target={target ?? (openInNewTab ? "_blank" : undefined)}
      rel={openInNewTab ? rel : undefined}
      {...props}
    >
      {children}
    </a>
  );
}