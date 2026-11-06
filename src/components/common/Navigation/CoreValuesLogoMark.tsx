export default function CoreValuesLogoMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" className="stroke-ref-color-brand-primary fill-white/10" strokeWidth="2" />
      <path
        d="M20 29.5c-5.2-4.4-9.5-8.2-9.5-13 0-3.3 2.5-5.8 5.8-5.8 1.6 0 3 .6 3.7 1.8.8-1.2 2.2-1.8 3.8-1.8 3.2 0 5.7 2.5 5.7 5.8 0 4.8-4.3 8.6-9.5 13Z"
        className="fill-none stroke-white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d="M20 29.5V12.5M15 23.5c2.4-.7 4.1-2.1 5-4.1 1 2 2.7 3.4 5 4.1"
        className="stroke-ref-color-brand-primary fill-none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="20" cy="12.5" r="2.4" className="fill-ref-color-brand-primary" />
    </svg>
  );
}
