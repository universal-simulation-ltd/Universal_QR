import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { QrConfig } from '@unisim/qr'
import { qrDisplayName } from '@unisim/qr'
import { enlargedPngDataUrl } from '../../lib/download'
import { fillsWholeImage } from '@unisim/qr'

// Renders the QR big and bright, filling the screen, so it's easy to scan from
// another phone. A few hints help when a scan won't take.

/** The pixel size to render the enlarged code at.
 *
 *  ⚠️ Was a flat 900. The card below is `max-w-[min(88vw,70vh)]` inside `p-4`,
 *  so on a phone 900 px is roughly twice what the screen can resolve — and the
 *  cost of an export is quadratic in this number, so the half nobody could see
 *  was most of the wait. Sizing to the box the code actually lands in is the
 *  same picture for a fraction of the encode.
 *
 *  Still capped at 900 so a desktop retina display is no worse off than before,
 *  and floored at 512 so a small or oddly-shaped viewport can't produce a code
 *  too coarse for another phone's camera to take.
 *
 *  Pure function of the viewport, deliberately: `prewarmEnlarged` and the modal
 *  both call it and must agree, or the head start renders at one size and the
 *  modal asks for another and the cache misses. */
export function enlargeSize(): number {
  if (typeof window === 'undefined') return 900
  const box = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.7) - 32
  return Math.max(512, Math.min(900, Math.round(box * (window.devicePixelRatio || 1))))
}

/** Start rendering the enlarged PNG before the modal exists.
 *
 *  Call it on `pointerdown`. The render is the long pole and it used to begin
 *  only after the click had flipped state, React had committed the portal and
 *  the effect had run — several frames of the delay spent doing nothing. The
 *  result is memoised on the config, so the modal's own request lands on the
 *  same promise. Failures are swallowed here and re-surfaced by the modal. */
export function prewarmEnlarged(config: QrConfig): void {
  enlargedPngDataUrl(config, enlargeSize()).catch(() => {})
}

/** A stand-in for the enlarged code, taken from the preview canvas that is
 *  already on screen, so the modal has something to show on its first frame
 *  instead of an empty square.
 *
 *  Downscaled to 192 px before encoding on purpose: this runs synchronously
 *  inside the click handler, and a `toDataURL` of the full 512 px preview would
 *  put exactly the kind of encode we are trying to get rid of on the main
 *  thread at the worst possible moment. 192 px is ~14x less pixel work and,
 *  blown back up, reads as the right code arriving soft rather than as nothing.
 *
 *  Returns null rather than throwing for anything unexpected — a missing
 *  placeholder is the old behaviour, which is fine. */
export function placeholderFromPreview(holder: HTMLElement | null): string | null {
  const source = holder?.querySelector('canvas')
  if (!source || !source.width) return null
  try {
    const small = document.createElement('canvas')
    small.width = 192
    small.height = 192
    const ctx = small.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(source, 0, 0, 192, 192)
    return small.toDataURL('image/png')
  } catch {
    // A tainted canvas (a logo loaded cross-origin) can't be read back.
    return null
  }
}

export default function EnlargeModal({
  config,
  onClose,
  placeholder = null,
}: {
  config: QrConfig
  onClose: () => void
  /** Low-res stand-in from `placeholderFromPreview`, shown until the real
   *  render lands. */
  placeholder?: string | null
}) {
  const [png, setPng] = useState<string | null>(null)
  // Fixed for the life of the modal: recomputing on a rotate would throw away a
  // finished render to produce a barely different one.
  const [size] = useState(enlargeSize)

  // A real PNG in an <img>, not a live <canvas>. On a phone that is the whole
  // point of this modal: long-pressing an image offers Save to Photos / Share /
  // the preview sheet, and it can be dragged out on desktop. A canvas offers
  // none of that — the code was on screen but the user could do nothing with it.
  // `enlargedPngDataUrl` wraps the export path, so the pixels here (shaped
  // plate, corner stamp and all) are exactly what Download would have given
  // them.
  useEffect(() => {
    let cancelled = false
    setPng(null)
    enlargedPngDataUrl(config, size)
      .then((url) => { if (!cancelled) setPng(url) })
      .catch(() => { /* nothing to show; the modal falls back to the placeholder
                        or stays blank rather than lying */ })
    return () => { cancelled = true }
  }, [config, size])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // A behind-the-code star paints its whole square, so the card can carry the
  // design's own background instead of the white a see-through shape needs.
  const shaped = config.frameShape !== 'square' && !fillsWholeImage(config)

  // ⚠️ Rendered into <body>, not where it is written.
  //
  // `z-[1100]` only beats the navbar's inline `z-index: 1000` while the two are
  // in the SAME stacking context. Universal QR's pinned mobile preview is a
  // `sticky z-40` wrapper, which IS a stacking context — so a modal rendered
  // inside it was capped at z-40 whatever its own class said, and the navbar
  // painted over the top of it, including over the Close button in the corner.
  // A portal takes the modal out of every ancestor's stacking context, so the
  // z-index means what it says wherever the trigger happens to live.
  return createPortal(
    <div
      // ⚠️ z-[1100], not z-50. <UniversalAppsNavBar /> sets an INLINE
      // `zIndex: 1000` — Tailwind's scale stops at z-50 and an inline style
      // beats a class anyway — and the bar is only `position: relative`, so it
      // is on screen whenever the page is at scroll top. At z-50 it stayed
      // brightly lit on top of this backdrop AND covered the Close button in
      // the corner, leaving no visible way out of the overlay.
      // ⚠️ No `backdrop-blur-sm`, and the scrim is /85 rather than /80 to make
      // up the difference. A backdrop-filter on a `fixed inset-0` element makes
      // the compositor snapshot and blur the ENTIRE viewport behind it — which
      // here includes the page's live QR canvas — before it can paint the modal
      // at all, and repeat it per frame. Cheap on desktop and on WKWebView,
      // genuinely slow on Android's WebView, where it was a visible part of the
      // "nothing happens when I tap" delay. At 85% opacity there is nothing
      // legible left to blur anyway.
      className="fixed inset-0 z-[1100] flex flex-col items-center justify-center gap-5 bg-slate-900/85 p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged QR code for ${qrDisplayName(config)}`}
    >
      {/* Offset by the safe-area inset so the Close button clears the Dynamic
          Island in the full-screen Capacitor WKWebView. 0 in a browser. */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl leading-none text-white hover:bg-white/25"
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
            box would collapse and then pop the card open under it.

            The placeholder is drawn into the same <img> the real render will
            take over, so the swap is a src change rather than a mount — no
            reflow, no flash of the card's background between the two. Only the
            finished render is offered for long-press save: `png` gates the alt
            text and the aria-busy, so a screen reader is not told a soft
            stand-in is "the QR code for X" while it is still being made. */}
        <div className="aspect-square w-full leading-[0]">
          {(png ?? placeholder) && (
            <img
              src={png ?? placeholder ?? undefined}
              alt={png ? `QR code for ${qrDisplayName(config)}` : ''}
              aria-busy={png ? undefined : true}
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
    </div>,
    document.body,
  )
}
