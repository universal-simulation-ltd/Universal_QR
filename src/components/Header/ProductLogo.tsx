// Universal QRs wordmark — the click target the SuiteSwitcher dropdown attaches
// to inside <UniversalAppsNavBar />.
export default function ProductLogo() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2 text-slate-900 no-underline px-1 py-0.5 rounded-md hover:bg-slate-50"
      aria-label="Universal QRs — home"
    >
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-white">
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true" fill="currentColor">
          <path d="M1.5 1.5h5v5h-5zM3 3v2h2V3z" fillRule="evenodd" />
          <path d="M9.5 1.5h5v5h-5zM11 3v2h2V3z" fillRule="evenodd" />
          <path d="M1.5 9.5h5v5h-5zM3 11v2h2v-2z" fillRule="evenodd" />
          <rect x="9" y="9" width="2" height="2" />
          <rect x="13" y="9" width="1.5" height="2" />
          <rect x="9" y="13" width="2" height="1.5" />
          <rect x="12.5" y="12.5" width="2" height="2" />
        </svg>
      </span>
      <span className="hidden sm:inline font-semibold tracking-tight text-[15px]">
        Universal QRs
      </span>
    </a>
  )
}
