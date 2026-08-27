// Account-save object paths — the "object not found" regression.
//
//   npm run test:hosted-paths
//
// Runs under Node's type-stripping, so `hostedPaths.ts` is imported directly.
// ⚠️ That is why that module imports NOTHING: type-stripping cannot resolve the
// SDK or the zustand stores, and any import of theirs would take this red for a
// reason unrelated to paths.
//
// What is being pinned. `hosted_uploads` grants members SELECT and no UPDATE
// (migration 0041), so the old store flow's third step — reserve with
// `storage_path: 'pending'`, upload, then UPDATE the row with the real path —
// matched zero rows and reported success. Every save's ledger row therefore
// said `pending`, and opening one asked storage for an object of that name.
//
// The bytes were never lost: the uploader's path was fully determined by the
// row's own `org_id`, `id` and `file_name`. These tests hold that
// reconstruction exact — it is the only thing standing between a user and the
// saves already filed that way — and hold the new flow to naming the object
// before the save slot is taken, so no such row is ever written again.
//
// They also pin the `.json` design sidecar into the removal list: it is what
// Universal PDF's QR dialog reads to restore an account save as an editable
// design, and a delete that misses it leaves it orphaned in the bucket.
//
// Negative control (2026-08-27, run): reverting `hostedQrPathCandidates` to
// `[upload.storage_path]` turns 5 of these red — the legacy-recovery cases, the
// recorded-path-first ordering, and the sidecar removal list built on top of
// them. If a future edit makes them all pass trivially, check that first.

import {
  hostedQrPath,
  hostedQrPathCandidates,
  hostedQrRemovalPaths,
  isUsableStoragePath,
  newObjectId,
  sidecarPath,
  stemOf,
  PENDING_PATH,
} from '../src/lib/hostedPaths.ts'

let pass = 0
let fail = 0
const eq = (actual, expected, label) => {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a === e) {
    pass++
    console.log(`  ok   ${label}  -> ${a}`)
  } else {
    fail++
    console.log(`  FAIL ${label}\n       expected ${e}\n       actual   ${a}`)
  }
}

const ORG = '11111111-1111-4111-8111-111111111111'
const UPLOAD = '22222222-2222-4222-8222-222222222222'

console.log('stemOf (must not drift — legacy paths are rebuilt from it):')
eq(stemOf('my-site-qr.png'), 'my-site-qr', 'the extension is dropped and nothing else changes')
eq(stemOf('qr-code.svg'), 'qr-code', 'any extension, not just .png')
eq(stemOf('no-extension'), 'no-extension', 'a name with no dot is left alone')
eq(stemOf(''), 'qr-code', 'empty falls back exactly as the old flow did')
eq(stemOf(null), 'qr-code', 'no name at all')

console.log('\nhostedQrPath (org id first — every storage policy reads segment 1):')
eq(
  hostedQrPath(ORG, UPLOAD, 'my-site-qr.png'),
  `${ORG}/qr/${UPLOAD}-my-site-qr.png`,
  'org / product / id-stem.png',
)
eq(hostedQrPath(ORG, UPLOAD, null).startsWith(`${ORG}/`), true, 'always rooted at the org')
eq(hostedQrPath(ORG, UPLOAD, 'x.svg').endsWith('.png'), true, 'the object is always the PNG')

console.log('\nsidecarPath (Universal PDF reads this to restore an editable design):')
eq(sidecarPath(`${ORG}/qr/${UPLOAD}-my-site-qr.png`), `${ORG}/qr/${UPLOAD}-my-site-qr.png.json`, '.json appended')

console.log('\nisUsableStoragePath (what may be handed to storage as-is):')
eq(isUsableStoragePath(`${ORG}/qr/x-my-site-qr.png`, ORG), true, 'a real path')
eq(isUsableStoragePath(PENDING_PATH, ORG), false, "the 'pending' placeholder is not a path")
eq(isUsableStoragePath('', ORG), false, 'empty')
eq(isUsableStoragePath(null, ORG), false, 'null')
eq(
  isUsableStoragePath(`${UPLOAD}/qr/x-my-site-qr.png`, ORG),
  false,
  "another org's prefix would fail the bucket's read policy anyway",
)

console.log('\nhostedQrPathCandidates (the actual repair):')
eq(
  hostedQrPathCandidates({ id: UPLOAD, org_id: ORG, storage_path: `${ORG}/qr/${UPLOAD}-my-site-qr.png`, file_name: 'my-site-qr.png' }),
  [`${ORG}/qr/${UPLOAD}-my-site-qr.png`],
  'a healthy row yields exactly one candidate (no pointless second round trip)',
)
eq(
  hostedQrPathCandidates({ id: UPLOAD, org_id: ORG, storage_path: PENDING_PATH, file_name: 'my-site-qr.png' }),
  [`${ORG}/qr/${UPLOAD}-my-site-qr.png`],
  "a 'pending' row rebuilds the path the uploader really used",
)
eq(
  hostedQrPathCandidates({ id: UPLOAD, org_id: ORG, storage_path: null, file_name: null }),
  [`${ORG}/qr/${UPLOAD}-qr-code.png`],
  'a nameless pending row still resolves',
)
eq(
  hostedQrPathCandidates({ id: UPLOAD, org_id: ORG, storage_path: `${ORG}/qr/moved-elsewhere.png`, file_name: 'my-site-qr.png' }),
  [`${ORG}/qr/moved-elsewhere.png`, `${ORG}/qr/${UPLOAD}-my-site-qr.png`],
  'a recorded path is tried FIRST, with the legacy guess as the fallback',
)
eq(
  hostedQrPathCandidates({ id: UPLOAD, org_id: ORG, storage_path: `${ORG}/qr/${UPLOAD}-my-site-qr.png`, file_name: 'my-site-qr.png' }).length,
  1,
  'the two never duplicate when they agree',
)

console.log('\nhostedQrRemovalPaths (delete must not orphan a PNG or its sidecar):')
eq(
  hostedQrRemovalPaths({ id: UPLOAD, org_id: ORG, storage_path: `${ORG}/qr/${UPLOAD}-my-site-qr.png`, file_name: 'my-site-qr.png' }),
  [`${ORG}/qr/${UPLOAD}-my-site-qr.png`, `${ORG}/qr/${UPLOAD}-my-site-qr.png.json`],
  'a healthy row: the PNG and its design sidecar',
)
eq(
  hostedQrRemovalPaths({ id: UPLOAD, org_id: ORG, storage_path: PENDING_PATH, file_name: 'my-site-qr.png' }),
  [`${ORG}/qr/${UPLOAD}-my-site-qr.png`, `${ORG}/qr/${UPLOAD}-my-site-qr.png.json`],
  "a 'pending' row removes the real object, not the placeholder",
)
eq(
  hostedQrRemovalPaths({ id: UPLOAD, org_id: ORG, storage_path: `${ORG}/qr/moved-elsewhere.png`, file_name: 'my-site-qr.png' }).length,
  4,
  'both candidates and both sidecars when the row has moved',
)

console.log('\nnewObjectId (no secure-context dependency — the desktop app is file://):')
const idA = newObjectId()
const idB = newObjectId()
eq(typeof idA === 'string' && idA.length >= 16, true, 'long enough to be unique')
eq(idA === idB, false, 'two calls differ')
eq(/^[a-z0-9-]+$/.test(idA), true, 'safe in an object name')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
