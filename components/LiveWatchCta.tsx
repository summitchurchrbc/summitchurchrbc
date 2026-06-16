"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LivePulseDot } from "@/components/LivePulseDot";
import { PREVIEW_LIVE_BADGES } from "@/lib/live-preview";
import { useYouTubeLiveStatus } from "@/lib/useYouTubeLiveStatus";

type LiveWatchCtaVariant = "hero" | "card";

interface LiveWatchCtaProps {
  href: string;
  offlineText: string;
  variant: LiveWatchCtaVariant;
}

export function LiveWatchCta({ href, offlineText, variant }: LiveWatchCtaProps) {
  const status = useYouTubeLiveStatus();
  const isLive = PREVIEW_LIVE_BADGES || (status?.isLive ?? false);

  const heroClasses = "inline-flex w-full items-center justify-center text-center sm:w-auto";
  const cardClasses = "inline-flex w-full items-center justify-center text-center";

  if (isLive) {
    const liveClasses =
      variant === "hero"
        ? `gap-2 rounded-sm border-2 border-red-700 bg-red-600 px-8 py-3 text-base font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-red-700 ${heroClasses}`
        : `gap-2 rounded-sm border-2 border-red-700 bg-red-600 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-red-700 ${cardClasses}`;

    return (
      <Link href={href} className={liveClasses} aria-label="Watch Summit Church live">
        <LivePulseDot />
        <span>Watch Live Now</span>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Button href={href} variant="dark" size="lg" className={heroClasses}>
        {offlineText}
      </Button>
    );
  }

  return (
    <Button href={href} variant="primary" size="md" className={cardClasses}>
      {offlineText}
    </Button>
  );
}