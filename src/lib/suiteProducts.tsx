import { DEFAULT_UNIVERSAL_APPS_PRODUCTS, type SuiteProduct } from '@unisim/sdk'

// Indigo QR glyph for the suite switcher — a 22×22 tile (on a 32-unit canvas)
// with three finder patterns and a scatter of data modules, matching the visual
// language of the other product glyphs baked into the SDK.
const QR_GLYPH = (
  <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#4f46e5" />
    {/* Three finder patterns: white square, indigo knockout, white centre dot */}
    {[
      [6, 6],
      [18, 6],
      [6, 18]
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width="8" height="8" rx="1.4" fill="#fff" />
        <rect x={x + 1.6} y={y + 1.6} width="4.8" height="4.8" rx="0.8" fill="#4f46e5" />
        <rect x={x + 3} y={y + 3} width="2" height="2" fill="#fff" />
      </g>
    ))}
    {/* Data modules in the open (bottom-right) quadrant */}
    <g fill="#fff">
      <rect x="18" y="18" width="2.6" height="2.6" />
      <rect x="22.4" y="18" width="2.6" height="2.6" />
      <rect x="18" y="22.4" width="2.6" height="2.6" />
      <rect x="22.4" y="22.4" width="2.6" height="2.6" />
      <rect x="20.2" y="20.2" width="2.6" height="2.6" />
    </g>
  </svg>
)

/** The Universal QRs entry in the suite product switcher. */
export const QR_PRODUCT: SuiteProduct = {
  id: 'qr',
  name: 'Universal QRs',
  desc: 'Design branded, styled QR codes in-browser',
  href: 'https://opensource.unisim.co.uk/qr',
  glyph: QR_GLYPH
}

// Full catalogue shown in the navbar dropdown: the canonical Universal Apps,
// with the QR generator slotted in after Universal Exports. The SDK's default
// list doesn't yet include QRs, so we extend it here rather than wait for an
// SDK release.
export const SUITE_PRODUCTS: SuiteProduct[] = (() => {
  const out = [...DEFAULT_UNIVERSAL_APPS_PRODUCTS]
  const exportsIdx = out.findIndex((p) => p.id === 'exports')
  const insertAt = exportsIdx === -1 ? out.length : exportsIdx + 1
  out.splice(insertAt, 0, QR_PRODUCT)
  return out
})()
