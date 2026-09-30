import { useState } from 'react'
import { useQrStore } from '../../stores/qrStore'

/**
 * "Regenerate style" — one press, one new random style, no reload.
 *
 * Lives IN the preview box (James, 2026-09-30: "people find it fun to see it
 * change so i want it prominent"), right beside the code it changes. It sat in
 * the controls column until then, below the fold on a phone and a scroll away
 * from the code. The arrow turns a full circle on every press, so even a
 * restyle that happens to look similar reads as having done something.
 *
 * It patches the STYLE only — the content and an uploaded logo stay put (see
 * shufflePreset in the store).
 */
export default function RegenerateButton({ full = false }: { full?: boolean } = {}) {
  const shufflePreset = useQrStore((s) => s.shufflePreset)
  const presetName = useQrStore((s) => s.presetName)
  const [turns, setTurns] = useState(0)
  return (
    <button
      type="button"
      onClick={() => {
        shufflePreset()
        setTurns((n) => n + 1)
      }}
      title={presetName ? `${presetName} — pick another style at random` : 'Pick a style at random'}
      className={`${full ? 'flex w-full' : 'inline-flex'} items-center justify-center gap-2 rounded-xl border border-orange-300 bg-orange-50 px-3.5 py-2 text-sm font-semibold text-orange-800 shadow-sm transition-colors hover:border-orange-400 hover:bg-orange-100 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${turns * 360}deg)` }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 4v5h-5" />
      </svg>
      Regenerate style
    </button>
  )
}
