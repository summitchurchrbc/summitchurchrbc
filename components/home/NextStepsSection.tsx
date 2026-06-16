import { getHomeContent, getLatestSundayService, getYouTubeConfig } from "@/lib/content";
import { StepCard } from "./StepCard";

export function NextStepsSection() {
  const { nextSteps } = getHomeContent();
  const latestService = getLatestSundayService();
  const youtube = getYouTubeConfig();

  return (
    <section className="bg-surface/40 px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl font-semibold text-navy md:text-3xl">
            {nextSteps.heading}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base text-gray-600">{nextSteps.subheading}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nextSteps.cards.map((card) => (
            <StepCard
              key={card.id}
              card={card}
              latestService={card.showEmbed ? latestService : undefined}
              youtube={card.showEmbed ? youtube : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}