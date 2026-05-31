import { useEffect, useRef, useState } from 'react'
import { useQrStore } from '../../stores/qrStore'

// The per-app "File" dropdown that slots into <UniversalAppsNavBar />.
// Holds reset / clear-logo actions; stays in sync with the store.
export default function AppMenu() {
  const config = useQrStore((s) => s.config)
  const reset = useQrStore((s) => s.reset)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const hasLogo = !!config.logoDataUrl

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="h-8 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium ring-1 ring-slate-200 flex items-center gap-1.5"
      >
        File
        <svg viewBox="0 0 12 12" className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
          {hasLogo && (
            <button
              onClick={() => {
                clearLogo()
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 text-sm"
            >
              <span aria-hidden="true">🧹</span>
              <span className="flex-1 text-left font-medium">Remove logo</span>
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Reset all settings to the defaults?')) {
                reset()
                setOpen(false)
              }
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 hover:text-red-700 text-sm ${
              hasLogo ? 'border-t border-slate-100' : ''
            }`}
          >
            <span aria-hidden="true">↺</span>
            <span className="flex-1 text-left">Reset to defaults</span>
          </button>
        </div>
      )}
    </div>
  )
}
