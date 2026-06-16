export interface SiteConfig {
  name: string;
  tagline: string;
  location: string;
  description: string;
  headerQuote: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    place: string;
  };
  phone: string;
  email: string;
  serviceTimes: Array<{ name: string; time: string; note: string }>;
  social: { facebook: string; youtube: string };
  giveUrl: string;
  googleMapsEmbed: string;
  googleMapsUrl: string;
  mapCoordinates: { lat: number; lng: number };
  analyticsId: string;
  verification: { google: string; bing: string };
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export type ServiceCategory = "sunday-service" | "sunday-school" | "other";

export interface Sermon {
  id: number;
  title: string;
  slug: string;
  date: string;
  publishedAt?: string;
  youtubeId: string;
  youtubeUrl: string;
  category: ServiceCategory;
}

export interface YouTubeConfig {
  channelId: string;
  channelHandle: string;
  channelUrl: string;
  liveUrl: string;
  streamsUrl: string;
}

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  title?: string;
  checkedAt: string;
  scheduledCheck?: boolean;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  bio: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface HeroSlide {
  image: string;
}

export interface ServiceItem {
  name: string;
  time: string;
  note?: string;
  group?: "kids";
}

export interface WeeklyService {
  id: string;
  category: string;
  image: string;
  items: ServiceItem[];
}

export interface MinistryProgram {
  id: string;
  name: string;
  audience: string;
  schedule: string;
  note?: string;
  details?: Array<{ label: string; value: string; href?: string }>;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  imageMobile?: string;
  imageMobileWidth?: number;
  imageMobileHeight?: number;
  imageDesktop?: string;
  imageDesktopWidth?: number;
  imageDesktopHeight?: number;
}

export interface ProgramsConfig {
  locationIntro: string;
  weeklyServices: WeeklyService[];
  ministries: MinistryProgram[];
  summitChurchSchool: MinistryProgram;
  contact: { email: string; visitNote: string };
}

export interface HomeCta {
  text: string;
  href: string;
}

export interface HomeWelcome {
  heading: string;
  paragraphs: string[];
  highlights: string[];
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface NextStepCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  buttonText: string;
  showEmbed?: boolean;
}

export interface WhatToExpectItem {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface HomeContent {
  hero: {
    welcomeHeading: string;
    serviceLine: string;
    primaryCta: HomeCta;
    secondaryCta: HomeCta;
    logoAlt: string;
  };
  welcome: HomeWelcome;
  nextSteps: {
    heading: string;
    subheading: string;
    cards: NextStepCard[];
  };
  planYourVisit: {
    heading: string;
    intro: string;
    whatToExpect: WhatToExpectItem[];
    kidsIntro: string;
    learnMore: {
      heading: string;
      subheading: string;
      links: Array<{ title: string; description: string; href: string }>;
    };
    bottomCta: HomeCta;
  };
  testimonials: Testimonial[];
  quoteFeature: Quote;
  cta: {
    quote: string;
    buttonText: string;
    buttonHref: string;
  };
}