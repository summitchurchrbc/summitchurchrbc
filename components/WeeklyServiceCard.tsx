import Image from "next/image";
import { ServiceScheduleList } from "@/components/ServiceScheduleList";
import type { WeeklyService } from "@/lib/types";

interface WeeklyServiceCardProps {
  service: WeeklyService;
}

export function WeeklyServiceCard({ service }: WeeklyServiceCardProps) {
  return (
    <article className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[5/3] bg-gray-100">
        <Image
          src={service.image}
          alt={service.category}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h2 className="absolute bottom-4 left-4 font-serif text-2xl font-semibold text-white">
          {service.category}
        </h2>
      </div>
      <ServiceScheduleList items={service.items} />
    </article>
  );
}