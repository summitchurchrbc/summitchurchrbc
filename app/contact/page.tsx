import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { PageSection } from "@/components/PageSection";
import { ContactForm } from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Summit Church Rainbow City | 3225 Rainbow Dr, Gadsden Area",
  description:
    "Contact Summit Church in Rainbow City, AL, at Rainbow Plaza, 3225 Rainbow Dr #246. Sunday worship at 10:30 AM. Serving the Gadsden area.",
  path: "/contact",
});

export default function ContactPage() {
  const site = getSiteConfig();
  const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <PageSection>
        <h1 className="mb-4 text-center font-serif text-3xl font-semibold md:text-4xl">
          Contact Us
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-gray-700 md:text-lg">
          Summit Church loves all people! We encourage you to freely and openly worship God in
          whatever way Holy Spirit leads you in our services. We&apos;d love to hear from you and
          will be happy to answer any questions you have.
        </p>

        <div className="mx-auto mb-10 max-w-lg rounded-sm border border-gray-200 bg-surface/30 px-6 py-5 text-center">
          <p className="font-semibold">{site.address.place}</p>
          <p>{fullAddress}</p>
        </div>

        <ContactForm />
      </PageSection>
    </>
  );
}
