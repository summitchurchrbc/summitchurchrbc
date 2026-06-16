import Image from "next/image";
import { MapLink } from "@/components/MapLink";
import type { MinistryProgram } from "@/lib/types";
import { isMapsWebUrl } from "@/lib/maps";

interface MinistryCardProps {
  program: MinistryProgram;
  imageFit?: "cover" | "contain" | "banner";
}

export function MinistryCard({ program, imageFit = "cover" }: MinistryCardProps) {
  const width = program.imageWidth ?? 600;
  const height = program.imageHeight ?? 400;
  const isLogo = imageFit === "contain";
  const isBanner = imageFit === "banner";
  const mobileImage = program.imageMobile;
  const desktopImage = program.imageDesktop;
  const hasResponsiveBannerImages = isBanner && mobileImage && desktopImage;

  const imageWrapperClass = isLogo
    ? "flex h-56 items-center justify-center bg-surface/60 p-6"
    : isBanner
      ? "relative h-56 w-full overflow-hidden bg-gray-50 md:overflow-visible md:bg-surface/60"
      : "bg-gray-50";

  const imageClass = isLogo
    ? "max-h-full max-w-full object-contain"
    : isBanner
      ? "block h-56 w-full object-cover object-center md:h-full md:max-h-full md:w-full md:object-contain"
      : "block h-56 w-full object-cover object-center";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
      <div className={imageWrapperClass}>
        {hasResponsiveBannerImages ? (
          <>
            <Image
              src={mobileImage}
              alt={program.name}
              fill
              className="object-cover object-center md:hidden"
              sizes="(max-width: 768px) 100vw, 0px"
            />
            <div className="absolute inset-0 z-10 hidden items-center justify-center md:flex">
              <img
                src={desktopImage}
                alt={program.name}
                className="mx-auto block h-56 w-auto max-w-full object-contain"
              />
            </div>
          </>
        ) : (
          <Image
            src={program.image}
            alt={program.name}
            width={width}
            height={height}
            className={imageClass}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {program.audience}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-gray-900">{program.name}</h3>
        <p className="mt-2 font-medium text-gray-800">{program.schedule}</p>
        {program.note && <p className="mt-1 text-sm text-gray-600">{program.note}</p>}
        {program.details && (
          <dl className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
            {program.details.map((detail) => (
              <div key={detail.label} className="flex gap-2">
                <dt className="shrink-0 font-medium text-gray-700">{detail.label}:</dt>
                <dd className="text-gray-600">
                  {detail.href ? (
                    isMapsWebUrl(detail.href) ? (
                      <MapLink
                        webUrl={detail.href}
                        label={detail.value}
                        className="font-medium text-primary hover:underline"
                      >
                        {detail.value}
                      </MapLink>
                    ) : (
                      <a
                        href={detail.href}
                        target="_blank"
                        className="font-medium text-primary hover:underline"
                        rel="noopener noreferrer"
                      >
                        {detail.value}
                      </a>
                    )
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}