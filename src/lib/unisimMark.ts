// A compact UNI·SIM monogram used in two places inside generated QR codes:
//
//   1. As the default centre logo, when the user hasn't uploaded their own.
//   2. As the optional corner attribution stamp, when the user HAS uploaded a
//      brand logo (so their logo owns the centre and the UNI·SIM mark sits
//      modestly in the bottom-right).
//
// It's a white rounded tile with the orange "US" mark so it reads cleanly
// knocked out of the surrounding QR modules. Explicit width/height keep it from
// rendering at zero size when drawn to a <canvas> from a data URI.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect x="1.5" y="1.5" width="61" height="61" rx="15" fill="#ffffff"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="15" fill="none" stroke="#e2e8f0" stroke-width="3"/>
  <text x="32" y="43" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-weight="800" font-size="30" letter-spacing="-1.5" fill="#ea580c">US</text>
</svg>`

/** UNI·SIM monogram as an inline SVG data URI (self-contained, no network). */
export const UNISIM_MARK = `data:image/svg+xml,${encodeURIComponent(SVG)}`
