interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageSection({ children, className = "" }: PageSectionProps) {
  return (
    <div className={`px-5 py-8 md:px-10 md:py-10 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}