import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageSection } from "@/components/PageSection";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { buildMetadata } from "@/lib/seo";
import { getTeam } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Who We Are",
  description:
    "Meet the team at Summit Church in Rainbow City, AL — a church that feels like home, preaches Jesus, pursues freedom and loves all people.",
  path: "/about",
});

export default function AboutPage() {
  const { mission, story, members } = getTeam();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Who We Are", path: "/about" },
        ]}
      />

      <PageSection>
        <h1 className="mb-6 text-center font-serif text-3xl font-semibold text-gray-900 md:text-4xl">
          Who We Are
        </h1>

        <section className="mx-auto mb-8 max-w-3xl">
          <h2 className="mb-3 font-serif text-xl font-semibold md:text-2xl">Our Mission</h2>
          <p className="text-base leading-relaxed text-gray-800 md:text-lg">{mission}</p>
        </section>

        <section className="mx-auto mb-10 max-w-3xl">
          <h2 className="mb-4 font-serif text-xl font-semibold md:text-2xl">Our Story</h2>
          <div className="space-y-3 text-base leading-relaxed text-gray-800 md:text-lg">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-center font-serif text-xl font-semibold md:text-2xl">
            Meet the Team
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-gray-700 md:text-lg">
            Our Spirit-led team is here to lead you and help you on your journey to becoming one
            with Holy Spirit.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <TeamMemberCard key={member.slug} member={member} />
            ))}
          </div>
        </section>
      </PageSection>
    </>
  );
}