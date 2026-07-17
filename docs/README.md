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

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
