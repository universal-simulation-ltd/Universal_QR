import {
  consumeHostedUpload,
  refundHostedUpload,
  HOSTED_BUCKET,
  type HostedUpload,
} from '@unisim/sdk'
import { renderQrBlob } from './download'
import { hostedQrPath, hostedQrPathCandidates, hostedQrRemovalPaths, newObjectId, sidecarPath } from './hostedPaths'
import type { QrConfig } from './qr'

// Online storage for Universal QR. Local saves (the device gallery in
// SavePanel) stay free and on-device; saving to an account keeps a QR PNG
// online against the user's Universal ID — five free saves per account, then
// purchased tokens (migration 0127; the free count is deliberately not
// surfaced). Alongside the PNG we store the full design as a `.json` sidecar
// so Universal PDF's QR dialog can list account saves as editable designs, not
// just flat images. Backend: 0041 + 0127 + the @unisim/sdk hosted helpers.

type Supabase = Parameters<typeof consumeHostedUpload>[0]

export interface StoreResult {
  ok: boolean
  error?: string
  creditsRemaining?: number
}

/** Take one save slot (free first, then a purchased token) and store the
 *  current QR (PNG, corner stamp baked in) in the cloud. Reserves the slot
 *  first, then uploads; a failed upload refunds it so the user is never
 *  charged for a file that isn't there. */
export async function storeCurrentQr(supabase: Supabase, orgId: string, config: QrConfig): Promise<StoreResult> {
  const { blob, fileName } = await renderQrBlob(config, 'png')

  // ⚠️ NAME THE OBJECT FIRST. This used to reserve the row with a placeholder
  // `storagePath: 'pending'`, upload, then UPDATE the row with the real path —
  // and that update silently did nothing on every account that isn't the
  // platform admin, because `hosted_uploads` grants members SELECT and nothing
  // else (0041). So the ledger kept saying `pending`, the dialog listed a save,
  // and opening it asked storage for an object named `pending`: "Object not
  // found", for a file that had uploaded perfectly. See `hostedPaths.ts` for
  // the full write-up and the legacy recovery.
  //
  // A client-side object id removes the round trip the RLS was blocking: the
  // path is known before the slot is taken, so the RPC records the truth at
  // insert time and there is no second write to fail. The accounting is
  // untouched — free static slot vs purchased token is decided inside
  // `hosted_consume_and_record` (0127), which only ever receives a path.
  const path = hostedQrPath(orgId, newObjectId(), fileName)

  const consumed = await consumeHostedUpload(supabase, {
    product: 'qr',
    storagePath: path,
    fileName,
    sizeBytes: blob.size,
  })
  if (!consumed.ok || !consumed.upload_id) {
    return { ok: false, error: consumed.error ?? 'Could not reserve a token.' }
  }

  const { error: upErr } = await supabase.storage
    .from(HOSTED_BUCKET)
    .upload(path, blob, { contentType: 'image/png', upsert: true })

  if (upErr) {
    await refundHostedUpload(supabase, consumed.upload_id)
    return { ok: false, error: upErr.message }
  }

  // The design sidecar, best-effort: Universal PDF's QR dialog reads it to
  // restore this save as a fully editable design. A failure here still leaves
  // a valid PNG-only backup (which that dialog places as a plain image).
  await supabase.storage
    .from(HOSTED_BUCKET)
    .upload(sidecarPath(path), new Blob([JSON.stringify(config)], { type: 'application/json' }), {
      contentType: 'application/json',
      upsert: true,
    })
    .catch(() => undefined)

  return { ok: true, creditsRemaining: consumed.credits }
}

/** Delete a hosted QR (storage objects first — PNG plus any design sidecar —
 *  then free the slot / refund the token).
 *
 *  Removes EVERY path the bytes could be under, sidecars included, not just the
 *  one the ledger names: a legacy row says `pending`, so deleting only that
 *  would free the slot and leave the real PNG orphaned in the bucket forever,
 *  with the row that pointed at it gone. */
export async function deleteHostedQr(supabase: Supabase, upload: HostedUpload): Promise<StoreResult> {
  await supabase.storage.from(HOSTED_BUCKET).remove(hostedQrRemovalPaths(upload))
  const res = await refundHostedUpload(supabase, upload.id)
  if (!res.ok) return { ok: false, error: res.error ?? 'Could not refund the token.' }
  return { ok: true, creditsRemaining: res.credits }
}

/**
 * Thrown when a listed save has no object behind it anywhere we know to look.
 *
 * A distinct type so the dialog can answer honestly — name the file, say the
 * upload never completed, and offer to clear the entry and take the save slot
 * back — instead of surfacing storage's bare "Object not found", which reads
 * like the app has lost the user's QR code.
 */
export class HostedObjectMissingError extends Error {
  readonly fileName: string
  constructor(fileName: string) {
    super(`"${fileName}" is listed as saved, but there is no file behind it.`)
    this.name = 'HostedObjectMissingError'
    this.fileName = fileName
  }
}

/**
 * Open a hosted QR in a new tab (download → object URL).
 *
 * Tries every candidate path in turn (see `hostedQrPathCandidates`), so the
 * saves the old three-step store flow filed as `pending` still open: their
 * bytes are in the bucket under the name the uploader used, which is fully
 * recoverable from the row itself. Only when nothing is there does this throw
 * — as `HostedObjectMissingError`, so the caller can offer the cleanup.
 */
export async function openHostedQr(supabase: Supabase, upload: HostedUpload): Promise<void> {
  let lastError: string | null = null

  for (const path of hostedQrPathCandidates(upload)) {
    const { data, error } = await supabase.storage.from(HOSTED_BUCKET).download(path)
    if (data && !error) {
      const url = URL.createObjectURL(data)
      window.open(url, '_blank', 'noopener')
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      return
    }
    lastError = error?.message ?? null
  }

  // Every candidate missed. Distinguish "not there" from "could not ask" — a
  // dropped connection or an expired session must NOT be reported as a dead
  // save, or the user is invited to delete a QR code that is perfectly fine.
  if (lastError && !/not.?found|does not exist|404/i.test(lastError)) {
    throw new Error(lastError)
  }
  throw new HostedObjectMissingError(upload.file_name || 'qr-code.png')
}
