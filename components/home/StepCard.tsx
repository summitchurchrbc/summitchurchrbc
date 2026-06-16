import { Button } from "@/components/ui/Button";
import { LiveWatchCta } from "@/components/LiveWatchCta";
import type { NextStepCard, Sermon, YouTubeConfig } from "@/lib/types";
import { StepIcon } from "./StepIcons";
import { WatchOnlineEmbed } from "./WatchOnlineEmbed";

interface StepCardProps {
  card: NextStepCard;
  latestService?: Sermon;
  youtube?: YouTubeConfig;
}

export function StepCard({ card, latestService, youtube }: StepCardProps) {
  return (
    <article className="flex h-full flex-col rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-primary">
        <StepIcon name={card.icon} />
      </div>

      <h3 className="font-serif text-lg font-semibold text-navy">{card.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{card.description}</p>

      {card.showEmbed && latestService && youtube && (
        <div className="my-4">
          <WatchOnlineEmbed latestService={latestService} youtube={youtube} />
        </div>
      )}

      <div className="mt-4">
        {card.id === "watch-online" ? (
          <LiveWatchCta href={card.href} offlineText={card.buttonText} variant="card" />
        ) : (
          <Button href={card.href} variant="primary" size="md" className="w-full text-center">
            {card.buttonText}
          </Button>
        )}
      </div>
    </article>
  );
}