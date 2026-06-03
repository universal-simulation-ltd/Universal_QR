// Universal QR brand icon — icon-only by design. The SDK's UniversalAppsNavBar
// renders the product name from its catalogue beside this slot, so adding a
// wordmark here would duplicate it. App.tsx passes productHomeHref so the SDK
// wraps logo+name in a single home-link.
export default function ProductLogo() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-orange-600 text-white"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
        <path d="M1.5 1.5h5v5h-5zM3 3v2h2V3z" fillRule="evenodd" />
        <path d="M9.5 1.5h5v5h-5zM11 3v2h2V3z" fillRule="evenodd" />
        <path d="M1.5 9.5h5v5h-5zM3 11v2h2v-2z" fillRule="evenodd" />
        <rect x="9" y="9" width="2" height="2" />
        <rect x="13" y="9" width="1.5" height="2" />
        <rect x="9" y="13" width="2" height="1.5" />
        <rect x="12.5" y="12.5" width="2" height="2" />
      </svg>
    </span>
  )
}
