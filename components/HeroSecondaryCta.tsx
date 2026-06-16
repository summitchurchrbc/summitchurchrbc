import { LiveWatchCta } from "@/components/LiveWatchCta";

interface HeroSecondaryCtaProps {
  href: string;
  offlineText: string;
}

export function HeroSecondaryCta({ href, offlineText }: HeroSecondaryCtaProps) {
  return <LiveWatchCta href={href} offlineText={offlineText} variant="hero" />;
}