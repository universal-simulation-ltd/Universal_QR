import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { useQrStore } from '../../stores/qrStore'
import { buildQrOptions, cornerStampGeometry, qrDisplayName, showsCornerMark } from '../../lib/qr'
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

  // Create the instance once and mount its canvas into the holder.
  useEffect(() => {
    const qr = new QRCodeStyling(buildQrOptions(config))
    qrRef.current = qr
    if (holderRef.current) {
      holderRef.current.innerHTML = ''
      qr.append(holderRef.current)
    }
    return () => {
      qrRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-render on any config change and keep the canvas responsive.
  useEffect(() => {
    qrRef.current?.update(buildQrOptions(config))
    const canvas = holderRef.current?.querySelector('canvas')
    if (canvas) {
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      canvas.style.maxWidth = `${config.size}px`
      canvas.style.display = 'block'
    }
  }, [config])

  const stamp = showsCornerMark(config)
  const { badge, inset } = cornerStampGeometry(config.size, config.margin)
  const badgePct = (badge / config.size) * 100
  const insetPct = (inset / config.size) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative w-full max-w-[360px] rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 group ${
          config.bgTransparent ? 'checker-bg' : ''
        } ${hasData ? 'cursor-pointer' : ''}`}
        style={config.bgTransparent ? undefined : { background: config.bgColor }}
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
          <div ref={holderRef} aria-label={`QR code for ${qrDisplayName(config)}`} role="img" />

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
