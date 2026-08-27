// Object paths for account-saved QR codes — and the repair for the ones the old
// flow filed under a name that was never real.
//
// ⚠️ THE LANDMINE THIS MODULE EXISTS FOR. `hosted_uploads` (migration 0041) has
// RLS enabled and grants members exactly ONE policy: `for select`. There is no
// member UPDATE policy anywhere in 0041–0127 — deliberately, because the
// consume/refund RPCs are meant to be the only writers. But the store flow was
// written as three steps:
//
//   1. consumeHostedUpload({ storagePath: 'pending' })   ← takes the save slot
//   2. upload the PNG to `<org>/qr/<upload_id>-<stem>.png` (+ a `.json` sidecar)
//   3. UPDATE hosted_uploads SET storage_path = <the real path>
//
// Step 3 matches no rows under RLS. PostgREST answers that with a perfectly
// happy "0 rows updated", the call site never looked at the result, and so
// EVERY saved QR's ledger row kept `storage_path = 'pending'`. The list in the
// Back up dialog reads the ledger, so the save shows up; opening it asks
// storage for an object literally named `pending`, which does not exist and
// never did — "Object not found", against a file that is sitting safely in the
// bucket the whole time. (Universal PDF's QR dialog reads the same column to
// find the design sidecar, so account saves were invisible to it too.)
//
// So this module does two things:
//
//   * `hostedQrPath` names the object BEFORE the slot is taken, so the ledger
//     records the truth at insert time and step 3 disappears; and
//   * `hostedQrPathCandidates` rebuilds where a legacy row's bytes actually
//     went. The old path was fully determined by data still on the row —
//     `<org_id>/qr/<id>-<stem(file_name)>.png` — so a 'pending' row is
//     recoverable, not lost. That is why the fix opens old saves instead of
//     only apologising for them.
//
// ⚠️ Nothing here touches the accounting. Which pocket a save comes out of —
// one of the five free static slots or the purchased wallet — is decided
// entirely inside `hosted_consume_and_record` (migration 0127); the client only
// ever hands it a path. Naming the object earlier cannot make a free save spend
// a token.
//
// Kept free of imports on purpose: `scripts/hostedPath.test.mjs` loads it under
// Node's type-stripping, which cannot resolve the SDK or the stores.

/** The `qr` segment of every Universal QR object path. */
export const HOSTED_PRODUCT = 'qr'

/** The placeholder the old three-step flow filed rows under. */
export const PENDING_PATH = 'pending'

/**
 * The object-name stem: the download filename with its extension dropped.
 * Byte-for-byte what the store flow has always done (the filename itself is
 * already slugged by `fileStem` in `download.ts`, so nothing further is needed
 * — and adding anything would break the legacy path reconstruction above,
 * which is the only reason old saves can be opened at all).
 */
export function stemOf(fileName: string | null | undefined): string {
  return (fileName ?? '').replace(/\.[^.]+$/, '') || 'qr-code'
}

/**
 * A unique object id, generated on the client so the path can be known before
 * the ledger row exists.
 *
 * ⚠️ Not `crypto.randomUUID()` on its own. That one is gated on a secure
 * context, and the packaged desktop app loads its renderer over `file://` —
 * where Chromium does grant it today, but where a single Electron or CSP change
 * would turn "back up this QR" into a thrown TypeError. `getRandomValues` has
 * no such gate, so it is the fallback rather than the other way round.
 */
export function newObjectId(): string {
  const c = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined
  if (c?.randomUUID) {
    try {
      return c.randomUUID()
    } catch {
      // fall through
    }
  }
  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16)
    c.getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}`
}

/**
 * Where a saved QR lives: `hosted-uploads/<org_id>/qr/<object_id>-<stem>.png`.
 *
 * The first segment MUST be the org id — every storage policy on the bucket
 * (0041, re-cut in 0093) reads it as `storage.foldername(name)[1]` and checks
 * `is_org_member(…)`. A path without it, `pending` being the obvious example,
 * fails the read policy as well as being absent, which is the second reason the
 * old rows could never be opened.
 */
export function hostedQrPath(orgId: string, objectId: string, fileName: string | null | undefined): string {
  return `${orgId}/${HOSTED_PRODUCT}/${objectId}-${stemOf(fileName)}.png`
}

/**
 * The design sidecar that sits next to a saved QR: the same path with `.json`
 * appended. Universal PDF's QR dialog reads it to restore an account save as a
 * fully editable design rather than a flat image, so it has to be carried
 * through every candidate — including on delete, or it outlives its PNG.
 */
export function sidecarPath(objectPath: string): string {
  return `${objectPath}.json`
}

/**
 * True when a ledger row's `storage_path` can be handed to storage as-is:
 * non-empty, not the `pending` placeholder, and rooted at the row's own org so
 * the bucket's member-read policy will allow it.
 */
export function isUsableStoragePath(path: string | null | undefined, orgId: string | null | undefined): boolean {
  if (typeof path !== 'string') return false
  const trimmed = path.trim()
  if (!trimmed || trimmed === PENDING_PATH) return false
  if (!orgId) return false
  return trimmed.startsWith(`${orgId}/`)
}

/** The fields of a `hosted_uploads` row this module needs. */
export interface HostedUploadRef {
  id: string
  org_id: string
  storage_path: string | null
  file_name: string | null
}

/**
 * Every place this save's bytes could be, best guess first: the path the ledger
 * records, then — for the 'pending' rows the old flow left behind — the path
 * the uploader would have used, rebuilt from the row's own id and name.
 *
 * De-duplicated, so a healthy row yields exactly one candidate and callers can
 * treat "all of them missed" as a genuine miss.
 */
export function hostedQrPathCandidates(upload: HostedUploadRef): string[] {
  const out: string[] = []
  const recorded = upload.storage_path?.trim()
  if (isUsableStoragePath(recorded, upload.org_id) && recorded) out.push(recorded)
  const legacy = hostedQrPath(upload.org_id, upload.id, upload.file_name)
  if (!out.includes(legacy)) out.push(legacy)
  return out
}

/**
 * Everything delete has to remove: every candidate PNG and its `.json` design
 * sidecar. A legacy row says `pending`, so removing only what the ledger names
 * would refund the slot and leave the real object — and its sidecar — orphaned
 * in the bucket forever, with the row that pointed at them gone.
 */
export function hostedQrRemovalPaths(upload: HostedUploadRef): string[] {
  return hostedQrPathCandidates(upload).flatMap((p) => [p, sidecarPath(p)])
}
