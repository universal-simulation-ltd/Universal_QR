import type { QrConfig } from './qr'

// ── Saved-on-this-device QR designs ──────────────────────────────────────────
// A free, no-account way to keep the QR codes you design in this browser and
// reopen them later. We store the whole QrConfig (which already carries any
// uploaded centre logo as a data URI) plus a small rendered thumbnail for the
// gallery. Nothing leaves the device — the cloud counterpart is a Universal ID
// sign-in link, since Universal QR itself never talks to a backend.

const KEY = 'unisim.qr.designs.v1'
// A saved design carries the full config (and possibly a logo data URI), so keep
// the list short — localStorage is ~5 MB and newest-first wins past the cap.
const MAX = 12

export interface LocalDesign {
  id: string
  name: string
  /** The full design — restored verbatim, including any uploaded centre logo. */
  config: QrConfig
  /** Small PNG data URL rendered at save time, shown in the gallery. */
  thumbnail: string
  createdAt: string // ISO
}

export function loadLocalDesigns(): LocalDesign[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as LocalDesign[]) : []
  } catch {
    return []
  }
}

function persist(list: LocalDesign[]): LocalDesign[] {
  const capped = list.slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(capped))
  } catch {
    // Quota exceeded (or storage disabled) — drop the oldest and retry once.
    try {
      localStorage.setItem(KEY, JSON.stringify(capped.slice(0, Math.max(1, MAX - 3))))
    } catch {
      /* give up silently — the current design still works for export */
    }
  }
  return capped
}

// A short device-local id — no crypto identity needed, just a list key.
function makeId(): string {
  return `qr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export interface SaveDesignInput {
  name: string
  config: QrConfig
  thumbnail: string
}

// Save (or, if a design with the same encoded data + name already exists, update
// it in place and move it to the front) so re-saving a tweak doesn't pile up
// near-duplicates of the same code.
export function saveLocalDesign(input: SaveDesignInput): LocalDesign[] {
  const existing = loadLocalDesigns()
  const name = input.name.trim()
  const dupeIdx = existing.findIndex(
    (d) => d.config.data === input.config.data && d.name === name,
  )
  const entry: LocalDesign =
    dupeIdx >= 0
      ? { ...existing[dupeIdx], name, config: input.config, thumbnail: input.thumbnail }
      : {
          id: makeId(),
          name,
          config: input.config,
          thumbnail: input.thumbnail,
          createdAt: new Date().toISOString(),
        }
  const rest = existing.filter((_, i) => i !== dupeIdx)
  return persist([entry, ...rest])
}

export function removeLocalDesign(id: string): LocalDesign[] {
  return persist(loadLocalDesigns().filter((d) => d.id !== id))
}
