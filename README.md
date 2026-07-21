# Universal QR

> Design branded, styled QR codes that just work — free and open source.

> Open source — self-host free or hosted by UNI SIM.

A clean Progressive Web App for designing **branded QR codes** entirely in your
browser. Choose your colours, shape the modules, drop in your logo, and export a
crisp PNG, SVG, JPEG or WebP — with no upload to a server. Everything is
generated on your device.

**[Try the live app →](https://opensource.unisim.co.uk/qr)**

Part of the [Universal Apps](https://opensource.unisim.co.uk) suite by
[UNI SIM](https://www.unisim.co.uk).

## Features

- **Content** — give each code a name (used as the download filename) and the
  URL or text it encodes
- **Colours** — pick module and background colours, knock the background out for
  a transparent export, blend the modules with a two-colour **gradient**, or
  give the three finder corners their own colour for a two-tone look
- **Shape & size** — six module styles (square, rounded, extra-rounded, dots,
  classy, classy-rounded), independent corner-frame and corner-dot styling, a
  size slider (128–1024 px), quiet-zone margin, and selectable error-correction
- **Branding** — upload your own logo (PNG, JPG or SVG) to sit in the centre,
  with size, padding and "clear modules behind logo" controls
- **UNI·SIM mark** — every code carries a small UNI·SIM mark: in the centre by
  default, or tucked into the bottom-right corner once you add your own logo
  (toggle it off any time)
- **Live preview** — the code re-renders as you type; what you see is exactly
  what exports
- **Export** — download as **PNG, SVG, JPEG or WebP**, or copy the PNG straight
  to your clipboard
- **Local-first** — nothing leaves your device; your last design is remembered
  in the browser
- **Installable** PWA — add to home screen on phone or install on desktop; works
  offline after first load

## How to use

1. **Enter a URL** (or any text) and give your code a name
2. **Pick a preset** to start, then fine-tune colours, module shape and size
3. **Add your logo** under *Logo & branding* if you want your own mark in the
   centre
4. **Choose a format** and hit **Download** — or **Copy** the PNG to paste
   elsewhere

> **Tip:** when using a logo, keep error correction at **Q** or **H** and
> scan-test the code before printing at small sizes.

## Development

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/),
[Tailwind CSS](https://tailwindcss.com/) and
[qr-code-styling](https://github.com/kozakdenys/qr-code-styling). The shared
navigation bar comes from [`@unisim/sdk`](https://www.npmjs.com/package/@unisim/sdk).

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
