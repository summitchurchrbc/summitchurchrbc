import Image from "next/image";
import { getHomeContent } from "@/lib/content";

function highlightPhrases(text: string, phrases: string[]) {
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const isHighlight = phrases.some((p) => p.toLowerCase() === part.toLowerCase());
    if (isHighlight) {
      return (
        <strong key={i} className="font-semibold text-primary">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export function WelcomeSection() {
  const { welcome } = getHomeContent();
  const width = welcome.imageWidth ?? 1200;
  const height = welcome.imageHeight ?? 802;

  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="mb-5 font-serif text-2xl font-semibold text-navy md:text-3xl">
            {welcome.heading}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-gray-700 md:text-lg">
            {welcome.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{highlightPhrases(paragraph, welcome.highlights)}</p>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-gray-200 shadow-md">
          <Image
            src={welcome.image}
            alt={welcome.imageAlt}
            width={width}
            height={height}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}