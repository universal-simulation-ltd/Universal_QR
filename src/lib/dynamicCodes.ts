import type { useUniversal } from '@unisim/sdk'
import { DEFAULT_CONFIG, type QrDesign } from '@unisim/qr'

// Client helpers for Universal QR "Dynamic" codes — the hosted/PRO path. A
// dynamic code encodes a short redirect (opensource.unisim.co.uk/qr/r/<code>)
// that the `qr-redirect` Edge Function resolves to a target URL the owner can
// change later; each resolve logs a scan. Backend: migration 0061 (+ 0129, the
// per-code saved design) and the qr_dynamic_* RPCs — member reads go straight
// through RLS, which is also how Universal PDF lists these codes.
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
  /** The look this code was created with (migration 0129), or null for a code
   *  made before designs were saved — those still follow the studio branding. */
  design: QrDesign | null
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

/**
 * Reserve a token and mint a new dynamic code for the current org.
 *
 * ⚠️ `design` is SNAPSHOTTED here and never re-derived. The branding panel in
 * the Dynamic tab sets the look new codes are born with; from this moment the
 * code owns it, so a later rebrand cannot redraw something already printed.
 * Changing one code's look afterwards is an explicit act — `setDynamicDesign`.
 */
export async function createDynamicCode(
  supabase: Supabase,
  targetUrl: string,
  name: string,
  design?: QrDesign | null,
): Promise<CreateResult> {
  const { data, error } = await supabase.rpc('qr_dynamic_create', {
    p_target_url: normalizeTargetUrl(targetUrl),
    p_name: name.trim() || null,
    p_design: design ? storableDesign(design) : null,
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

/**
 * Re-skin ONE code. Nothing about where it points, and no token movement.
 *
 * `null` clears the snapshot and puts the code back to following the studio
 * branding — the way out for a design saved by accident.
 */
export async function setDynamicDesign(
  supabase: Supabase,
  id: string,
  design: QrDesign | null,
): Promise<MutateResult> {
  const { data, error } = await supabase.rpc('qr_dynamic_set_design', {
    p_id: id,
    p_design: design ? storableDesign(design) : null,
  })
  if (error) return { ok: false, error: error.message }
  const r = (data ?? {}) as Record<string, unknown>
  return {
    ok: r.ok === true,
    error: r.error === 'design_too_large'
      ? 'That design is too big to save — try a smaller centre logo.'
      : (r.error as string | undefined),
  }
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
  return (data ?? []).map((row) => ({
    ...(row as DynamicCode),
    design: hydrateDesign((row as { design?: unknown }).design),
  }))
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

// ── The saved design ─────────────────────────────────────────────────────────
// A dynamic code's look is stored on its row (migration 0129) rather than being
// applied from the studio at render time. That is what makes a printed code
// stable: editing the branding panel changes what the NEXT code is born
// wearing, and nothing else.

/**
 * The design as it goes into the database: the look, with the payload and the
 * label emptied.
 *
 * ⚠️ Not cosmetic tidying. `data` and `name` are owned by the ROW — the
 * redirect and the user's label — and `dynamicQrConfig` overwrites both on the
 * way out. Storing copies would make a renamed or re-pointed code carry a
 * second, staler answer to both questions, waiting for the day a reader trusts
 * the wrong one. Universal PDF reads this column too, so "the design is the
 * look and nothing else" has to hold across apps.
 */
export function storableDesign(design: QrDesign): QrDesign {
  return { ...design, data: '', name: '' }
}

/** A stored design merged over the current defaults. A design saved before a
 *  field existed comes back missing it, and the renderer looks `frameShape` up
 *  in a table — an undefined there is NaN geometry and a blank code, not a
 *  cosmetic difference. Anything that isn't an object is treated as absent. */
export function hydrateDesign(raw: unknown): QrDesign | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  return { ...DEFAULT_CONFIG, ...(raw as Partial<QrDesign>) }
}

/**
 * Which centre-logo choice a design represents: the organisation's mark, an
 * upload of the user's own, or nothing.
 *
 * Derived rather than stored, because a design records only what is IN the
 * centre — the mode is a fact about the editor, not about the code. The org
 * icon is matched by its bytes, which is the right test: if the centre holds
 * the organisation's mark then "Org icon" describes it truthfully, however it
 * got there. With no org mark at all, "Org icon" degrades to the UNI·SIM one,
 * which is the same fallback the new-code panel applies.
 */
export function logoModeOf(design: QrDesign, orgIcon: string | null): 'org' | 'custom' | 'none' {
  if (design.logoDataUrl) return design.logoDataUrl === orgIcon ? 'org' : 'custom'
  return design.unisimMark ? 'org' : 'none'
}

/**
 * The QrDesign that draws a dynamic code.
 *
 * Its own saved design first; `fallbackBrand` (the studio branding) only for a
 * code created before 0129, which never had one. Either way the payload is the
 * hosted short link — never the target, which is what makes it re-pointable —
 * and the label comes from the row.
 */
export function dynamicQrConfig(code: DynamicCode, fallbackBrand?: QrDesign): QrDesign {
  return {
    ...(code.design ?? fallbackBrand ?? DEFAULT_CONFIG),
    data: redirectUrl(code.code),
    name: code.name?.trim() || targetLabel(code.target_url) || 'dynamic-qr',
  }
}
