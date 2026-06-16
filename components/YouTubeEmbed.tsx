"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

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