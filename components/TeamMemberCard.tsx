import Image from "next/image";
import type { TeamMember } from "@/lib/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const width = member.imageWidth ?? 834;
  const height = member.imageHeight ?? 1250;

  return (
    <article className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
      <div className="bg-gray-50">
        <Image
          src={member.image}
          alt={member.name}
          width={width}
          height={height}
          className="block h-auto w-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 md:p-5">
        <h3 className="font-serif text-lg font-semibold">{member.name}</h3>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
          {member.role}
        </p>
        <p className="text-sm leading-relaxed text-gray-700 md:text-[15px]">{member.bio}</p>
      </div>
    </article>
  );
}