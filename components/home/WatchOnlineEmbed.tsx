"use client";

import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import type { Sermon, YouTubeConfig } from "@/lib/types";

interface WatchOnlineEmbedProps {
  latestService: Sermon;
  youtube: YouTubeConfig;
}

export function WatchOnlineEmbed({ latestService, youtube }: WatchOnlineEmbedProps) {
  return (
    <div className="space-y-2">
      <YouTubeEmbed videoId={latestService.youtubeId} title={latestService.title} />
      <p className="text-center text-xs text-gray-500">
        Latest: {latestService.title}.{" "}
        <a
          href={youtube.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Watch live on YouTube
        </a>
      </p>
    </div>
  );
}