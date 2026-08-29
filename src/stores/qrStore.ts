import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, randomPreset, type QrConfig } from '@unisim/qr'
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
 *
 * ⚠️ `design` is ONE opaque bag on purpose. It used to be a hand-written mirror
 * of the QrDesign fields the branding controls can change — bgColor, dotType,
 * twoTone and so on — and every field added to the design model after that list
 * was written simply fell on the floor between the two. That is not theory: it
 * is why picking **Star** in this panel did nothing at all for months. The chip
 * patched `frameShape: 'star'`, the translation had no case for it, and the
 * user got a plain square code with no error anywhere. `starPlacement`,
 * `starColor`, `decorStyle`, `matchDecorColor` and `logoSize` were lost the
 * same way.
 *
 * So: everything the shared controls patch is kept verbatim, and only the two
 * things a QrDesign genuinely cannot express — "follow the organisation's
 * colour" and "follow the organisation's icon" — stay as fields of their own.
 * A new design field now needs no change here at all.
 */
export interface DynamicBrand {
  /** Module colour, or null to use the org brand colour (falling back to the default). */
  color: string | null
  /** Centre logo source: the org icon, a custom upload, or none. */
  logoMode: 'org' | 'custom' | 'none'
  /** Custom logo data URL (used when logoMode === 'custom'). */
  logo: string | null
  /** Every other design field, exactly as the branding controls patch it.
   *  Merged over DEFAULT_CONFIG to build the design a new code is born in. */
  design: Partial<QrConfig>
}
export const DEFAULT_DYNAMIC_BRAND: DynamicBrand = {
  color: null,
  logoMode: 'org',
  logo: null,
  design: {},
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
  /**
   * Jump to a random style — a different one from the current pick.
   *
   * Runs once on every load (see onRehydrateStorage below) and again on each
   * press of Regenerate, so the two routes cannot drift apart: the button IS a
   * reload as far as the design is concerned.
   *
   * It patches the STYLE and leaves the content alone — the URL, the name and
   * an uploaded logo all survive, because a new look is not a new code. That is
   * also why what persists still persists: come back tomorrow and your link is
   * where you left it, wearing a different outfit.
   */
  shufflePreset: () => void
  /**
   * Put the default web address back when the field is empty.
   *
   * Runs on load beside the shuffle, so the generator always opens on a code
   * you can actually see rather than on the "enter a URL" curtain.
   *
   * Empty ONLY. An address you typed is yours and survives a reload — the
   * style is the thing this app re-rolls, and quietly replacing someone's link
   * with ours on every refresh would be the version of this feature that
   * hands out the wrong QR code. Clearing the box and reloading is how you ask
   * for the default back.
   */
  restoreDefaultAddress: () => void
  setLogo: (dataUrl: string) => void
  clearLogo: () => void
  reset: () => void
  /** Branding for the hosted Dynamic codes (defaults to the org's). */
  dynamicBrand: DynamicBrand
  setDynamicBrand: (patch: Partial<DynamicBrand>) => void
  /** Merge a design patch from the branding controls into `dynamicBrand.design`.
   *  Separate from `setDynamicBrand` because that shallow-merges, which would
   *  make a one-field patch REPLACE the whole design. */
  patchDynamicDesign: (patch: Partial<QrConfig>) => void
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
      shufflePreset: () =>
        set((s) => {
          const preset = randomPreset(s.presetName)
          return { presetName: preset.name, config: { ...s.config, ...preset.patch } }
        }),
      restoreDefaultAddress: () =>
        set((s) => (s.config.data.trim() ? {} : { config: { ...s.config, data: DEFAULT_CONFIG.data } })),
      setLogo: (dataUrl) => set((s) => ({ config: { ...s.config, logoDataUrl: dataUrl } })),
      clearLogo: () => set((s) => ({ config: { ...s.config, logoDataUrl: null } })),
      reset: () => set((s) => ({ config: DEFAULT_CONFIG, mode: s.mode, presetName: null })),
      dynamicBrand: DEFAULT_DYNAMIC_BRAND,
      setDynamicBrand: (patch) => set((s) => ({ dynamicBrand: { ...s.dynamicBrand, ...patch } })),
      patchDynamicDesign: (patch) =>
        set((s) => ({ dynamicBrand: { ...s.dynamicBrand, design: { ...s.dynamicBrand.design, ...patch } } })),
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
      version: 9,
      // The content persists; the tabs deliberately do NOT (and the style is
      // re-rolled on load — see onRehydrateStorage). Every load opens the
      // Simple panel of the static designer, because that is the clean front
      // door — a returning visitor should not be dropped into the Advanced
      // control wall (or a camera-permission prompt) they happened to end on
      // last time. `codeType` goes with them: a barcode preview under the
      // Simple URL box is the exact controls/preview mismatch onModeChange
      // guards against, and `barcodeValue` still persists, so re-picking
      // Advanced ▸ Type ▸ Barcode brings the work straight back.
      partialize: (s) => ({
        config: s.config,
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
          mode?: StudioMode
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
        // v7 stopped persisting the tabs. Dropping them from `partialize` alone
        // is not enough: persist shallow-merges the stored record over the
        // initial state, so an existing v6 record would keep restoring its old
        // `mode` / `view` / `codeType` forever and the app would still open
        // wherever that user last was. Strip them once, here.
        if (version < 7) {
          delete p.mode
          delete p.view
          delete p.codeType
        }
        // v8 added the star's placement and its backdrop colour. Same backfill
        // reasoning as every one above — persist replaces `config` wholesale —
        // and with a sharper edge than most: `starPlacement` undefined is not
        // 'inside', it is a value the geometry compares against 'behind' and the
        // controls feed to a radio group. A returning user with a Star design
        // would get the right picture by luck and a control with nothing
        // selected. Missing has to mean 'inside', the arrangement they saved.
        if (version < 8 && p.config) {
          p.config = {
            ...p.config,
            starPlacement: p.config.starPlacement ?? 'inside',
            starColor: p.config.starColor ?? DEFAULT_CONFIG.starColor
          }
        }
        // v9 folded DynamicBrand's hand-mirrored style fields into one `design`
        // bag — see the interface. The old record's fields are exactly the
        // QrDesign keys they were named after, with one exception: `twoTone` was
        // the INVERSE of `matchCornerColor`, and reading a missing one as false
        // would give every returning user two-tone corners they never chose.
        if (version < 9 && p.dynamicBrand && !(p.dynamicBrand as { design?: unknown }).design) {
          const old = p.dynamicBrand as Partial<DynamicBrand> & {
            twoTone?: boolean
          } & Partial<QrConfig>
          const { color, logoMode, logo, twoTone, ...style } = old
          p.dynamicBrand = {
            color: color ?? null,
            logoMode: logoMode ?? 'org',
            logo: logo ?? null,
            design: { ...style, matchCornerColor: twoTone !== true },
          }
        }
        return p as unknown as QrState
      },
      // Every load opens on a random style — Classic one visit, Star the next.
      //
      // It hangs off rehydration rather than a mount effect in a component for
      // two reasons. Order: the persisted config is written into the store here,
      // so a shuffle anywhere earlier would be immediately overwritten by last
      // session's design. And count: a component effect runs again on every
      // remount (and twice per mount under StrictMode), which would re-roll the
      // style when you switch tabs — this fires exactly once per page load.
      onRehydrateStorage: () => (state) => {
        state?.shufflePreset()
        state?.restoreDefaultAddress()
      }
    }
  )
)
