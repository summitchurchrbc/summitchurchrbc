export function StepIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  switch (name) {
    case "play":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path fill="currentColor" stroke="none" d="M10 8.5v7l6-3.5z" />
        </svg>
      );
    case "prayer":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" d="M12 3v3M8 6c0 2 1.5 3.5 4 4 2.5-.5 4-2 4-4M7 14c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6" />
          <path strokeLinecap="round" d="M12 10v8M9.5 21h5" />
        </svg>
      );
    case "visit":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "heart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" d="M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "wave":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" d="M7 11c1.5-2 3-2 4.5 0s3 2 4.5 0M4 15c2-3 4-3 6 0s4 3 6 0" />
        </svg>
      );
    case "kids":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="7" r="3" />
          <path strokeLinecap="round" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      );
    case "parking":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path strokeLinecap="round" d="M10 16V8h3a2.5 2.5 0 010 5h-3" />
        </svg>
      );
    case "music":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path strokeLinecap="round" d="M9 18V6l10-2v12" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="16" r="2" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}