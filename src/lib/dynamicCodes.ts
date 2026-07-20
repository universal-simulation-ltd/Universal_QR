import type { useUniversal } from '@unisim/sdk'
import { DEFAULT_CONFIG, type QrConfig } from './qr'

// Client helpers for Universal QR "Dynamic" codes — the hosted/PRO path. A
// dynamic code encodes a short redirect (opensource.unisim.co.uk/qr/r/<code>)
// that the `qr-redirect` Edge Function resolves to a target URL the owner can
// change later; each resolve logs a scan. Backend: migration 0061 + the
// qr_dynamic_* RPCs (member reads go straight through RLS).
//
// The FREE static generator never touches any of this — it stays 100% local.

type Supabase = ReturnType<typeof useUniversal>['supabase']

/** Production base for the encoded redirect. A dynamic code always points at
 *  the real hosted endpoint, regardless of where it was created (incl. dev). */
export const DYNAMIC_BASE = 'https://opensource.unisim.co.uk/qr/r/'

/** The full URL baked into a dynamic code's pixels. */
export function redirectUrl(code: string): string {
  return `${DYNAMIC_BASE}${code}`
}

/** A stored row in `qr_dynamic_codes` (member-readable via RLS). */
export interface DynamicCode {
  id: string
  org_id: string
  user_id: string | null
  code: string
  target_url: string
  name: string | null
  scan_count: number
  last_scan_at: string | null
  created_at: string
  updated_at: string
}

/** One row of the `qr_dynamic_scan_daily` analytics view. */
export interface DailyScan {
  code_id: string
  day: string // YYYY-MM-DD (UTC)
  scans: number
}

export interface CreateResult {
  ok: boolean
  error?: string
  /** On 'no_credits'/'token_in_use': what currently holds the org's QR token. */
  heldBy?: string | null
  id?: string
  code?: string
  fundedBy?: string
  credits?: number
}

export interface MutateResult {
  ok: boolean
  error?: string
}

/** Give a user-typed destination a scheme so the stored target is followable.
 *  A bare host ("example.com") defaults to https; explicit schemes are kept. */
export function normalizeTargetUrl(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return t
  return `https://${t}`
}

/** Best-effort hostname for a compact label (falls back to the raw string). */
export function targetLabel(url: string): string {
  try {
    return new URL(normalizeTargetUrl(url)).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Reserve a token and mint a new dynamic code for the current org. */
export async function createDynamicCode(
  supabase: Supabase,
  targetUrl: string,
  name: string,
): Promise<CreateResult> {
  const { data, error } = await supabase.rpc('qr_dynamic_create', {
    p_target_url: normalizeTargetUrl(targetUrl),
    p_name: name.trim() || null,
  })
  if (error) return { ok: false, error: error.message }
  const r = (data ?? {}) as Record<string, unknown>
  return {
    ok: r.ok === true,
    error: r.error as string | undefined,
    heldBy: (r.held_by as string | null | undefined) ?? null,
    id: r.id as string | undefined,
    code: r.code as string | undefined,
    fundedBy: r.funded_by as string | undefined,
    credits: r.credits as number | undefined,
  }
}

/** Re-point a dynamic code (and optionally rename it). No token movement. */
export async function setDynamicTarget(
  supabase: Supabase,
  id: string,
  targetUrl: string,
  name?: string,
): Promise<MutateResult> {
  const { data, error } = await supabase.rpc('qr_dynamic_set_target', {
    p_id: id,
    p_target_url: normalizeTargetUrl(targetUrl),
    p_name: name === undefined ? null : name.trim(),
  })
  if (error) return { ok: false, error: error.message }
  const r = (data ?? {}) as Record<string, unknown>
  return { ok: r.ok === true, error: r.error as string | undefined }
}

/** Delete a dynamic code and refund its token. */
export async function deleteDynamicCode(supabase: Supabase, id: string): Promise<MutateResult> {
  const { data, error } = await supabase.rpc('qr_dynamic_delete', { p_id: id })
  if (error) return { ok: false, error: error.message }
  const r = (data ?? {}) as Record<string, unknown>
  return { ok: r.ok === true, error: r.error as string | undefined }
}

/** The current org's dynamic codes, newest first (member RLS — plain select). */
export async function listDynamicCodes(supabase: Supabase): Promise<DynamicCode[]> {
  const { data, error } = await supabase
    .from('qr_dynamic_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as DynamicCode[]
}

/** Per-day scan counts for one code over the last `days` (for the mini chart). */
export async function getDailyScans(
  supabase: Supabase,
  codeId: string,
  days = 30,
): Promise<DailyScan[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('qr_dynamic_scan_daily')
    .select('*')
    .eq('code_id', codeId)
    .gte('day', since)
    .order('day', { ascending: true })
  if (error) throw error
  return (data ?? []) as DailyScan[]
}

/** A branded QrConfig that renders a dynamic code's redirect URL. Uses the
 *  suite default styling; the payload is the hosted short link, never the
 *  target — that's what makes it re-pointable. */
export function dynamicQrConfig(code: DynamicCode): QrConfig {
  return {
    ...DEFAULT_CONFIG,
    data: redirectUrl(code.code),
    name: code.name?.trim() || targetLabel(code.target_url) || 'dynamic-qr',
  }
}
