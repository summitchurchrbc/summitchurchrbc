import siteJson from "@/content/site.json";
import heroJson from "@/content/hero.json";
import quotesJson from "@/content/quotes.json";
import teamJson from "@/content/team.json";
import servicesJson from "@/content/services.json";
import programsJson from "@/content/programs.json";
import homeJson from "@/content/home.json";
import youtubeJson from "@/content/youtube.json";
import type {
  HeroSlide,
  HomeContent,
  ProgramsConfig,
  Quote,
  Sermon,
  ServiceCategory,
  SiteConfig,
  TeamMember,
  YouTubeConfig,
} from "./types";

export function getSiteConfig(): SiteConfig {
  return siteJson as SiteConfig;
}

export function getNavItems(): Array<{
  label: string;
  href: string;
  external?: boolean;
  mobileLabel?: string;
}> {
  const site = getSiteConfig();
  return [
    { label: "WELCOME HOME", href: "/" },
    { label: "PLAN YOUR VISIT", href: "/plan-your-visit" },
    { label: "WHO WE ARE", href: "/about" },
    { label: "WATCH SERVICES", href: "/services" },
    { label: "TITHE/GIVE", href: site.giveUrl, external: true },
    { label: "CONNECT WITH US", href: "/service-times" },
    { label: "CONTACT", href: "/contact" },
  ];
}

export function getHeroSlides(): HeroSlide[] {
  return (heroJson as { slides: HeroSlide[] }).slides;
}

export function getQuotes(): {
  quotes: Quote[];
  cta: { quote: string; buttonText: string; buttonHref: string };
} {
  return quotesJson as {
    quotes: Quote[];
    cta: { quote: string; buttonText: string; buttonHref: string };
  };
}

export function getTeam(): { mission: string; story: string[]; members: TeamMember[] } {
  return teamJson as { mission: string; story: string[]; members: TeamMember[] };
}

export function getYouTubeConfig(): YouTubeConfig {
  return youtubeJson as YouTubeConfig;
}

export function getSermons(category?: ServiceCategory): Sermon[] {
  const data = servicesJson as { sermons: Sermon[] };
  const sorted = [...data.sermons].sort((a, b) => {
    const aTime = a.publishedAt ?? a.date;
    const bTime = b.publishedAt ?? b.date;
    return bTime.localeCompare(aTime);
  });
  if (!category) return sorted;
  return sorted.filter((sermon) => sermon.category === category);
}

export function getPrograms(): ProgramsConfig {
  return programsJson as ProgramsConfig;
}

export function getHomeContent(): HomeContent {
  return homeJson as HomeContent;
}

export function getLatestSundayService(): Sermon {
  const services = getSermons("sunday-service");
  if (services[0]) return services[0];
  return getSermons()[0];
}

export const homeIntro =
  "Summit Church is a Christ centered, Hope-filled community of believers, who exist to declare the promises of our Father who called us out of darkness into His marvelous light. We desire to see the power of love that comes from true Kingdom culture operating through the heart of every born-again believer. We believe that true revival looks like healthy marriages, thriving families and true friendships.";