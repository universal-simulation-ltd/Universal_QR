import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUniversal, useUser, useCredits, useAppFreeToken, useOrgBranding } from '@unisim/sdk'
import { CONTAINER } from '../../lib/layout'
import { DEFAULT_CONFIG, PRESETS, buildQrOptions, type QrConfig } from '../../lib/qr'
import QRCodeStyling from 'qr-code-styling'
import { useQrStore } from '../../stores/qrStore'
import {
  createDynamicCode,
  deleteDynamicCode,
  listDynamicCodes,
  type DynamicCode,
} from '../../lib/dynamicCodes'
import DynamicCodeCard from './DynamicCodeCard'

const SIGNIN_URL = 'https://app.unisim.co.uk/login'
const GET_TOKENS_URL = 'https://www.unisim.co.uk/subscription.html'

// The "Dynamic" tab — a hosted/PRO feature. A dynamic code encodes a short
// redirect the owner can re-point later, and every scan is counted. Each live
// code holds one token (the org's free "Everyday" token first, then a purchased
// credit), returned when the code is deleted. The free static designer is a
// sibling tab and is never touched by any of this.
export default function DynamicStudio() {
  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const { credits, refresh: refreshCredits } = useCredits()
  const { status: freeToken, refresh: refreshFreeToken } = useAppFreeToken('qr')
  const { icon_url: orgIconUrl, brand_color: orgColor } = useOrgBranding()
  const setView = useQrStore((s) => s.setView)
  const dynamicBrand = useQrStore((s) => s.dynamicBrand)
  const setDynamicBrand = useQrStore((s) => s.setDynamicBrand)
  const resetDynamicBrand = useQrStore((s) => s.resetDynamicBrand)
  const logoInputRef = useRef<HTMLInputElement>(null)
  // Branding is a lot of controls — keep it collapsed by default so the create
  // form and code list are front and centre.
  const [brandingOpen, setBrandingOpen] = useState(false)

  // The org's 1:1 icon is a remote URL; fetch it to a data URL so it can go in
  // the QR centre and survive a canvas download without tainting.
  const [orgIcon, setOrgIcon] = useState<string | null>(null)
  useEffect(() => {
    if (!orgIconUrl) { setOrgIcon(null); return }
    let alive = true
    fetch(orgIconUrl)
      .then((r) => r.blob())
      .then((blob) => new Promise<string>((res, rej) => {
        const fr = new FileReader()
        fr.onload = () => res(String(fr.result))
        fr.onerror = rej
        fr.readAsDataURL(blob)
      }))
      .then((d) => { if (alive) setOrgIcon(d) })
      .catch(() => { if (alive) setOrgIcon(orgIconUrl) }) // CORS-blocked: fall back to the URL
    return () => { alive = false }
  }, [orgIconUrl])

  // Effective branding for every dynamic code: org colour + org icon by default,
  // with per-field overrides. Falls back to the standard UNI·SIM look when there's
  // no org branding (e.g. a personal account).
  const brandColor = dynamicBrand.color ?? orgColor ?? DEFAULT_CONFIG.fgColor
  const brandLogo =
    dynamicBrand.logoMode === 'custom' ? dynamicBrand.logo
      : dynamicBrand.logoMode === 'none' ? null
        : orgIcon
  // Memoised so its object identity is stable while nothing changes — otherwise
  // the example preview + every code's QR would re-mount on each render.
  const brandConfig = useMemo<QrConfig>(() => ({
    ...DEFAULT_CONFIG,
    fgColor: brandColor,
    bgColor: dynamicBrand.bgColor,
    bgTransparent: dynamicBrand.bgTransparent,
    useGradient: dynamicBrand.useGradient,
    gradientColor: dynamicBrand.gradientColor,
    gradientRotation: dynamicBrand.gradientRotation,
    matchCornerColor: !dynamicBrand.twoTone,
    cornerColor: dynamicBrand.twoTone ? dynamicBrand.cornerColor : brandColor,
    dotType: dynamicBrand.dotType,
    cornerSquareType: dynamicBrand.cornerSquareType,
    cornerDotType: dynamicBrand.cornerDotType,
    logoDataUrl: brandLogo,
    unisimMark: dynamicBrand.logoMode === 'org' && !orgIcon, // UNI·SIM mark only when nothing else fills the centre
  }), [
    brandColor, brandLogo, orgIcon,
    dynamicBrand.bgColor, dynamicBrand.bgTransparent, dynamicBrand.useGradient,
    dynamicBrand.gradientColor, dynamicBrand.gradientRotation, dynamicBrand.twoTone,
    dynamicBrand.cornerColor, dynamicBrand.dotType, dynamicBrand.cornerSquareType,
    dynamicBrand.cornerDotType, dynamicBrand.logoMode,
  ])
  const hasOrgBranding = !!(orgColor || orgIcon)

  // Apply one of the named style presets (Classic / Rounded / Dots / Indigo /
  // Sunset). It sets the module colour explicitly, so it stops following the org.
  function applyPreset(patch: Partial<QrConfig>) {
    const b: Partial<typeof dynamicBrand> = {}
    if (patch.fgColor !== undefined) b.color = patch.fgColor
    if (patch.bgColor !== undefined) b.bgColor = patch.bgColor
    if (patch.bgTransparent !== undefined) b.bgTransparent = patch.bgTransparent
    if (patch.useGradient !== undefined) b.useGradient = patch.useGradient
    if (patch.gradientColor !== undefined) b.gradientColor = patch.gradientColor
    if (patch.gradientRotation !== undefined) b.gradientRotation = patch.gradientRotation
    if (patch.matchCornerColor !== undefined) b.twoTone = patch.matchCornerColor === false
    if (patch.cornerColor !== undefined) b.cornerColor = patch.cornerColor
    if (patch.dotType !== undefined) b.dotType = patch.dotType
    if (patch.cornerSquareType !== undefined) b.cornerSquareType = patch.cornerSquareType
    if (patch.cornerDotType !== undefined) b.cornerDotType = patch.cornerDotType
    setDynamicBrand(b)
  }

  function onUploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const fr = new FileReader()
    fr.onload = () => setDynamicBrand({ logoMode: 'custom', logo: String(fr.result) })
    fr.readAsDataURL(file)
  }

  const [codes, setCodes] = useState<DynamicCode[] | null>(null)
  const [target, setTarget] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const tokens = credits ?? 0
  const canCreate = freeToken === 'available' || tokens > 0

  const refreshList = useCallback(() => {
    if (!signedIn) { setCodes([]); return }
    listDynamicCodes(supabase)
      .then(setCodes)
      .catch(() => setCodes([]))
  }, [supabase, signedIn])

  useEffect(() => { refreshList() }, [refreshList, activeOrgId])

  // Pick up a sign-in that completed on the hub (another tab / full-page login)
  // without needing a manual refresh. When signed out, watch for the tab regaining
  // focus or an auth event; if a real (non-anonymous) session now exists but the
  // app still initialised signed-out, reload once so the SDK — and its token /
  // credit hooks — re-read it. Runs only while signed out, so it can't loop.
  useEffect(() => {
    if (signedIn) return
    let cancelled = false
    const catchUp = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const s = data.session
        if (!cancelled && s?.user && s.user.is_anonymous !== true) window.location.reload()
      } catch { /* offline / not signed in — nothing to catch up */ }
    }
    const onAuth = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') catchUp()
    })
    const onVisible = () => { if (document.visibilityState === 'visible') catchUp() }
    window.addEventListener('focus', catchUp)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      onAuth.data.subscription.unsubscribe()
      window.removeEventListener('focus', catchUp)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [signedIn, supabase])

  async function onCreate() {
    if (!target.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await createDynamicCode(supabase, target, name)
      if (!res.ok) {
        setError(
          res.error === 'no_credits'
            ? 'You have no tokens left. Get more to create another dynamic code.'
            : res.error === 'token_in_use'
              ? `Your free QR token is already in use${res.heldBy ? ` (${res.heldBy})` : ''} — delete that code or add tokens.`
              : res.error === 'no_org'
                ? 'Your Universal ID has no organisation yet — open the hub once to finish setup.'
                : res.error ?? 'Could not create this dynamic code.',
        )
      } else {
        setTarget('')
        setName('')
        refreshCredits()
        refreshFreeToken()
        refreshList()
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(code: DynamicCode) {
    if (busy) return
    if (!window.confirm(`Delete "${code.name?.trim() || code.code}"? Anyone who scans it will hit a "not active" page, and its token comes back to you.`)) return
    setBusy(true)
    setError(null)
    try {
      const res = await deleteDynamicCode(supabase, code.id)
      if (!res.ok) setError(res.error ?? 'Could not delete this code.')
      else {
        refreshCredits()
        refreshFreeToken()
        refreshList()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`${CONTAINER} py-6 lg:py-10`}>
      <header className="max-w-2xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dynamic QR codes
          </h1>
          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">Hosted</span>
        </div>
        <p className="mt-2 text-slate-600">
          One printed code, a destination you can change any time — plus a live scan count.
          The link stays fixed (<code className="text-slate-500">opensource.unisim.co.uk/qr/r/…</code>); you
          repoint where it sends people whenever you like.
        </p>
      </header>

      {!signedIn ? (
        <div className="mt-6 max-w-2xl rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Sign in to create dynamic codes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Dynamic codes are hosted against your <strong>Universal ID</strong> so they can redirect and
            record scans. Each live code uses one token — every account gets one free, and deleting a code
            returns its token. The plain <button type="button" className="font-semibold text-orange-600 hover:text-orange-700" onClick={() => setView('static')}>Static</button> designer stays 100% free and on-device.
          </p>
          <a href={SIGNIN_URL} className="mt-4 inline-flex rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700">
            Create / sign in with Universal ID →
          </a>
        </div>
      ) : (
        <>
        {/* Branding — a live example + controls; defaults to the org's, applies to every code */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setBrandingOpen((v) => !v)}
              aria-expanded={brandingOpen}
              className="group flex min-w-0 flex-1 items-start gap-2 text-left"
            >
              <svg viewBox="0 0 12 12" className={`mt-1 h-3 w-3 shrink-0 text-slate-400 transition-transform ${brandingOpen ? 'rotate-90' : ''}`} aria-hidden="true">
                <path d="M4 2 L8 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 group-hover:text-orange-600">Code branding</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {hasOrgBranding
                    ? 'Defaults to your organisation’s icon and colour — applies to every dynamic code, so a rebrand flows through automatically.'
                    : 'Applies to every dynamic code. Add a logo and brand colour to your organisation and they’ll fill in here automatically.'}
                </p>
              </div>
            </button>
            {brandingOpen && (
              <button type="button" onClick={resetDynamicBrand} className="shrink-0 text-xs font-semibold text-slate-500 hover:text-orange-600">Reset</button>
            )}
          </div>

          {brandingOpen && (
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-stretch">
            {/* Live example (points at unisim.co.uk) — fills the panel height */}
            <div className="flex shrink-0 flex-col items-center gap-1.5 self-center sm:self-stretch">
              <BrandPreview config={brandConfig} />
              <p className="text-center text-[11px] text-slate-400">Example · unisim.co.uk</p>
            </div>

            {/* Controls */}
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Style</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <BrandChip key={p.name} active={false} onClick={() => applyPreset(p.patch)}>{p.name}</BrandChip>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <ColorField label="Modules" value={brandColor} onChange={(v) => setDynamicBrand({ color: v })}>
                  {dynamicBrand.color != null && orgColor
                    ? <button type="button" onClick={() => setDynamicBrand({ color: null })} className="text-[11px] font-semibold text-slate-400 hover:text-orange-600">use org</button>
                    : null}
                </ColorField>
                <ColorField label="Background" value={dynamicBrand.bgColor} onChange={(v) => setDynamicBrand({ bgColor: v })} disabled={dynamicBrand.bgTransparent} />
                <label className="flex items-center gap-1.5 text-xs text-slate-600">
                  <input type="checkbox" checked={dynamicBrand.bgTransparent} onChange={(e) => setDynamicBrand({ bgTransparent: e.target.checked })} /> Transparent
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <label className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input type="checkbox" checked={dynamicBrand.useGradient} onChange={(e) => setDynamicBrand({ useGradient: e.target.checked })} /> <span className="font-medium">Gradient</span>
                </label>
                {dynamicBrand.useGradient && (
                  <>
                    <ColorField label="End" value={dynamicBrand.gradientColor} onChange={(v) => setDynamicBrand({ gradientColor: v })} />
                    <label className="flex items-center gap-2 text-xs text-slate-600">Angle
                      <input type="range" min={0} max={360} step={5} value={dynamicBrand.gradientRotation} onChange={(e) => setDynamicBrand({ gradientRotation: Number(e.target.value) })} className="w-24 accent-orange-600" />
                      <span className="tabular-nums">{dynamicBrand.gradientRotation}°</span>
                    </label>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <label className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input type="checkbox" checked={dynamicBrand.twoTone} onChange={(e) => setDynamicBrand({ twoTone: e.target.checked })} /> <span className="font-medium">Two-tone corners</span>
                </label>
                {dynamicBrand.twoTone && <ColorField label="Corners" value={dynamicBrand.cornerColor} onChange={(v) => setDynamicBrand({ cornerColor: v })} />}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Centre logo</span>
                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                  {brandLogo
                    ? <img src={brandLogo} alt="" className="h-full w-full object-contain" />
                    : <span className="text-[8px] font-semibold text-slate-400">{brandConfig.unisimMark ? 'UNI·SIM' : 'none'}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <BrandChip active={dynamicBrand.logoMode === 'org'} disabled={!orgIcon} onClick={() => setDynamicBrand({ logoMode: 'org' })}>Org icon</BrandChip>
                  <BrandChip active={dynamicBrand.logoMode === 'custom'} onClick={() => logoInputRef.current?.click()}>Upload…</BrandChip>
                  <BrandChip active={dynamicBrand.logoMode === 'none'} onClick={() => setDynamicBrand({ logoMode: 'none' })}>None</BrandChip>
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
              </div>
            </div>
          </div>
          )}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
          {/* Create panel */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">New dynamic code</h2>
              <span className="rounded-lg bg-orange-50/70 px-2.5 py-1 text-xs font-semibold text-orange-700">
                {freeToken === 'available'
                  ? tokens > 0 ? `Free token + ${tokens} purchased` : 'Free token available'
                  : `${tokens} token${tokens === 1 ? '' : 's'}`}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Signed in as {user?.email}</p>

            <label htmlFor="dyn-target" className="mt-4 block text-sm font-medium text-slate-700">Destination URL</label>
            <input
              id="dyn-target"
              type="url"
              inputMode="url"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="https://example.com/landing"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />

            <label htmlFor="dyn-name" className="mt-3 block text-sm font-medium text-slate-700">Label <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              id="dyn-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Spring campaign flyer"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />

            {canCreate ? (
              <button
                type="button"
                onClick={onCreate}
                disabled={busy || !target.trim()}
                className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {busy ? 'Creating…' : 'Create dynamic code (1 token)'}
              </button>
            ) : freeToken === null ? (
              <p className="mt-4 text-sm text-slate-500">Checking your tokens…</p>
            ) : (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  {freeToken === 'held'
                    ? 'Your free QR token is in use — delete a code below to get it back, or add tokens.'
                    : 'You have no tokens left.'}
                </p>
                <a href={GET_TOKENS_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-700">
                  Get tokens →
                </a>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          </section>

          {/* Codes list */}
          <section>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">Your dynamic codes</h2>
            {codes === null ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : codes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                <p className="text-sm text-slate-500">No dynamic codes yet. Create your first one on the left — you can re-point it and watch the scans roll in.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {codes.map((c) => (
                  <DynamicCodeCard key={c.id} code={c} brand={brandConfig} busy={busy} onChanged={refreshList} onDelete={onDelete} />
                ))}
              </ul>
            )}
          </section>
        </div>
        </>
      )}
    </div>
  )
}

// A live example of the current branding, encoding the UNI·SIM site so the
// preview always has something to render.
function BrandPreview({ config }: { config: QrConfig }) {
  const holderRef = useRef<HTMLDivElement>(null)
  const key = JSON.stringify(config)
  useEffect(() => {
    const qr = new QRCodeStyling(buildQrOptions({ ...config, data: 'https://www.unisim.co.uk', size: 360, margin: 8 }))
    if (holderRef.current) {
      holderRef.current.innerHTML = ''
      qr.append(holderRef.current)
      const canvas = holderRef.current.querySelector('canvas')
      if (canvas) { canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block'; canvas.style.objectFit = 'contain' }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return (
    <div className="grid aspect-square w-40 place-items-center rounded-xl border border-slate-200 bg-white p-2 sm:w-auto sm:min-h-[9rem] sm:flex-1">
      <div ref={holderRef} role="img" aria-label="Example dynamic QR with your branding" className="h-full w-full leading-[0]" />
    </div>
  )
}

// A labelled colour swatch with an optional trailing control.
function ColorField({ label, value, onChange, disabled, children }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="color"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5 disabled:opacity-40"
        aria-label={label}
      />
      {children}
    </div>
  )
}

// A small toggle chip for the branding logo-source choice.
function BrandChip({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${
        active
          ? 'border-orange-500 bg-orange-50 text-orange-700'
          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}
