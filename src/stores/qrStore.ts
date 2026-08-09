import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, type QrConfig, type DotType, type CornerSquareType, type CornerDotType } from '../lib/qr'
import type { BarcodeSymbology } from '../lib/barcode'

export type StudioMode = 'simple' | 'branding' | 'advanced'

/** What the studio is currently making. A 1D barcode is a "Type" inside the
 *  Advanced controls rather than a tab of its own (changed 2026-08-09). It sits
 *  in the store, not in QrConfig: QrConfig is the QR *design* — it gets
 *  exported, backed up and attached to hosted codes — and a symbology is none
 *  of those things. */
export type CodeType = 'qr' | 'barcode'
/**
 * Top-level tab: the free QR designer, the hosted Dynamic codes, or the camera
 * scanner. 1D barcodes live inside the designer now (Advanced ▸ Type) and are
 * static-only — there is no "dynamic barcode", because retail EAN/UPC codes are
 * read by POS systems that won't follow a redirect, so Dynamic stays QR-only.
 */
export type StudioView = 'static' | 'dynamic' | 'scan'

/**
 * Branding applied to the hosted "Dynamic" codes. Defaults to the signed-in
 * organisation's branding (its 1:1 icon in the centre + brand colour); each
 * field can be overridden. `color: null` / `logoMode: 'org'` mean "follow the
 * organisation" — so a rebrand flows through without re-editing every code.
 */
export interface DynamicBrand {
  /** Module colour, or null to use the org brand colour (falling back to the default). */
  color: string | null
  /** Centre logo source: the org icon, a custom upload, or none. */
  logoMode: 'org' | 'custom' | 'none'
  /** Custom logo data URL (used when logoMode === 'custom'). */
  logo: string | null
  bgColor: string
  bgTransparent: boolean
  useGradient: boolean
  gradientColor: string
  gradientRotation: number
  /** Corners a different colour from the modules. */
  twoTone: boolean
  cornerColor: string
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
}
export const DEFAULT_DYNAMIC_BRAND: DynamicBrand = {
  color: null,
  logoMode: 'org',
  logo: null,
  bgColor: DEFAULT_CONFIG.bgColor,
  bgTransparent: DEFAULT_CONFIG.bgTransparent,
  useGradient: DEFAULT_CONFIG.useGradient,
  gradientColor: DEFAULT_CONFIG.gradientColor,
  gradientRotation: DEFAULT_CONFIG.gradientRotation,
  twoTone: false,
  cornerColor: DEFAULT_CONFIG.cornerColor,
  dotType: DEFAULT_CONFIG.dotType,
  cornerSquareType: DEFAULT_CONFIG.cornerSquareType,
  cornerDotType: DEFAULT_CONFIG.cornerDotType,
}

interface QrState {
  config: QrConfig
  /** Static designer vs the hosted "Dynamic" (re-pointable + analytics) tab. */
  view: StudioView
  setView: (view: StudioView) => void
  /** Which control set is shown — Simple (just a URL) or Advanced (everything). */
  mode: StudioMode
  setMode: (mode: StudioMode) => void
  /** Shallow-merge a patch into the current config. */
  update: (patch: Partial<QrConfig>) => void
  /** Replace the whole config (used by presets, which patch a base). */
  applyPatch: (patch: Partial<QrConfig>) => void
  /**
   * The style preset the user last chose, or null.
   *
   * REMEMBERED, not derived from the config. Deriving it — active only while
   * every key in the patch still matches — deselects the moment you nudge a
   * colour, which is the wrong answer: a star you have recoloured is still the
   * Star design, and the row went blank exactly when you most wanted to know
   * where you started. Storing it also gives the pill a second job: clicking
   * the selected one re-applies its patch, so it doubles as "put this back".
   */
  presetName: string | null
  applyPreset: (name: string, patch: Partial<QrConfig>) => void
  setLogo: (dataUrl: string) => void
  clearLogo: () => void
  reset: () => void
  /** Branding for the hosted Dynamic codes (defaults to the org's). */
  dynamicBrand: DynamicBrand
  setDynamicBrand: (patch: Partial<DynamicBrand>) => void
  resetDynamicBrand: () => void
  /** "Hosted by UNI·SIM" cloud-store dialog open state (not persisted). */
  hostedStoreOpen: boolean
  setHostedStoreOpen: (open: boolean) => void
  /** QR or 1D barcode. Chosen under Advanced ▸ Type. */
  codeType: CodeType
  setCodeType: (type: CodeType) => void
  /** Chosen 1D symbology + value (persisted). */
  barcodeSymbology: BarcodeSymbology
  barcodeValue: string
  setBarcodeSymbology: (symbology: BarcodeSymbology) => void
  setBarcodeValue: (value: string) => void
}

export const useQrStore = create<QrState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      view: 'static',
      setView: (view) => set({ view }),
      mode: 'simple',
      setMode: (mode) => set({ mode }),
      update: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      applyPatch: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      presetName: null,
      applyPreset: (presetName, patch) =>
        set((s) => ({ presetName, config: { ...s.config, ...patch } })),
      setLogo: (dataUrl) => set((s) => ({ config: { ...s.config, logoDataUrl: dataUrl } })),
      clearLogo: () => set((s) => ({ config: { ...s.config, logoDataUrl: null } })),
      reset: () => set((s) => ({ config: DEFAULT_CONFIG, mode: s.mode, presetName: null })),
      dynamicBrand: DEFAULT_DYNAMIC_BRAND,
      setDynamicBrand: (patch) => set((s) => ({ dynamicBrand: { ...s.dynamicBrand, ...patch } })),
      resetDynamicBrand: () => set({ dynamicBrand: DEFAULT_DYNAMIC_BRAND }),
      hostedStoreOpen: false,
      setHostedStoreOpen: (hostedStoreOpen) => set({ hostedStoreOpen }),
      codeType: 'qr',
      setCodeType: (codeType) => set({ codeType }),
      barcodeSymbology: 'code128',
      barcodeValue: '',
      setBarcodeSymbology: (barcodeSymbology) => set({ barcodeSymbology }),
      setBarcodeValue: (barcodeValue) => set({ barcodeValue })
    }),
    {
      name: 'universal-qr:config',
      version: 6,
      // Only the design + chosen tabs persist — not the transient dialog flag.
      partialize: (s) => ({
        config: s.config,
        mode: s.mode,
        view: s.view,
        codeType: s.codeType,
        presetName: s.presetName,
        dynamicBrand: s.dynamicBrand,
        barcodeSymbology: s.barcodeSymbology,
        barcodeValue: s.barcodeValue
      }),
      // v2 widened DynamicBrand (bg / gradient / two-tone / dot style) — backfill
      // the new fields for anyone with a v1 record so brandConfig is never partial.
      // v3 added config.frameShape. This backfill is NOT cosmetic: the renderer
      // looks the shape up in a table, so a persisted v2 config arriving with
      // frameShape undefined would produce NaN geometry and a blank canvas for
      // every returning user.
      // v4 retired the Barcode tab. Anyone whose last session ended on it has
      // `view: 'barcode'` persisted, which is no longer a tab — without this they
      // would return to a shell rendering nothing at all. Carry them to the
      // designer with the barcode type already selected, so they land where the
      // feature moved to rather than somewhere they have to go and find it.
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as {
          dynamicBrand?: Partial<DynamicBrand>
          config?: Partial<QrConfig>
          view?: string
          codeType?: CodeType
        }
        if (version < 2) p.dynamicBrand = { ...DEFAULT_DYNAMIC_BRAND, ...(p.dynamicBrand ?? {}) }
        if (version < 3 && p.config) p.config = { ...DEFAULT_CONFIG, ...p.config, frameShape: p.config.frameShape ?? 'square' }
        if (version < 4) {
          if (p.view === 'barcode') {
            p.view = 'static'
            p.codeType = 'barcode'
          }
          p.codeType = p.codeType ?? 'qr'
        }
        // v5 added config.decorStyle. Same reasoning as the frameShape backfill
        // above and not cosmetic: persist replaces `config` wholesale, so a v4
        // record arrives with decorStyle undefined, and the renderer would then
        // compare undefined against 'none' on every draw.
        if (version < 5 && p.config) p.config = { ...p.config, decorStyle: p.config.decorStyle ?? 'none' }
        // v6 added the decoration colour. Same reasoning as every backfill above:
        // persist replaces `config` wholesale, so an older record arrives with
        // matchDecorColor undefined — which is falsy, and would silently draw
        // every existing decorated design in decorColor instead of following the
        // modules. A missing flag has to mean "match", not "don't".
        if (version < 6 && p.config) {
          p.config = {
            ...p.config,
            matchDecorColor: p.config.matchDecorColor ?? true,
            decorColor: p.config.decorColor ?? '#e05504'
          }
        }
        return p as unknown as QrState
      }
    }
  )
)
