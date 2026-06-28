"use client";

import { useMemo, useState } from "react";
import type { Sermon } from "@/lib/types";
import { PREVIEW_LIVE_BADGES } from "@/lib/live-preview";
import { useSermons } from "@/lib/useSermons";
import { useYouTubeLiveStatus } from "@/lib/useYouTubeLiveStatus";
import { LivePulseDot } from "./LivePulseDot";
import { YouTubeChannelLiveEmbed } from "./YouTubeChannelLiveEmbed";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface ServicesPlayerProps {
  sermons: Sermon[];
  channelId: string;
  channelUrl: string;
}

type FilterKey = "sunday-service" | "sunday-school" | "all";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "sunday-service", label: "Sunday Service" },
  { key: "sunday-school", label: "Sunday School" },
  { key: "all", label: "All Streams" },
];

const ARCHIVE_LIMIT = 6;

export function ServicesPlayer({ sermons, channelId, channelUrl }: ServicesPlayerProps) {
  const syncedSermons = useSermons(sermons);
  const liveStatus = useYouTubeLiveStatus();
  const isLive = PREVIEW_LIVE_BADGES || (liveStatus?.isLive ?? false);

  const [filter, setFilter] = useState<FilterKey>("sunday-service");
  const filtered = useMemo(() => {
    if (filter === "all") return syncedSermons;
    return syncedSermons.filter((sermon) => sermon.category === filter);
  }, [filter, syncedSermons]);

  const [active, setActive] = useState<Sermon | null>(null);
  const defaultSermon = filtered[0] ?? null;
  const showLive = isLive && active === null;
  const current = active ?? defaultSermon;

  if (!syncedSermons.length) {
    return (
      <div className="rounded-sm bg-gray-100 px-6 py-16 text-center text-gray-600">
        <p>Service videos will appear here after syncing from YouTube.</p>
        <p className="mt-2 text-sm">
          Run <code className="rounded bg-gray-200 px-2 py-1">npm run sync:youtube</code> to
          import streams.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((item) => {
          const isAllStreams = item.key === "all";
          const showAsLive = isLive && isAllStreams;
          const isSelected = filter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setFilter(item.key);
                setActive(null);
              }}
              className={
                showAsLive
                  ? `inline-flex items-center gap-2 rounded-sm border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors ${
                      isSelected
                        ? "border-red-800 bg-red-600"
                        : "border-red-700 bg-red-600 hover:bg-red-700"
                    }`
                  : `rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:border-primary hover:text-primary"
                    }`
              }
            >
              {showAsLive && <LivePulseDot />}
              {showAsLive ? "Live" : item.label}
            </button>
          );
        })}
      </div>

      {showLive || current ? (
        <div className="mx-auto max-w-4xl space-y-3">
          {showLive ? (
            <>
              <YouTubeChannelLiveEmbed
                channelId={channelId}
                title={liveStatus?.title ?? "Live Sunday Service"}
              />
              <p className="text-center text-sm text-gray-600">
                {liveStatus?.title ?? "Live Sunday Service"}
              </p>
            </>
          ) : current ? (
            <>
              <YouTubeEmbed videoId={current.youtubeId} title={current.title} />
              <p className="text-center text-sm text-gray-600">{current.title}</p>
            </>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-gray-600">No videos in this category yet.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-3 pb-2">
            {filtered.slice(0, ARCHIVE_LIMIT).map((sermon) => {
              const isSelected = !showLive && current?.youtubeId === sermon.youtubeId;
              return (
                <button
                  key={sermon.youtubeId}
                  type="button"
                  onClick={() => setActive(sermon)}
                  className={`shrink-0 rounded-sm border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white text-gray-800 hover:border-primary hover:text-primary"
                  }`}
                >
                  <span className="block text-sm font-semibold">{sermon.title}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-sm">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              View full stream history on YouTube
            </a>
          </p>
        </div>
      )}
    </div>
  );
}