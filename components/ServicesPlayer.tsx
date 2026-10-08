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

type FilterKey = "sunday-service" | "sunday-school" | "wednesday-night" | "all";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "sunday-service", label: "Sunday Service" },
  { key: "sunday-school", label: "Sunday School" },
  { key: "wednesday-night", label: "Wednesday Night" },
  { key: "all", label: "All Streams" },
];

const ARCHIVE_LIMIT = 6;

const LEADING_DATE = /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+)$/;

/** Split "10/04/26 Sunday Service" into { date: "10/04/26", name: "Sunday Service" }. */
function splitDatedTitle(title: string): { date: string; name: string } | null {
  const match = title.match(LEADING_DATE);
  return match ? { date: match[1], name: match[2] } : null;
}

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
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
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
                  ? `inline-flex w-full items-center justify-center gap-2 rounded-sm border-2 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors sm:w-auto ${
                      isSelected
                        ? "border-red-800 bg-red-600"
                        : "border-red-700 bg-red-600 hover:bg-red-700"
                    }`
                  : `inline-flex w-full items-center justify-center rounded-sm border px-4 py-2 text-center text-sm font-semibold transition-colors sm:w-auto ${
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
          <div className="mx-auto grid max-w-sm auto-rows-fr grid-cols-2 gap-2 pb-2 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3">
            {filtered.slice(0, ARCHIVE_LIMIT).map((sermon) => {
              const isSelected = !showLive && current?.youtubeId === sermon.youtubeId;
              const dated = splitDatedTitle(sermon.title);
              return (
                <button
                  key={sermon.youtubeId}
                  type="button"
                  onClick={() => setActive(sermon)}
                  className={`flex w-full shrink-0 items-center justify-center rounded-sm border px-2 py-2.5 text-center transition-colors odd:last:col-span-2 sm:block sm:w-auto sm:px-4 sm:py-3 sm:text-left ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white text-gray-800 hover:border-primary hover:text-primary"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {dated ? (
                      <>
                        {/* Phones: date over name. sm+: unchanged single line. */}
                        <span className="block sm:inline">{dated.date}</span>{" "}
                        <span className="block sm:inline">{dated.name}</span>
                      </>
                    ) : (
                      sermon.title
                    )}
                  </span>
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
