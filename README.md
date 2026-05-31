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

## License

[MIT](LICENSE) © 2026 James Markey / Universal Simulation Ltd
