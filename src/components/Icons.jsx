const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export function StarIcon({ filled = false }) {
  return (
    <svg {...base} fill={filled ? 'currentColor' : 'none'}>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...base}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg {...base}>
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg {...base}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg {...base}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg {...base}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ExternalIcon() {
  return (
    <svg {...base}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function CommentIcon() {
  return (
    <svg {...base}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

/** Знак застосунку: півсонця над лінією обрію. */
export function BrandMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M5 21a11 11 0 0 1 22 0Z" fill="currentColor" />
      <rect x="3" y="24" width="26" height="2.6" rx="1.3" fill="currentColor" opacity="0.5" />
      <rect x="8" y="28.4" width="16" height="2" rx="1" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...base} width="16" height="16">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function DropIcon() {
  return (
    <svg {...base} width="14" height="14">
      <path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3Z" />
    </svg>
  );
}
