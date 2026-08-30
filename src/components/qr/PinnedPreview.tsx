import { useEffect, useRef, useState } from 'react'
import QrPreview from './QrPreview'

/** How far down the page the pinned bar comes to rest.
 *
 *  `UniversalAppsNavBar` is `position: sticky; top: 0` with an inline
 *  `zIndex: 1000`, and its sticky wrapper carries
 *  `paddingTop: env(safe-area-inset-top)` with a matching negative margin — so
 *  in the browser it is 64px tall (a 6px brand strip over a 58px header) and in
 *  the Capacitor build it is 64px PLUS the Dynamic Island inset. Parking at
 *  exactly that height puts the preview immediately under the bar on both.
 *
 *  If the two ever disagree the failure is benign in one direction only: this
 *  bar's z-index is far below the navbar's, so a couple of pixels too high are
 *  simply hidden behind it, where a couple too low would show a hairline of
 *  page background. That is why it is not padded "just in case". */
const PINNED_TOP = 'calc(4rem + env(safe-area-inset-top))'

/**
 * The QR preview, pinned under the nav bar on narrow screens.
 *
 * ## Why this exists
 *
 * On a phone the studio is one column: the controls first, the preview after
 * them. Branding is ~2000px tall and Advanced ~3200px, against an 844px screen
 * — so the moment you touch a colour, a logo or the error correction, the code
 * you are editing is several hundred pixels below the fold. You cannot see what
 * your edits do, which is most of what this app is for.
 *
 * ## Why pinned-in-flow rather than floating over the form
 *
 * The ask was for a *floating* box. A `position: fixed` box would have to park
 * somewhere, and on a 390px-wide screen everywhere is somewhere: top-right sits
 * exactly on the Branding panel's toggle switches, top-left on its labels, and
 * the bottom edge is where iOS puts the keyboard — a bottom-parked preview is
 * hidden the instant you focus the field whose effect you wanted to watch.
 *
 * `position: sticky` gets the same behaviour (the code stays on screen while
 * you scroll the form past it) while covering nothing: it takes its own space
 * in the document, so no control is ever underneath it, there is no z-index
 * fight with the app's dialogs, and it is out of the keyboard's way at the top
 * of the screen rather than in front of it at the bottom.
 *
 * ⚠️ It is deliberately NOT a grid item. A sticky grid item is constrained to
 * its own grid area, which in the studio's single-column mobile layout is just
 * its own height — it would stick for zero pixels and look like it did nothing.
 * It has to be a child of the plain block container that spans the whole studio.
 */
export default function PinnedPreview() {
  const [open, setOpen] = useState(true)
  const barRef = useRef<HTMLDivElement>(null)

  // Publish the bar's height so `index.css` can keep a focused field from being
  // scrolled underneath it. Measured rather than guessed: it changes when the
  // bar is collapsed, and again with the address line's font metrics.
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const write = () =>
      document.documentElement.style.setProperty(
        '--qr-pinned-h',
        `${Math.round(el.getBoundingClientRect().height)}px`,
      )
    write()
    const ro = new ResizeObserver(write)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--qr-pinned-h')
    }
  }, [])

  return (
    <div
      ref={barRef}
      // `bg-slate-100` is the page's own background, and the pt/pb are what the
      // controls scroll *behind* once the bar is stuck — without them the form
      // would slide through the rounded card's corners and the gap below it.
      // z-40 is far under the navbar's inline z-1000 and the dialogs' z-[1100],
      // so this never covers the bar, HostedStoreDialog or EnlargeModal.
      className="sticky z-40 mt-4 bg-slate-100 pb-3 pt-2"
      style={{ top: PINNED_TOP }}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md shadow-slate-900/5">
        {open ? (
          <div className="flex items-start gap-3">
            {/* `min-w-0` is load-bearing: a flex item's default `min-width:auto`
                refuses to shrink below its content, so without it the address
                line inside the preview never truncates and runs off the card. */}
            <div className="min-w-0 flex-1">
              <QrPreview compact />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Hide the pinned preview"
              aria-expanded
              title="Hide the pinned preview"
              className="-m-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Chevron open />
            </button>
          </div>
        ) : (
          // Collapsed, the bar stays — it is the only way back. Dropping it
          // entirely would leave a phone with no preview anywhere on the page
          // and nothing to press, because the in-column one has moved up here.
          // One button, not a label plus a chevron: two controls doing the same
          // thing is two tab stops and two things to explain to a screen reader.
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            className="-m-1 flex w-[calc(100%+0.5rem)] items-center gap-3 rounded-xl p-1 text-left text-sm font-medium text-slate-600 hover:text-orange-700"
          >
            <span className="min-w-0 flex-1">Show QR preview</span>
            <Chevron open={false} />
          </button>
        )}
      </div>
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        d={open ? 'M3.5 10 8 5.5 12.5 10' : 'M3.5 6 8 10.5 12.5 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
