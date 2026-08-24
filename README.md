# Universal QR

> Design branded QR codes, generate barcodes and scan them back — free and open
> source.

> Open source — self-host free or hosted by UNI SIM.

A clean Progressive Web App for **QR codes and barcodes**. Design a branded QR
code, generate a retail or shipping barcode, or point your camera at either one
to read it back — all of it in the browser, on your device, with nothing
uploaded to a server.

There are three tabs:

| Tab | What it does | |
|---|---|---|
| **QR** | Design and export branded, styled QR codes — and 1D barcodes, via Advanced ▸ Type | free · on your device |
| **Scan** | Read QR codes and barcodes with your camera | free · on your device |
| **Dynamic** | One printed code, a destination you can change, with scan counts | hosted · sign-in |

The first two never touch the network. **Dynamic** is the one exception — it
is a hosted feature, and it says so on the tab.

**[Try the live app →](https://opensource.unisim.co.uk/qr)**

Part of the [Universal Apps](https://opensource.unisim.co.uk) suite by
[UNI SIM](https://www.unisim.co.uk).

## Features

### QR — branded QR codes

- **Content** — give each code a name (used as the download filename) and the
  URL or text it encodes
- **Colours** — pick module and background colours, knock the background out for
  a transparent export, blend the modules with a two-colour **gradient**, or
  give the three finder corners their own colour for a two-tone look
- **Shape & size** — six module styles (square, rounded, extra-rounded, dots,
  classy, classy-rounded), independent corner-frame and corner-dot styling, a
  size slider (128–1024 px), quiet-zone margin, and selectable error-correction
- **Code shape** — put the code on a circle, squircle, hexagon or star plate
  instead of a square. The code itself is never clipped: it is drawn smaller and
  centred inside the shape, because a QR needs every module and its quiet zone
- **Star placement** — a star can hold the code *inside* its points, or sit
  **behind** it as a backdrop with the five points showing around the code. The
  backdrop version fits a much bigger code (72% of the image against 47%), so it
  is both the bolder look and the easier one to scan; it gets its own **star
  colour**, since the code now needs a background of its own underneath
- **Plate decoration** — fill the space a shaped plate leaves around the code
  with a radiating **Burst** or a **Scatter** of dots, so the shape reads as
  designed rather than as a square code on a round background. It needs that
  space, so the code is drawn smaller again — export larger and scan-test
- **Branding** — upload your own logo (PNG, JPG or SVG) to sit in the centre,
  with size, padding and "clear modules behind logo" controls
- **UNI·SIM mark** — every code carries a small UNI·SIM mark: in the centre by
  default, or tucked into the bottom-right corner once you add your own logo
  (toggle it off any time)
- **Style roulette** — every load opens on a random one of the six presets, and
  **Regenerate style** under the preview deals another without a reload. Only
  the look changes: your URL, name and logo stay exactly where they were
- **Live preview** — the code re-renders as you type; what you see is exactly
  what exports
- **Export** — download as **PNG, SVG, JPEG or WebP**, or copy the PNG straight
  to your clipboard

### Barcodes — 1D retail and shipping codes

Not a tab of its own: set **Advanced ▸ Type** to **Barcode**, then choose the
symbology under **Content** — the same place the QR side picks link, Wi-Fi or
contact.

- **Five symbologies**, the ones people actually reach for — **Code 128** (any
  text, the general-purpose one), **EAN-13** and **UPC-A** (retail in Europe and
  the US), **Code 39** (asset tags and older industrial systems) and **ITF-14**
  (shipping cartons)
- **Check digits done for you** — supply the payload one digit short (12 digits
  for EAN-13, 11 for UPC-A, 13 for ITF-14) and the final check digit is
  calculated; paste the full-length value instead and it is verified
- **Guided input** — each type carries its own hint, example and validation, so
  a bad value is caught as you type rather than at print time
- **Live preview** — the bars redraw as you type, with the human-readable value
  printed underneath
- **Export** — download as **PNG or SVG**, or copy the PNG to your clipboard

Barcodes are deliberately plain: no logo, no colours, no branding. A 1D code has
to survive a cheap laser scanner, and decoration is what breaks it.

### Scan — read a code with your camera

- **QR and 1D** — reads QR codes and barcodes (EAN, UPC, Code 128, Code 39 and
  the rest) from the live camera
- **The camera stays off until you ask** — nothing starts on opening the tab, so
  you never get a surprise permission prompt; the camera is released again when
  you stop or switch tabs
- **Tells you what it found** — the code's format, the decoded text, a **Copy**
  button, and an **Open link** button when the result is a URL
- **On-device** — frames are decoded in the browser and never uploaded

### Dynamic — one code, a destination you can change *(hosted)*

Everything above is free and offline. Dynamic codes are the hosted exception:
they need somewhere to live in order to redirect and to count scans.

- **Re-point a printed code** — the code encodes a fixed short link, and you
  change where that link sends people whenever you like. The printed artwork
  never changes
- **Scan analytics** — a total scan count, the time of the last scan, and a
  30-day sparkline per code
- **Branded by default** — dynamic codes pick up your organisation's colour and
  icon automatically, with per-field overrides if you want something else
- **Sign-in required** — codes are held against your
  [Universal ID](https://app.unisim.co.uk). Each live code uses one token; every
  account gets one free, and deleting a code returns its token

### Across the app

- **Local-first** — the QR and Scan tabs never upload anything; your last
  design is remembered in the browser
- **Built to actually scan** — the default design and every preset are checked by
  rendering them through this app's own pipeline and decoding the result with its
  own reader, at export size and at 96 px. If you change the colours yourself, the
  designer warns you when the code comes out inverted (light modules on a dark
  ground, which strict readers refuse) or when the contrast is too thin to read
  reliably — including on the three corner squares, which a scanner has to find
  before it reads anything else
- **Installable** PWA — add to home screen on phone or install on desktop; works
  offline after first load (the Dynamic tab needs a connection)

## How to use

**To design a QR code:**

1. **Enter a URL** (or any text) and give your code a name — the box starts on
   `https://unisim.co.uk` so there is a real code on screen from the first
   second; your own address replaces it and survives a reload
2. **Keep the style you landed on, hit Regenerate for another, or pick a preset**
   — then fine-tune colours, module shape and size
3. **Add your logo** under *Logo & branding* if you want your own mark in the
   centre
4. **Choose a format** and hit **Download** — or **Copy** the PNG to paste
   elsewhere

**To generate a barcode:** in the QR tab, switch to **Advanced**, set **Type** to
**Barcode**, then pick the symbology your scanner or system expects under
**Content**, enter the value, and download the PNG or SVG.

**To read a code:** open the **Scan** tab, hit **Start scanning** and point your
camera at it.

> **Tip:** when using a logo, keep error correction at **Q** or **H** and
> scan-test the code before printing at small sizes. The same goes for
> barcodes — always scan-test before a small print run.

## Development

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/) and
[Tailwind CSS](https://tailwindcss.com/). The codes themselves come from
[qr-code-styling](https://github.com/kozakdenys/qr-code-styling) (QR),
[bwip-js](https://github.com/metafloor/bwip-js) (1D barcodes) and
[ZXing](https://github.com/zxing-js/browser) (camera scanning). The shared
navigation bar comes from [`@unisim/sdk`](https://www.npmjs.com/package/@unisim/sdk).

bwip-js and ZXing are both loaded on demand — the first time you pick a barcode
type, or open the **Scan** tab — so they stay out of the initial bundle and the
QR designer's first paint is unaffected.

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check and build for production → dist/
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

The app is a single static bundle. In production it's served under `/qr/` (see
`vite.config.ts` and `public/_redirects`); local dev runs at the root.

Each build bakes the commit SHA into a `<meta name="build-sha">` tag and logs
`build: <sha>` to the console at startup, so you can tell which build is live
in-browser. On Cloudflare Pages the SHA comes from `CF_PAGES_COMMIT_SHA`; locally
it falls back to the git short SHA (or `dev`).

## Desktop app (Windows)

The same client-side app can be packaged as a native desktop app with
[Electron](https://www.electronjs.org/). The Electron main process lives in
[`electron/main.cjs`](electron/main.cjs) and loads the built bundle; the
`desktop` Vite mode builds with a relative `base` (`./`) and without the PWA
service worker so assets resolve over `file://`.

```sh
npm run build:desktop   # build the web bundle for Electron (dist/)
npm run electron        # run the packaged-style app against that build
npm run dist:win        # build + produce a Windows installer in release/
```

`npm run dist:win` emits an NSIS `.exe` installer under `release/`. **It must
run on Windows** (or Linux/macOS with Wine) because electron-builder packages a
platform-native binary; cross-building from a plain Linux host won't produce a
working Windows `.exe`. The first run downloads the Electron binary (~100 MB).

To cut a release, push a `v*` tag — the
[`build-windows`](.github/workflows/build-windows.yml) workflow builds the
installer on `windows-latest` and attaches it to the matching GitHub Release.
Manual `workflow_dispatch` also works for ad-hoc builds; the installer is
uploaded as a workflow artifact in that case.

## License

[MIT](LICENSE) © 2026 James Markey / Universal Simulation Ltd
