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
  returned when the code is deleted — same wallet model as "Hosted by UNI·SIM".
  UI: `components/qr/DynamicStudio.tsx` + `DynamicCodeCard.tsx`; data helpers in
  `lib/dynamicCodes.ts`.

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
