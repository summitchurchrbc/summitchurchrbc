export function LivePulseDot({ className = "h-2.5 w-2.5" }: { className?: string }) {
  return (
    <span className={`relative flex shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
      <span className="relative inline-flex h-full w-full rounded-full bg-white" />
    </span>
  );
}