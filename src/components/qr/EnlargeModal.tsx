import { useEffect, useState } from 'react'
import type { QrConfig } from '@unisim/qr'
import { qrDisplayName } from '@unisim/qr'
import { renderPngDataUrl } from '../../lib/download'
import { fillsWholeImage } from '@unisim/qr'

// Renders the QR big and bright, filling the screen, so it's easy to scan from
// another phone. A few hints help when a scan won't take.
const ENLARGE_SIZE = 900

export default function EnlargeModal({ config, onClose }: { config: QrConfig; onClose: () => void }) {
  const [png, setPng] = useState<string | null>(null)

  // A real PNG in an <img>, not a live <canvas>. On a phone that is the whole
  // point of this modal: long-pressing an image offers Save to Photos / Share /
  // the preview sheet, and it can be dragged out on desktop. A canvas offers
  // none of that — the code was on screen but the user could do nothing with it.
  // `renderPngDataUrl` is the export path, so the pixels here (shaped plate,
  // corner stamp and all) are exactly what Download would have given them.
  useEffect(() => {
    let cancelled = false
    setPng(null)
    renderPngDataUrl(config, ENLARGE_SIZE)
      .then((url) => { if (!cancelled) setPng(url) })
      .catch(() => { /* nothing to show; the modal stays blank rather than lying */ })
    return () => { cancelled = true }
  }, [config])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // A behind-the-code star paints its whole square, so the card can carry the
  // design's own background instead of the white a see-through shape needs.
  const shaped = config.frameShape !== 'square' && !fillsWholeImage(config)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-slate-900/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged QR code for ${qrDisplayName(config)}`}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl leading-none text-white hover:bg-white/25"
      >
        ×
      </button>

      {/* Dismiss hints down each side — the whole backdrop is clickable. */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wide text-white/60 sm:left-6">
        Click to dismiss
      </span>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tracking-wide text-white/60 sm:right-6">
        Click to dismiss
      </span>

      {/* Stop clicks on the code itself from closing, so a phone held against
          the screen doesn't dismiss it. */}
      <div
        className="relative w-full max-w-[min(88vw,70vh)] rounded-2xl p-4 shadow-lg ring-1 ring-slate-200"
        style={{ background: config.bgTransparent || shaped ? '#ffffff' : config.bgColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Square by CSS: the PNG resolves asynchronously, and an auto-height
            box would collapse and then pop the card open under it. */}
        <div className="aspect-square w-full leading-[0]">
          {png && (
            <img
              src={png}
              alt={`QR code for ${qrDisplayName(config)}`}
              className="block h-full w-full"
            />
          )}
        </div>
      </div>

      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-white">Point another phone's camera at this code</p>
        <p className="mt-1 text-xs text-white/70">
          Struggling? Turn your screen brightness up to max, and make sure the camera
          isn't in close-up (macro) mode — pull back a little so the whole code is in frame.
        </p>
        <p className="mt-1 text-xs text-white/70">
          On a phone, press and hold the code to save or share it as an image.
        </p>
      </div>
    </div>
  )
}
