"use client";

interface FacebookEmbedProps {
  url: string;
  title: string;
}

export function FacebookEmbed({ url, title }: FacebookEmbedProps) {
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-sm bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full border-0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
      />
    </div>
  );
}