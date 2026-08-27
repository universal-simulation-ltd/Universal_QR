# Universal QR — docs

## What this repo is

Universal QR is a clean Progressive Web App for **designing branded, styled QR
codes entirely in the browser** — pick colours and gradients, shape the
modules and corner finders, drop in a centre logo, and export a crisp PNG,
SVG, JPEG or WebP. Everything is generated on-device; nothing is uploaded, and
your last design is remembered locally.

- **Live:** [opensource.unisim.co.uk/qr](https://opensource.unisim.co.uk/qr)
  — served by path via the `opensource-portal` Worker, which proxies `/qr` to
  the Git-connected `universal-qr` Cloudflare Pages project.
- **Stack:** Vite + React 18 + TypeScript PWA built on
  [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling);
  installable, works offline after first load. Shared navbar from
  `@unisim/sdk`.
- **Wrappers:** an `electron/` folder provides a desktop build
  (`npm run dist`), and a `capacitor.config.ts` exists for native mobile
  packaging. Desktop apps are shipped unsigned per suite policy.
- **UNI·SIM mark:** generated codes carry a small UNI·SIM mark by default
  (baked into `src/lib/unisimMark.ts`); it can be toggled off.

MIT licensed — free and open source, like all Universal Apps.

## Two tabs: Static (free/local) and Dynamic (hosted/PRO)

A top-level **Static | Dynamic** switch sits above the studio (`components/qr/QrApp.tsx`,
top-level `view` in `stores/qrStore.ts`).

- **Static** — the original designer (`QrStudio.tsx`), **completely unchanged**:
  100% on-device, no tracking, the URL is baked into the pixels.
- **Dynamic (hosted/PRO)** — a signed-in user mints a code that encodes a fixed
  short redirect **`opensource.unisim.co.uk/qr/r/<code>`**. They can re-point the
  destination any time and see **scan analytics** (total + last scan + a 30-day
  sparkline). Each live code **holds one token** (the org's free "Everyday" token
  first, then a purchased `subscriptions.credits` token) for its lifetime,
  returned when the code is deleted.
  UI: `components/qr/DynamicStudio.tsx` + `DynamicCodeCard.tsx`; data helpers in
  `lib/dynamicCodes.ts`.

### Backing up a static design ("Back up this QR code" dialog)

Two tiers, both in `components/qr/HostedStoreDialog.tsx`:

- **Save to this device** (`SavePanel.tsx`) — free, no account, localStorage.
  Universal PDF's QR dialog reads this store directly on the shared origin.
- **Save to your account** — signed in with a Universal ID, the PNG is stored
  online (`hosted_uploads`, product `'qr'`) **with the full design as a
  `<png-path>.json` sidecar**, so Universal PDF's QR dialog lists account saves
  as editable designs on any device. Every account gets **five free static
  saves** (migration 0127 — counted as live free-funded rows, freed on delete;
  deliberately not surfaced in the UI), then the purchased wallet takes over.
  These slots are separate from the Dynamic free token: static saves can
  neither consume nor block it. The old "Save to desktop" backup-file tier was
  removed 2026-08-26 (account saves cover the cross-device case).

### ⚠️ Account saves and the `pending` path that broke every one of them

`hosted_uploads` (migration 0041) enables RLS and grants members exactly two
policies: `hosted_uploads_member_read` (`for select`) and a platform-admin
`for all`. There is **no member UPDATE policy in 0041–0127**, on purpose — the
consume/refund RPCs are meant to be the only writers.

The store flow ignored that and was written in three steps:

1. `consumeHostedUpload({ storagePath: 'pending' })` — take the save slot,
2. upload the PNG to `<org_id>/qr/<upload_id>-<stem>.png` (+ the `.json` sidecar),
3. `UPDATE hosted_uploads SET storage_path = <the real path>`.

**Step 3 matched zero rows on every account that isn't the platform admin**, and
PostgREST reports that as a perfectly ordinary success — no error, just `0`.
The call site never looked at the result. So the ledger kept saying `pending`
for every account save ever made: the dialog listed it, and Open asked storage
for an object literally named `pending` — "Object not found", while the real PNG
sat safely in the bucket. Universal PDF's QR dialog reads the same column to
find the design sidecar, so account saves were unusable there too. `pending`
also has no org-id first segment, so it fails the bucket's read policy
(`storage.foldername(name)[1]`) as well as being absent.

The fix lives in `src/lib/hostedPaths.ts`:

* **Name the object before the slot is taken.** `hostedQrPath(orgId,
  newObjectId(), fileName)` is computed first and passed to
  `consumeHostedUpload`, so the RPC's own insert records the truth and the
  update that RLS was blocking no longer exists. ⚠️ **The accounting is
  untouched** — free static slot vs purchased wallet is decided entirely inside
  `hosted_consume_and_record` (0127), which only ever receives a path. Naming
  the object earlier cannot make a free save spend a token.
* **Recover the rows already filed as `pending`.** The old path was fully
  determined by data still on the row — `<org_id>/qr/<id>-<stem(file_name)>.png`
  — so `hostedQrPathCandidates()` rebuilds it and `openHostedQr` tries each in
  turn. Existing broken saves open; nothing has to be migrated or re-uploaded.
  ⚠️ **This is why `stemOf` must never drift.** It is pinned by
  `npm run test:hosted-paths`.
* **Fail honestly when there really is nothing there.** Only then does
  `openHostedQr` throw `HostedObjectMissingError`, and `HostedStoreDialog`
  answers it against the row itself: which file, that the save never finished,
  and one button to clear the entry and free the slot. A network or session
  failure is deliberately NOT reported that way.
* **Delete every candidate, sidecar included.** `hostedQrRemovalPaths()` pairs
  each candidate with its `<png-path>.json`, so freeing a legacy row cannot
  orphan its PNG or its design.

The same landmine was fixed in Universal PDF (`ffae15b`), Images, Exports and
Recorder — all five had copies of the identical three-step flow.

### How the redirect works (no shared-repo changes)

`public/_redirects` has a rule **above** the SPA fallback that 302s
`/qr/r/*` to the hosted Edge Function — so the whole redirect lives in this repo
plus Supabase; the `opensource-portal` Worker is untouched:

```
/qr/r/*  https://rygfxgalojojppxmhddo.functions.supabase.co/qr-redirect/:splat  302
```

### Backend (universal-platform, migration 0061)

- Tables `qr_dynamic_codes` (member-readable via RLS) + `qr_scans` (minimal,
  privacy-preserving: day / coarse country / referer-host — **no IP, no UA**).
- View `qr_dynamic_scan_daily` (security_invoker) for the sparkline.
- RPCs: `qr_dynamic_create` / `qr_dynamic_set_target` / `qr_dynamic_delete`
  (authenticated; token accounting reuses `acquire_token_hold`/`release_token_hold`
  from migration 0045), and `qr_resolve_and_log` (**service_role only**).
- Edge Function **`qr-redirect`** (deployed `--no-verify-jwt`): logs a scan via
  the service-role RPC and 302s to the current target; unknown codes get a small
  404 page. Source lives in `backoffice/universal-platform/supabase/functions/`.

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
