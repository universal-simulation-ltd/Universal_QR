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
  (baked into `@unisim/qr`, which this app takes its design model and
  renderer from); it can be toggled off.

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

### Each dynamic code owns its branding (migration 0129)

A code's look is **snapshotted onto its row** at creation — `design jsonb` on
`qr_dynamic_codes`, holding the full `QrDesign` from `@unisim/qr`.

Before 2026-08-29 the branding lived only in the client, in one `dynamicBrand`
store applied to every code at *render* time. That made the branding panel a
live filter rather than a default: editing it re-drew codes already printed on
flyers, and the same account on a second laptop drew them all differently again,
because that store is per-browser localStorage.

- The panel (**"Branding for new codes"**) sets what the NEXT code is born
  wearing. It cannot reach a code that already exists.
- Every card carries **✏️ Edit branding** — the same control set seeded from that
  code's own design, plus a **"Match branding for new codes"** shortcut. Saving
  calls `qr_dynamic_set_design` and re-draws that code and nothing else.
- `design = null` means "made before 0129": those still follow the panel, exactly
  as they did, and the card says so.

⚠️ **`design.data` and `design.name` are stored EMPTY** (`storableDesign`). The
payload is the redirect and the label is the row's `name`; `dynamicQrConfig`
writes both back on the way out. Copies on the design would give a renamed or
re-pointed code a second, staler answer to both — and **Universal PDF reads this
same column**, so the rule spans two repos. `scripts/dynamicDesign.test.mjs`
(`npm run test:dynamic-design`) pins it, with measured negative controls.

The control wall is **one component** (`components/qr/BrandingControls.tsx`) used
by the panel and by each card. An uploaded centre logo is downscaled to 512 px
(`lib/imageScale.ts`) before it becomes part of a design — it rides on the row
now, so a 4 MP photo would be carried on every list query in two apps. The
backend refuses a design over 1 MB with `design_too_large`.

### Universal PDF lists these codes too

Universal PDF's "Add a QR code" dialog reads `qr_dynamic_codes` through the
table's member RLS and shows each with an orange **↻** (its
`src/lib/qr/library.ts`). That is the second reason the design belongs on the
row rather than in a browser: PDF has no access to another app's localStorage on
a different origin.

### Opening the Dynamic tab locally

`?mockauth=1` (DEV builds only) swaps in the SDK's offline fixture world, which
is the only way to see any of this on localhost — sign-in happens on the hub and
sets its cookie on `.unisim.co.uk`. ⚠️ That world starts signed **out**
(`localStorage['universal:mock_session'] = 'james'` signs it in) and returns an
empty set for `qr_dynamic_codes`, so it gets you the panel and the create form
but never a card. For cards, stub instead: a session under
`localStorage['universal-suite-auth']` plus a Playwright route over
`**/rest/v1/**`.

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

### Backend (universal-platform, migrations 0061 + 0129)

- Tables `qr_dynamic_codes` (member-readable via RLS; `design jsonb` since 0129)
  + `qr_scans` (minimal, privacy-preserving: day / coarse country / referer-host
  — **no IP, no UA**).
- View `qr_dynamic_scan_daily` (security_invoker) for the sparkline.
- RPCs: `qr_dynamic_create` / `qr_dynamic_set_target` / `qr_dynamic_set_design` /
  `qr_dynamic_delete` (authenticated; token accounting reuses
  `acquire_token_hold`/`release_token_hold` from migration 0045), and
  `qr_resolve_and_log` (**service_role only**).
  ⚠️ 0129 **dropped and recreated** `qr_dynamic_create` to add `p_design`. A
  defaulted third parameter added with CREATE OR REPLACE leaves the 2-arg
  version standing as an overload, and PostgREST resolves by argument name — so
  every existing caller would start failing as ambiguous.
- Edge Function **`qr-redirect`** (deployed `--no-verify-jwt`): logs a scan via
  the service-role RPC and 302s to the current target; unknown codes get a small
  404 page. Source lives in `backoffice/universal-platform/supabase/functions/`.

## The Scan tab and camera permission

`components/qr/ScanStudio.tsx` decodes QR codes and 1D barcodes from a live
camera via `@zxing/browser` (lazy-loaded on first use, so the ~100 KB reader
never lands on anyone who only designs codes). Frames are decoded on-device and
never uploaded.

**Opening the tab shows the camera** (2026-09-04). It used to be start-on-tap;
the tab has one purpose, so the extra tap only meant every scan cost two taps
and a prompt instead of one prompt.

**The permission is the only gate**, and that ordering is the whole design:

| State | What happens |
|---|---|
| `granted` | Start, always. No preference read, no tap, no overlay — somebody who has already said yes does not get asked to say it again. |
| `denied` | Never start. The request fails instantly and silently, so the tab shows how to unblock instead, worded per platform (`blockedCameraHelp()`), because "allow it from the address bar" is useless on a phone. |
| `prompt` / `unknown` | Nobody has answered, so this is the one state where asking is a *choice*: `unisim.qr.scan.ask-on-open.v1` decides, and its checkbox is rendered **only here**. |

⚠️ **The preference is "should we ASK", never "should the camera start".** The
first cut had it wrapping the permission read, so an opt-out gated a *granted*
camera too — precisely the friction this change exists to remove. Only an
opt-*out* is ever written to storage, so a wiped or blocked localStorage lands
on the default (ask) rather than on silence. The checkbox is hidden once the
answer exists in either direction: over a granted camera it is a control for a
decision that no longer exists, and over a denied one "ask on open" is a promise
the platform will not keep.

`permission` starts as `null` (not yet read) so the controls render nothing
rather than flashing the wrong affordance for a frame. A `getUserMedia` that
resolves sets it to `granted` and one that rejects with `NotAllowedError` sets
it to `denied` — that is how Safari and the Capacitor WebViews, which don't
answer `permissions.query({name:'camera'})` at all, ever leave `unknown`.
`onCameraPermissionChange` picks up a grant made from browser/OS settings while
the tab is open (Chromium only; a nicety, never what correctness rests on).

### Who remembers the permission (they are not the same)

| Platform | Behaviour |
|---|---|
| iOS (Capacitor/WKWebView) | The OS prompt is once per install. Capacitor's `WebViewDelegationHandler` already answers the *second*, WebKit-level prompt (`requestMediaCapturePermissionFor` → `.grant`), so nothing extra is needed here. `NSCameraUsageDescription` is in `Info.plist`. |
| Android (Capacitor/WebView) | `BridgeWebChromeClient.onPermissionRequest` turns the WebView request into a real runtime CAMERA request, which the OS remembers. |
| Browsers | An https origin's granted camera is remembered per site. Safari and private windows re-ask per session — the browser's call, not the page's. |

⚠️ **`android.permission.CAMERA` must stay in `AndroidManifest.xml`.** Android
denies a runtime request for an undeclared permission *instantly and shows no
dialog at all*, so Capacitor's request came back denied and scanning could not
work on Android — with nothing on screen to explain why. It was undeclared
until 2026-09-04. `npm run cap:sync` is needed for the manifest change to reach
a built APK.

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
