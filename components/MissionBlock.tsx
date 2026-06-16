interface MissionBlockProps {
  children: React.ReactNode;
}

export function MissionBlock({ children }: MissionBlockProps) {
  return (
    <section className="px-5 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-3xl text-center text-base leading-relaxed text-gray-800 md:text-lg">
        {children}
      </div>
    </section>
  );
}