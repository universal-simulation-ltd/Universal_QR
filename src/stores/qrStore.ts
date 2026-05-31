import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, type QrConfig } from '../lib/qr'

interface QrState {
  config: QrConfig
  /** Shallow-merge a patch into the current config. */
  update: (patch: Partial<QrConfig>) => void
  /** Replace the whole config (used by presets, which patch a base). */
  applyPatch: (patch: Partial<QrConfig>) => void
  setLogo: (dataUrl: string) => void
  clearLogo: () => void
  reset: () => void
}

export const useQrStore = create<QrState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      update: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      applyPatch: (patch) => set((s) => ({ config: { ...s.config, ...patch } })),
      setLogo: (dataUrl) => set((s) => ({ config: { ...s.config, logoDataUrl: dataUrl } })),
      clearLogo: () => set((s) => ({ config: { ...s.config, logoDataUrl: null } })),
      reset: () => set({ config: DEFAULT_CONFIG })
    }),
    {
      name: 'universal-qrs:config',
      version: 1
    }
  )
)
