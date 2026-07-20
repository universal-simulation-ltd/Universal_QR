import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, type QrConfig } from '../lib/qr'

export type StudioMode = 'simple' | 'branding' | 'advanced'
/** Top-level tab: the free static designer, or the hosted Dynamic codes. */
export type StudioView = 'static' | 'dynamic'

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
}
export const DEFAULT_DYNAMIC_BRAND: DynamicBrand = { color: null, logoMode: 'org', logo: null }

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
      setLogo: (dataUrl) => set((s) => ({ config: { ...s.config, logoDataUrl: dataUrl } })),
      clearLogo: () => set((s) => ({ config: { ...s.config, logoDataUrl: null } })),
      reset: () => set((s) => ({ config: DEFAULT_CONFIG, mode: s.mode })),
      dynamicBrand: DEFAULT_DYNAMIC_BRAND,
      setDynamicBrand: (patch) => set((s) => ({ dynamicBrand: { ...s.dynamicBrand, ...patch } })),
      resetDynamicBrand: () => set({ dynamicBrand: DEFAULT_DYNAMIC_BRAND }),
      hostedStoreOpen: false,
      setHostedStoreOpen: (hostedStoreOpen) => set({ hostedStoreOpen })
    }),
    {
      name: 'universal-qr:config',
      version: 1,
      // Only the design + chosen tabs persist — not the transient dialog flag.
      partialize: (s) => ({ config: s.config, mode: s.mode, view: s.view, dynamicBrand: s.dynamicBrand })
    }
  )
)
