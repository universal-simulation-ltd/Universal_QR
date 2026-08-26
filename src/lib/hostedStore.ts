import {
  consumeHostedUpload,
  refundHostedUpload,
  HOSTED_BUCKET,
  type HostedUpload,
} from '@unisim/sdk'
import { renderQrBlob } from './download'
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

  const consumed = await consumeHostedUpload(supabase, {
    product: 'qr',
    storagePath: 'pending',
    fileName,
    sizeBytes: blob.size,
  })
  if (!consumed.ok || !consumed.upload_id) {
    return { ok: false, error: consumed.error ?? 'Could not reserve a token.' }
  }

  const stem = fileName.replace(/\.[^.]+$/, '') || 'qr-code'
  const path = `${orgId}/qr/${consumed.upload_id}-${stem}.png`
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
    .upload(`${path}.json`, new Blob([JSON.stringify(config)], { type: 'application/json' }), {
      contentType: 'application/json',
      upsert: true,
    })
    .catch(() => undefined)

  await supabase.from('hosted_uploads').update({ storage_path: path }).eq('id', consumed.upload_id)
  return { ok: true, creditsRemaining: consumed.credits }
}

/** Delete a hosted QR (storage objects first — PNG plus any design sidecar —
 *  then free the slot / refund the token). */
export async function deleteHostedQr(supabase: Supabase, upload: HostedUpload): Promise<StoreResult> {
  await supabase.storage.from(HOSTED_BUCKET).remove([upload.storage_path, `${upload.storage_path}.json`])
  const res = await refundHostedUpload(supabase, upload.id)
  if (!res.ok) return { ok: false, error: res.error ?? 'Could not refund the token.' }
  return { ok: true, creditsRemaining: res.credits }
}

/** Open a hosted QR in a new tab (download → object URL). */
export async function openHostedQr(supabase: Supabase, upload: HostedUpload): Promise<void> {
  const { data, error } = await supabase.storage.from(HOSTED_BUCKET).download(upload.storage_path)
  if (error || !data) throw new Error(error?.message ?? 'Could not download the QR code.')
  const url = URL.createObjectURL(data)
  window.open(url, '_blank', 'noopener')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
