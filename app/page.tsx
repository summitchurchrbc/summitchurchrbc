import { HeroSlider } from "@/components/HeroSlider";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { NextStepsSection } from "@/components/home/NextStepsSection";
import { TestimonialCards } from "@/components/home/TestimonialCards";
import { CTASection } from "@/components/CTASection";
import { getHomeContent } from "@/lib/content";

export default function HomePage() {
  const { cta } = getHomeContent();

  return (
    <>
      <HeroSlider />
      <WelcomeSection />
      <NextStepsSection />
      <TestimonialCards />
      <CTASection quote={cta.quote} buttonText={cta.buttonText} buttonHref={cta.buttonHref} />
    </>
  );
}