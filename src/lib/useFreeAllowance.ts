import { useCallback, useEffect, useState } from 'react'
import { useUniversal } from '@unisim/sdk'

// The org's counted free allowance for one budget, straight from the
// `free_allowance_status` RPC (universal-platform migration 0199): 'qr' is live
// dynamic codes, 'qr_static' is saved static codes. The numbers are tunable on
// the backend, so the UI always reads them from here and never hardcodes one.
export interface FreeAllowanceStatus {
  unlimited: boolean
  used: number
  limit: number
  has_room: boolean
}

// Fails quiet: signed out, no org, an RPC error or an unexpected shape all give
// `status: null`, and a null status means "say nothing".
export function useFreeAllowance(app: 'qr' | 'qr_static', enabled = true) {
  const { supabase, session, activeOrgId } = useUniversal()
  const [status, setStatus] = useState<FreeAllowanceStatus | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const userId = session?.user && session.user.is_anonymous !== true ? session.user.id : null

  useEffect(() => {
    if (!enabled || !userId) {
      setStatus(null)
      return
    }
    let cancelled = false
    supabase
      .rpc('free_allowance_status', { p_app: app })
      .then(({ data, error }) => {
        if (cancelled) return
        const d = data as Record<string, unknown> | null
        if (error || !d || d.ok !== true || typeof d.used !== 'number' || typeof d.limit !== 'number') {
          setStatus(null)
          return
        }
        setStatus({ unlimited: d.unlimited === true, used: d.used, limit: d.limit, has_room: d.has_room === true })
      }, () => { if (!cancelled) setStatus(null) })
    return () => { cancelled = true }
  }, [supabase, app, enabled, userId, activeOrgId, reloadKey])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])
  return { status, refresh }
}

// Talk about the limit only once it is actually close: 80% or more used, with
// room still left (a full allowance has its own "you've used…" message).
export function isNearLimit(s: FreeAllowanceStatus | null): s is FreeAllowanceStatus {
  return !!s && !s.unlimited && s.limit > 0 && s.has_room && s.used / s.limit >= 0.8
}
