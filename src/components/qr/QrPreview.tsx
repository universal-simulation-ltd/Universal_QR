import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { useQrStore } from '../../stores/qrStore'
import { buildQrOptions, cornerStampGeometry, qrDisplayName, showsCornerMark } from '../../lib/qr'
import { composeShapedCanvas } from '../../lib/compose'
import { UNISIM_MARK } from '../../lib/unisimMark'
import EnlargeModal from './EnlargeModal'

export default function QrPreview() {
  const config = useQrStore((s) => s.config)
  const holderRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const [enlarged, setEnlarged] = useState(false)

  const hasData = config.data.trim().length > 0

  function handlePreviewClick() {
    if (!hasData) return
    setEnlarged(true)
  }

  const shaped = config.frameShape !== 'square'

  // Create the instance once. It is deliberately NOT appended here — the render
  // effect below owns the holder's contents.
  //
  // ⚠️ Appending on mount painted the plain SQUARE code, unstyled, at its full
  // `config.size` (512 px) inside a card that is at most 360 px wide, and left
  // it there until the async composite resolved. On a shaped preset — and every
  // load deals a random one, so Star or Circle most visits — that read as the
  // QR flashing up oversized and then snapping into the plate, made worse by
  // `qr-pop` fading the wrong frame in over 320 ms.
  useEffect(() => {
    qrRef.current = new QRCodeStyling(buildQrOptions(config))
    return () => {
      qrRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render on any config change and keep the canvas responsive.
  //
  // Two paths on purpose. A square code stays on the library's own live canvas,
  // updated in place — synchronous, no flicker while typing a URL, and exactly
  // what shipped. A shaped code has to be composited (plate + inset code), which
  // is async, so it swaps the holder's contents for a canvas we drew ourselves.
  // The `cancelled` latch matters: keystrokes queue several composites and the
  // last one to *finish* is not necessarily the last one *asked for*.
  useEffect(() => {
    function style(canvas: HTMLCanvasElement) {
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      canvas.style.maxWidth = `${config.size}px`
      canvas.style.display = 'block'
    }

    if (!shaped) {
      // The holder is showing the library's own canvas only if it has been
      // appended and not since replaced. On first paint it is empty; coming back
      // from a shaped design it holds OUR canvas with the library's detached, and
      // updating that would repaint something nobody can see. Either way,
      // (re-)append before updating.
      const live = holderRef.current?.querySelector('canvas:not([data-composed])')
      if (!live && holderRef.current && qrRef.current) {
        holderRef.current.innerHTML = ''
        qrRef.current.append(holderRef.current)
      }
      qrRef.current?.update(buildQrOptions(config))
      const canvas = holderRef.current?.querySelector('canvas')
      if (canvas) style(canvas)
      return
    }

    let cancelled = false
    composeShapedCanvas(config, config.size)
      .then((canvas) => {
        if (cancelled || !holderRef.current) return
        canvas.dataset.composed = 'true'
        style(canvas)
        holderRef.current.innerHTML = ''
        holderRef.current.appendChild(canvas)
      })
      .catch(() => { /* a transient bad config (e.g. empty data) — keep the last frame */ })
    return () => { cancelled = true }
  }, [config, shaped])

  // For a shaped code the stamp is already painted into the composed canvas
  // (it has to be — it sits inside the plate, not the image corner), so the DOM
  // overlay below would double it up.
  const stamp = showsCornerMark(config) && !shaped
  const { badge, inset } = cornerStampGeometry(config.size, config.margin)
  const badgePct = (badge / config.size) * 100
  const insetPct = (inset / config.size) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        // A shaped code needs the checker behind it too, even with an opaque
        // plate colour: painting that same colour on the square card behind the
        // circle would fill the corners back in and hide the silhouette.
        className={`relative w-full max-w-[360px] rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 group ${
          config.bgTransparent || shaped ? 'checker-bg' : ''
        } ${hasData ? 'cursor-pointer' : ''}`}
        style={config.bgTransparent || shaped ? undefined : { background: config.bgColor }}
        onClick={handlePreviewClick}
        role={hasData ? 'button' : undefined}
        tabIndex={hasData ? 0 : undefined}
        aria-label={hasData ? 'Enlarge QR code for scanning' : undefined}
        onKeyDown={(e) => {
          if (hasData && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handlePreviewClick()
          }
        }}
      >
        {/* Tight wrapper so the corner-stamp % coordinates line up with the canvas */}
        <div className="relative leading-[0] qr-pop">
          {/* Square by CSS, not by its contents: a shaped design composites
              asynchronously, so the holder is briefly empty on first paint and
              an auto-height box would collapse and then pop the card open. */}
          <div
            ref={holderRef}
            className="w-full aspect-square"
            aria-label={`QR code for ${qrDisplayName(config)}`}
            role="img"
          />

          {stamp && (
            <div
              aria-hidden="true"
              className="absolute aspect-square rounded-lg shadow-md ring-1 ring-black/5 bg-white p-[8%]"
              style={{
                width: `${badgePct}%`,
                right: `${insetPct}%`,
                bottom: `${insetPct}%`
              }}
            >
              <img src={UNISIM_MARK} alt="" className="w-full h-full object-contain" />
            </div>
          )}

          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/85 backdrop-blur-sm text-center px-6">
              <p className="text-sm text-slate-500">
                Enter a URL or some text to generate your QR code.
              </p>
            </div>
          )}

          {hasData && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/70 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-md">
                <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10.5 10.5 L14 14 M7 5 V9 M5 7 H9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Tap to enlarge
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="text-center min-w-0 max-w-[360px]">
        <div className="font-semibold text-slate-900 truncate">{qrDisplayName(config)}</div>
        {hasData && (
          <div className="text-xs text-slate-500 truncate" title={config.data}>
            {config.data}
          </div>
        )}
      </div>

      {enlarged && <EnlargeModal config={config} onClose={() => setEnlarged(false)} />}
    </div>
  )
}
