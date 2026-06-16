"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HeroSecondaryCta } from "@/components/HeroSecondaryCta";
import { getHeroSlides, getHomeContent } from "@/lib/content";
import { Button } from "@/components/ui/Button";

const slides = getHeroSlides();
const home = getHomeContent();

export function HeroSlider() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 7000 })]);

  return (
    <div>
      <section className="relative h-[440px] overflow-hidden md:h-[540px]" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.image} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

              <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 text-center text-white md:pb-10">
                <div className="flex flex-col items-center gap-3">
                  <h1 className="hero-welcome-heading font-serif text-4xl font-bold tracking-[0.08em] text-white sm:text-5xl md:text-6xl">
                    {home.hero.welcomeHeading}
                  </h1>
                  <p className="rounded-full bg-black/35 px-4 py-2 text-sm font-medium tracking-wide text-white/95 backdrop-blur-sm sm:text-base">
                    {home.hero.serviceLine}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-b border-gray-100 bg-white px-5 py-6 md:px-10">
        <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-8">
          <Button
            href={home.hero.primaryCta.href}
            variant="primary"
            size="lg"
            className="inline-flex w-full items-center justify-center text-center sm:w-auto"
          >
            {home.hero.primaryCta.text}
          </Button>
          <HeroSecondaryCta
            href={home.hero.secondaryCta.href}
            offlineText={home.hero.secondaryCta.text}
          />
        </div>
      </div>
    </div>
  );
}