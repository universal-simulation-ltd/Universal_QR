import { DEFAULT_CONFIG, qrDisplayName, type QrConfig } from './qr'
import type { StudioMode } from '../stores/qrStore'

// "Save to desktop" backup for Universal QR — the editable middle tier between
// the free browser save (localDesigns) and the paid "Hosted by UNI·SIM" cloud.
// A backup is the design itself (the whole QrConfig, including any uploaded
// logo) as a small JSON file the guest keeps and re-imports later to carry on
// editing. It is NOT the rendered PNG — re-importing a picture couldn't restore
// an editable design.

const MAGIC = 'universal-qr-backup'
const VERSION = 1

interface BackupFile {
  app: typeof MAGIC
  version: number
  createdAt: string
  config: QrConfig
  mode?: StudioMode
}

export interface ParsedBackup {
  config: QrConfig
  mode?: StudioMode
}

/** Slug for the download filename, from the design's display name. */
function safeStem(config: QrConfig): string {
  const slug = qrDisplayName(config)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug || 'qr-code'
}

/** Serialise the current design to a JSON backup blob + suggested filename. */
export function buildBackup(config: QrConfig, mode?: StudioMode): { blob: Blob; fileName: string } {
  const payload: BackupFile = {
    app: MAGIC,
    version: VERSION,
    createdAt: new Date().toISOString(),
    config,
    mode,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  return { blob, fileName: `${safeStem(config)}.uniqr.json` }
}

/** Save the current design to the guest's device as a re-importable backup. */
export function downloadBackup(config: QrConfig, mode?: StudioMode): void {
  const { blob, fileName } = buildBackup(config, mode)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Read a previously-downloaded backup file back into an editable design.
 *  Throws a user-facing message if the file isn't a valid Universal QR backup.
 *  Fields are merged over DEFAULT_CONFIG so older/partial backups still load. */
export async function readBackupFile(file: File): Promise<ParsedBackup> {
  let json: unknown
  try {
    json = JSON.parse(await file.text())
  } catch {
    throw new Error("That file isn't a Universal QR backup (it isn't valid JSON).")
  }

  const data = json as Partial<BackupFile>
  if (!data || data.app !== MAGIC || typeof data.config !== 'object' || data.config === null) {
    throw new Error("That file isn't a Universal QR backup.")
  }
  if (typeof data.version === 'number' && data.version > VERSION) {
    throw new Error('This backup was made by a newer version of Universal QR — update the app to open it.')
  }

  const config: QrConfig = { ...DEFAULT_CONFIG, ...(data.config as QrConfig) }
  const mode =
    data.mode === 'simple' || data.mode === 'branding' || data.mode === 'advanced' ? data.mode : undefined
  return { config, mode }
}
