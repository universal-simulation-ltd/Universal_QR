import {
  storeHostedFile,
  putHostedObject,
  deleteHostedUpload,
  downloadHostedObject,
  type HostedUpload,
} from '@unisim/sdk'
import { renderQrBlob } from './download'
import { hostedQrPath, hostedQrPathCandidates, hostedQrRemovalPaths, newObjectId, sidecarPath } from './hostedPaths'
import type { QrConfig } from '@unisim/qr'
import { getT } from '../i18n'

// Online storage for Universal QR. Local saves (the device gallery in
// SavePanel) stay free and on-device; saving to an account keeps a QR PNG
// online against the user's Universal ID — five free saves per account, then
// purchased tokens (migration 0127; the free count is deliberately not
// surfaced). Alongside the PNG we store the full design as a `.json` sidecar
// so Universal PDF's QR dialog can list account saves as editable designs, not
// just flat images. Backend: 0041 + 0127 + the @unisim/sdk hosted helpers.
//
// Where the bytes live is the ROW's call, not this app's (migration 0226):
// new saves offer Cloudflare R2 and the server picks, and every row says which
// in `storage_backend`. Older saves — and anything an older native build makes
// — are on Supabase Storage and stay there, so every read, write and delete
// goes through the SDK helpers with the row's own backend.

type Supabase = Parameters<typeof storeHostedFile>[0]

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

  // Reserve the slot, then upload the PNG to whichever backend the server
  // chose; storeHostedFile frees the slot itself if the upload fails.
  const stored = await storeHostedFile(supabase, {
    product: 'qr',
    storagePath: path,
    fileName,
    body: blob,
    contentType: 'image/png',
  })
  if (!stored.ok || !stored.upload_id) {
    return { ok: false, error: stored.error ?? getT()('dynamic.backup_could_not_save_now') }
  }

  // The design sidecar, best-effort: Universal PDF's QR dialog reads it to
  // restore this save as a fully editable design. A failure here still leaves
  // a valid PNG-only backup (which that dialog places as a plain image).
  //
  // ⚠️ LOOK AT THE RESULT. `upload()` reports a refusal in `error`, it does not
  // reject, so the old `.catch(() => undefined)` was blind to the only failure
  // that ever actually happened: `hosted-uploads` carries a MIME allow-list
  // (0041/0095) that had no `application/json` on it, so storage refused every
  // sidecar ever written while the save still reported success — so every
  // account save was PNG-only and landed in Universal PDF as a flat picture.
  // Fixed by migration 0128; this warning is what would have said so.
  //
  // The sidecar goes on the same backend as its PNG — R2 signs `<png>.json`
  // against the PNG's row, so it never needs a row of its own.
  try {
    const { error: sideErr } = await putHostedObject(supabase, {
      backend: stored.storage_backend,
      path: sidecarPath(path),
      body: new Blob([JSON.stringify(config)], { type: 'application/json' }),
      contentType: 'application/json',
    })
    if (sideErr) {
      console.warn(
        `[qr] design sidecar not stored for ${path} — this save will open in Universal PDF ` +
          `as a flat image rather than an editable code: ${sideErr.message}`,
      )
    }
  } catch (err) {
    console.warn('[qr] design sidecar not stored:', err)
  }

  return { ok: true, creditsRemaining: stored.credits }
}

/** Delete a hosted QR (storage objects first — PNG plus any design sidecar —
 *  then free the slot / refund the token).
 *
 *  Removes EVERY path the bytes could be under, sidecars included, not just the
 *  one the ledger names: a legacy row says `pending`, so deleting only that
 *  would free the slot and leave the real PNG orphaned in the bucket forever,
 *  with the row that pointed at it gone. */
export async function deleteHostedQr(supabase: Supabase, upload: HostedUpload): Promise<StoreResult> {
  // An R2 row is removed (PNG and sidecar) and refunded in one call to the
  // hosted-files function; the removal paths only matter on Supabase.
  const res = await deleteHostedUpload(supabase, upload, hostedQrRemovalPaths(upload))
  if (!res.ok) return { ok: false, error: res.error ?? getT()('dynamic.backup_could_not_delete_now') }
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
    const { data, error } = await downloadHostedObject(supabase, { backend: upload.storage_backend, path })
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
