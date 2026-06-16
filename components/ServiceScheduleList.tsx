import type { ServiceItem } from "@/lib/types";

interface ServiceScheduleListProps {
  items: ServiceItem[];
  showKidsGroup?: boolean;
  className?: string;
}

export function ServiceScheduleList({
  items,
  showKidsGroup = true,
  className = "",
}: ServiceScheduleListProps) {
  return (
    <ul className={`divide-y divide-gray-100 ${className}`.trim()}>
      {items.map((item, index) => {
        const previous = items[index - 1];
        const showKidsHeader =
          showKidsGroup && item.group === "kids" && previous?.group !== "kids";

        return (
          <li key={item.name}>
            {showKidsHeader && (
              <div className="border-t border-gold/15 bg-cream/50 px-5 py-2.5 first:border-t-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Kids Ministry
                </p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
              </div>
              <p className="shrink-0 text-right font-medium text-primary">{item.time}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}