import { getHomeContent } from "@/lib/content";

export function TestimonialCards() {
  const { testimonials } = getHomeContent();

  return (
    <section className="bg-cream px-5 py-12 md:px-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center font-serif text-2xl font-semibold text-navy md:text-3xl">
          What People Are Saying
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="rounded-sm border border-gold/20 bg-white p-6 shadow-sm"
            >
              <p className="text-base leading-relaxed text-gray-700">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-gray-100 pt-4">
                <cite className="not-italic">
                  <span className="font-semibold text-navy">{item.name}</span>
                  <span className="text-sm text-gray-500"> · {item.role}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}