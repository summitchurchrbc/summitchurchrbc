"use client";

interface YouTubeChannelLiveEmbedProps {
  channelId: string;
  title?: string;
}

export function YouTubeChannelLiveEmbed({ channelId, title = "Live stream" }: YouTubeChannelLiveEmbedProps) {
  const embedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&rel=0&modestbranding=1`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-sm bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}