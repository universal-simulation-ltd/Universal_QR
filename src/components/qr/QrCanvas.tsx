import { useEffect, useRef } from 'react'
import { renderQrCanvas, type QrDesign } from '@unisim/qr'

// A QR code drawn the way it will actually export — shaped plate, decoration
// and corner stamp included.
//
// ⚠️ It exists because the Dynamic tab did NOT do that. Both of its previews
// (the branding panel and each code's card) built `new QRCodeStyling(...)` and
// appended it, which is the library's plain square render — so picking **Star**
// in the branding chips set `frameShape: 'star'` on the design, saved it, and
// showed a plain square code at every size. The style looked broken; it was
// only ever invisible. Same for Circle and Hexagon, and for the burst
// decoration.
//
// `renderQrCanvas` is the shared composite from `@unisim/qr`, and it is
// deliberately the one used here rather than `composeShapedCanvas`: it takes
// square designs too (the plate and decoration steps become no-ops, verified
// pixel-identical to the plain render), so there is no shape test at this call
// site to get wrong the next time a shape is added. That is Universal PDF's
// policy, and the reason its renderer never drifted the way this one did.
//
// The main studio's `QrPreview` keeps its own two-path version on purpose —
// a square code there stays on the library's live canvas and is updated in
// place, so typing a URL doesn't flicker. Nothing here is typed into.
export default function QrCanvas({
  config,
  size,
  margin,
  label,
  className,
}: {
  config: QrDesign
  size: number
  margin: number
  label: string
  className?: string
}) {
  const holderRef = useRef<HTMLDivElement>(null)
  // Redraw on any change to the look or the payload. Serialising is what the
  // studio's preview does too — a design is a flat bag of scalars plus one data
  // URL, and the object identity changes on every keystroke upstream.
  const key = JSON.stringify({ ...config, size, margin })

  useEffect(() => {
    let cancelled = false
    renderQrCanvas({ ...config, size, margin }, size)
      .then((canvas) => {
        // Several renders can be in flight; the last to FINISH is not
        // necessarily the last one asked for.
        if (cancelled || !holderRef.current) return
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        canvas.style.display = 'block'
        holderRef.current.innerHTML = ''
        holderRef.current.appendChild(canvas)
      })
      .catch(() => {
        /* A transient unrenderable design (empty payload mid-edit) — keep the
           last good frame rather than blanking the preview. */
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return <div ref={holderRef} role="img" aria-label={label} className={className} />
}
