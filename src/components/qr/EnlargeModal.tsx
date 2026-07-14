import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { QrConfig } from '../../lib/qr'
import { buildQrOptions, cornerStampGeometry, qrDisplayName, showsCornerMark } from '../../lib/qr'
import { UNISIM_MARK } from '../../lib/unisimMark'

// Renders the QR big and bright, filling the screen, so it's easy to scan from
// another phone. A few hints help when a scan won't take.
const ENLARGE_SIZE = 900

export default function EnlargeModal({ config, onClose }: { config: QrConfig; onClose: () => void }) {
  const holderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const qr = new QRCodeStyling(buildQrOptions({ ...config, size: ENLARGE_SIZE }))
    if (holderRef.current) {
      holderRef.current.innerHTML = ''
      qr.append(holderRef.current)
      const canvas = holderRef.current.querySelector('canvas')
      if (canvas) {
        canvas.style.width = '100%'
        canvas.style.height = 'auto'
        canvas.style.display = 'block'
      }
    }
  }, [config])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const stamp = showsCornerMark(config)
  const { badge, inset } = cornerStampGeometry(ENLARGE_SIZE, config.margin)
  const badgePct = (badge / ENLARGE_SIZE) * 100
  const insetPct = (inset / ENLARGE_SIZE) * 100

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
        style={{ background: config.bgTransparent ? '#ffffff' : config.bgColor }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative leading-[0]">
          <div ref={holderRef} role="img" aria-label={`QR code for ${qrDisplayName(config)}`} />
          {stamp && (
            <div
              aria-hidden="true"
              className="absolute aspect-square rounded-lg bg-white p-[8%] shadow-md ring-1 ring-black/5"
              style={{ width: `${badgePct}%`, right: `${insetPct}%`, bottom: `${insetPct}%` }}
            >
              <img src={UNISIM_MARK} alt="" className="h-full w-full object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-white">Point another phone's camera at this code</p>
        <p className="mt-1 text-xs text-white/70">
          Struggling? Turn your screen brightness up to max, and make sure the camera
          isn't in close-up (macro) mode — pull back a little so the whole code is in frame.
        </p>
      </div>
    </div>
  )
}
