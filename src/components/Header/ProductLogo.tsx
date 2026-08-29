// GENERATED FILE — do not edit by hand.
// Source: backoffice/universal-platform/scripts/app-marks/marks.mjs
// Regenerate: node scripts/app-marks/build.mjs (from backoffice/universal-platform)
// Mark: Universal QR — Three finder rings and the data between them.
// Hover: The three finder centres light up in turn, then the payload module answers.
//
// Icon-only by design: the SDK's UniversalAppsNavBar renders the product name
// from its catalogue beside this slot, so a wordmark here would print it twice.

const CSS = `
  /* Resting states */
  .uam-qr-eye1 { opacity: 0.25; transition: opacity .2s ease 0s; }
  .uam-qr-eye2 { opacity: 0.25; transition: opacity .2s ease .09s; }
  .uam-qr-eye3 { opacity: 0.25; transition: opacity .2s ease .18s; }
  .uam-qr-eye4 { opacity: 0.25; transition: opacity .2s ease .3s; }

  /* Active states */
  .uam-host-qr:hover .uam-qr-eye1,
  .uam-host-qr:focus-visible .uam-qr-eye1 { opacity: 1; }
  .uam-host-qr:hover .uam-qr-eye2,
  .uam-host-qr:focus-visible .uam-qr-eye2 { opacity: 1; }
  .uam-host-qr:hover .uam-qr-eye3,
  .uam-host-qr:focus-visible .uam-qr-eye3 { opacity: 1; }
  .uam-host-qr:hover .uam-qr-eye4,
  .uam-host-qr:focus-visible .uam-qr-eye4 { opacity: 1; }

  @media (prefers-reduced-motion: reduce) {
    .uam-qr-eye1,
    .uam-qr-eye2,
    .uam-qr-eye3,
    .uam-qr-eye4 { transition: none !important; }
  }
`

export default function ProductLogo() {
  return (
    <span
      className="uam-host-qr inline-flex h-6 w-6 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="uam-nav-qr-tile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fe8c01" />
            <stop offset="1" stopColor="#e05504" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#uam-nav-qr-tile)" />
        <path d="M10 10h16v16H10zM14 14v8h8v-8z" fillRule="evenodd" fill="#ffffff" />
        <path d="M38 10h16v16H38zM42 14v8h8v-8z" fillRule="evenodd" fill="#ffffff" />
        <path d="M10 38h16v16H10zM14 42v8h8v-8z" fillRule="evenodd" fill="#ffffff" />
        <rect x={16} y={16} width={4} height={4} fill="#ffffff" className="uam-qr-eye1" />
        <rect x={44} y={16} width={4} height={4} fill="#ffffff" className="uam-qr-eye2" />
        <rect x={16} y={44} width={4} height={4} fill="#ffffff" className="uam-qr-eye3" />
        <rect x={32} y={14} width={4} height={4} fill="#ffffff" />
        <rect x={32} y={22} width={4} height={4} fill="#ffffff" />
        <rect x={32} y={32} width={4} height={4} fill="#ffffff" />
        <rect x={40} y={32} width={4} height={4} fill="#ffffff" />
        <rect x={48} y={32} width={4} height={4} fill="#ffffff" />
        <rect x={32} y={40} width={4} height={4} fill="#ffffff" />
        <rect x={40} y={40} width={4} height={4} fill="#ffffff" />
        <rect x={40} y={48} width={4} height={4} fill="#ffffff" />
        <rect x={48} y={48} width={4} height={4} fill="#ffffff" />
        <rect x={48} y={40} width={4} height={4} fill="#ffffff" className="uam-qr-eye4" />
      </svg>
    </span>
  )
}
