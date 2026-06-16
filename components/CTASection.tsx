import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  quote: string;
  buttonText: string;
  buttonHref: string;
}

export function CTASection({ quote, buttonText, buttonHref }: CTASectionProps) {
  return (
    <section className="bg-primary px-5 py-14 text-center text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-xl leading-relaxed tracking-wide md:text-2xl lg:text-3xl">
          {quote}
        </h2>
        <div className="mt-10">
          <Button href={buttonHref} variant="outline" size="xl">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}