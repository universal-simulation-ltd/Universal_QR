import { useState } from 'react'
import { useUser } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'

// "Save to account" — only rendered for visitors signed in with their
// Universal ID (useUser() returns a non-null user once the shared session
// cookie is present). This is the UI-only stage: there's no server-side
// project store wired up yet, so a save persists the current design to
// localStorage keyed by the user's id. Swap the body of saveToAccount() for
// a real backend call (e.g. the SDK's createProject) when that exists.
const SAVED_KEY = 'universal-qr:saved'

export default function SaveToAccount({ disabled }: { disabled: boolean }) {
  const { user, loading } = useUser()
  const config = useQrStore((s) => s.config)
  const [status, setStatus] = useState<'idle' | 'saved' | 'fail'>('idle')

  // Hidden entirely until we know the visitor is signed in via Universal ID.
  if (loading || !user) return null

  function saveToAccount() {
    if (!user) return
    try {
      const raw = localStorage.getItem(SAVED_KEY)
      const all: Record<string, unknown[]> = raw ? JSON.parse(raw) : {}
      const mine = Array.isArray(all[user.id]) ? all[user.id] : []
      mine.push({ savedAt: new Date().toISOString(), config })
      all[user.id] = mine
      localStorage.setItem(SAVED_KEY, JSON.stringify(all))
      setStatus('saved')
    } catch (err) {
      console.error(err)
      setStatus('fail')
    }
    setTimeout(() => setStatus('idle'), 1800)
  }

  return (
    <button
      type="button"
      onClick={saveToAccount}
      disabled={disabled}
      title={user.email ? `Save to ${user.email}` : 'Save to your account'}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-300 bg-orange-50 text-sm font-semibold text-orange-700 shadow-sm hover:bg-orange-100 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 4h8l2 2v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <path d="M7 4v4h5M7 17v-5h6v5" />
      </svg>
      {status === 'saved'
        ? '✓ Saved to account'
        : status === 'fail'
          ? "Couldn't save — try again"
          : 'Save to account'}
    </button>
  )
}
