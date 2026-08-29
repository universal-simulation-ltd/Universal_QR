import { useEffect, useMemo, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { type QrDesign } from '@unisim/qr'
import QrCanvas from './QrCanvas'
import { downloadQr } from '../../lib/download'
import EnlargeModal from './EnlargeModal'
import BrandingControls from './BrandingControls'
import {
  dynamicQrConfig,
  getDailyScans,
  logoModeOf,
  redirectUrl,
  setDynamicDesign,
  setDynamicTarget,
  targetLabel,
  type DailyScan,
  type DynamicCode,
} from '../../lib/dynamicCodes'

// One saved dynamic code: its live QR (encoding the hosted redirect), the
// current destination (editable in place), its own branding (editable in
// place), and scan analytics. Deleting is handled by the parent so it can
// refund the token + refresh the list.
export default function DynamicCodeCard({
  code,
  studioBrand,
  orgIcon,
  busy,
  onChanged,
  onDelete,
}: {
  code: DynamicCode
  /** The Dynamic tab's "branding for new codes". Two jobs, neither of which is
   *  skinning this card by default: it draws codes created BEFORE designs were
   *  saved (they have none of their own), and it is what "Match branding for new
   *  codes" copies in. */
  studioBrand?: QrDesign
  /** The organisation's 1:1 mark as a data URI, for the editor's Org icon chip. */
  orgIcon: string | null
  busy: boolean
  onChanged: () => void
  onDelete: (code: DynamicCode) => void
}) {
  const { supabase } = useUniversal()
  const config = useMemo(() => dynamicQrConfig(code, studioBrand), [code, studioBrand])

  const [editing, setEditing] = useState(false)
  const [draftUrl, setDraftUrl] = useState(code.target_url)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [daily, setDaily] = useState<DailyScan[] | null>(null)
  const [enlarged, setEnlarged] = useState(false)

  // Branding editor — a draft of THIS code's design, saved only on Save.
  const [brandOpen, setBrandOpen] = useState(false)
  const [draft, setDraft] = useState<QrDesign>(config)
  const [savingBrand, setSavingBrand] = useState(false)
  const [brandError, setBrandError] = useState<string | null>(null)

  const link = redirectUrl(code.code)

  // Pull the 30-day scan history for the sparkline.
  useEffect(() => {
    let alive = true
    getDailyScans(supabase, code.id, 30)
      .then((rows) => { if (alive) setDaily(rows) })
      .catch(() => { if (alive) setDaily([]) })
    return () => { alive = false }
  }, [supabase, code.id, code.scan_count])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch { /* clipboard blocked — the link is visible to copy manually */ }
  }

  async function onSave() {
    if (!draftUrl.trim() || saving) return
    setSaving(true)
    setError(null)
    const res = await setDynamicTarget(supabase, code.id, draftUrl)
    setSaving(false)
    if (!res.ok) {
      setError(res.error ?? 'Could not update the destination.')
      return
    }
    setEditing(false)
    onChanged()
  }

  /** Open the branding editor on THIS code's current look. Seeded fresh each
   *  time rather than kept in state, so a cancelled edit — or a change made on
   *  another device between openings — never leaves a stale draft behind. */
  function openBranding() {
    setDraft(config)
    setBrandError(null)
    setBrandOpen(true)
  }

  async function onSaveBranding() {
    if (savingBrand) return
    setSavingBrand(true)
    setBrandError(null)
    const res = await setDynamicDesign(supabase, code.id, draft)
    setSavingBrand(false)
    if (!res.ok) {
      setBrandError(res.error ?? 'Could not save this code’s branding.')
      return
    }
    setBrandOpen(false)
    onChanged()
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Live QR of the redirect — click to enlarge for scanning */}
        <div className="shrink-0 self-center sm:self-start">
          <button
            type="button"
            onClick={() => setEnlarged(true)}
            className="w-28 cursor-zoom-in rounded-xl border border-slate-200 bg-white p-2 transition-colors hover:border-orange-300"
            title="Tap to enlarge"
            aria-label={`Enlarge QR code for ${targetLabel(code.target_url)}`}
          >
            <QrCanvas
              config={config}
              size={256}
              margin={8}
              label={`Dynamic QR code for ${targetLabel(code.target_url)}`}
              className="leading-[0]"
            />
          </button>
          <div className="mt-2 flex justify-center gap-2">
            <button type="button" onClick={() => downloadQr({ ...config, size: 1024 }, 'png')} className="text-[11px] font-semibold text-slate-500 hover:text-orange-700">PNG</button>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <button type="button" onClick={() => downloadQr({ ...config, size: 1024 }, 'svg')} className="text-[11px] font-semibold text-slate-500 hover:text-orange-700">SVG</button>
          </div>
          <div className="mt-1 text-center">
            <button
              type="button"
              onClick={() => (brandOpen ? setBrandOpen(false) : openBranding())}
              aria-expanded={brandOpen}
              className="text-[11px] font-semibold text-orange-700 hover:text-orange-800"
            >
              {brandOpen ? 'Close branding' : '✏️ Edit branding'}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{code.name?.trim() || targetLabel(code.target_url)}</h3>
              <div className="mt-0.5 flex items-center gap-1.5">
                <code className="truncate text-xs text-slate-500" title={link}>{link.replace(/^https:\/\//, '')}</code>
                <button
                  type="button"
                  onClick={onCopy}
                  className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Copy dynamic link"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDelete(code)}
              disabled={busy}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 disabled:opacity-50"
              title="Delete this code and get its token back"
            >
              Delete
            </button>
          </div>

          {/* Destination — editable in place */}
          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Redirects to</span>
              {!editing && (
                <button type="button" onClick={() => { setDraftUrl(code.target_url); setEditing(true) }} className="text-xs font-semibold text-orange-700 hover:text-orange-800">
                  Change destination
                </button>
              )}
            </div>
            {editing ? (
              <div className="mt-2 space-y-2">
                <input
                  type="url"
                  inputMode="url"
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  placeholder="https://example.com/new-page"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={onSave} disabled={saving || !draftUrl.trim()} className="rounded-lg bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save destination'}
                  </button>
                  <button type="button" onClick={() => { setEditing(false); setError(null) }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800">Cancel</button>
                </div>
                <p className="text-[11px] text-slate-400">The printed code stays the same — only where it sends people changes.</p>
              </div>
            ) : (
              <a href={code.target_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-slate-700 underline-offset-2 hover:text-orange-700 hover:underline" title={code.target_url}>
                {code.target_url}
              </a>
            )}
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
          </div>

          {/* Analytics */}
          <div className="mt-3 flex items-center gap-4">
            <div>
              <div className="text-xl font-bold tabular-nums text-slate-900">{code.scan_count.toLocaleString()}</div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">Total scans</div>
            </div>
            <Sparkline daily={daily} />
            <div className="ml-auto text-right text-[11px] text-slate-400">
              {code.last_scan_at
                ? <>Last scan<br /><span className="text-slate-600">{new Date(code.last_scan_at).toLocaleString()}</span></>
                : 'No scans yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Branding — this code's own, edited in place */}
      {brandOpen && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[11px] text-slate-500">
              {code.design
                ? 'This code’s own branding. Changing it re-draws this code and nothing else.'
                : 'This code was made before codes kept their own branding, so it still follows the panel above. Saving here pins the look to this code.'}
            </p>
            {studioBrand && (
              <button
                type="button"
                onClick={() => setDraft({ ...studioBrand, data: config.data, name: config.name })}
                className="text-[11px] font-semibold text-slate-500 hover:text-orange-700"
              >
                Match branding for new codes
              </button>
            )}
          </div>

          <BrandingControls
            config={draft}
            onPatch={(patch) => setDraft((d) => ({ ...d, ...patch }))}
            previewData={config.data}
            previewCaption={`Preview · ${targetLabel(code.target_url)}`}
            previewLabel={`Preview of ${code.name?.trim() || targetLabel(code.target_url)} with this branding`}
            logo={{
              mode: logoModeOf(draft, orgIcon),
              orgIconAvailable: !!orgIcon,
              onMode: (mode) =>
                setDraft((d) =>
                  mode === 'org'
                    // No org mark? "Org icon" means the UNI·SIM mark fills the
                    // centre — the same fallback the new-code panel applies.
                    ? { ...d, logoDataUrl: orgIcon, unisimMark: !orgIcon }
                    : { ...d, logoDataUrl: null, unisimMark: false },
                ),
              onUpload: (logo) => setDraft((d) => ({ ...d, logoDataUrl: logo, unisimMark: false })),
            }}
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSaveBranding}
              disabled={savingBrand}
              className="rounded-lg bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
            >
              {savingBrand ? 'Saving…' : 'Save branding'}
            </button>
            <button type="button" onClick={() => { setBrandOpen(false); setBrandError(null) }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800">Cancel</button>
            <p className="text-[11px] text-slate-400">
              The link and the scan count are untouched — but anything already printed keeps the old look, so re-download it.
            </p>
          </div>
          {brandError && <p className="mt-2 text-xs text-rose-600">{brandError}</p>}
        </div>
      )}

      {enlarged && <EnlargeModal config={config} onClose={() => setEnlarged(false)} />}
    </li>
  )
}

// A tiny 30-day bar sparkline built from the daily view. Zero-fills missing
// days so the shape reads as a real timeline, not just the days with traffic.
function Sparkline({ daily }: { daily: DailyScan[] | null }) {
  const bars = useMemo(() => {
    const byDay = new Map((daily ?? []).map((d) => [d.day, d.scans]))
    const out: number[] = []
    for (let i = 29; i >= 0; i--) {
      const key = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
      out.push(byDay.get(key) ?? 0)
    }
    return out
  }, [daily])

  if (daily === null) return <div className="h-8 flex-1" aria-hidden="true" />
  const max = Math.max(1, ...bars)
  return (
    <div className="flex h-8 flex-1 items-end gap-px" aria-label="Scans over the last 30 days" role="img">
      {bars.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${v > 0 ? 'bg-orange-400' : 'bg-slate-100'}`}
          style={{ height: `${Math.max(v > 0 ? 12 : 6, (v / max) * 100)}%` }}
          title={`${v} scan${v === 1 ? '' : 's'}`}
        />
      ))}
    </div>
  )
}
