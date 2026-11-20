// Universal QR's own creative layout, rendered by the UNI·SIM store kit
// (Docs_UNI_SIM/store-kit/build.mjs reads it through store.json "layouts";
// the look is store.css).
//
//   code-header  The App Store product page header (3840×1646, 21:9), which
//                the open-source portal's app grid also shows as the card art
//                and the square's peek (backoffice/opensource-portal
//                scripts/spotlight-art.sh). Built the way Jukebox's
//                sleeve-header is: the icon's own idea blown up on a two-tone
//                join, one phone either side. Here it is a real code, styled
//                the way the app styles one (dot modules, rounded eyes with
//                orange pupils, the app's icon as the logo, modules cleared
//                behind it), on a white card standing on the paper / orange
//                join. It scans: it opens the app's page on the portal. No
//                words, so one render serves every language.
//
// The matrix comes from qrcode-generator, the encoder the app itself draws
// with (a dependency of qr-code-styling), so `npm install` the app first.
// `raw` is [left phone, right phone]. Geometry is in stage pixels.

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const qrcode = require('qrcode-generator')

const URL = 'https://opensource.unisim.co.uk/qr'
const INK = '#1c1714'

/** The code as SVG in module units, `q` modules of quiet zone round it. */
function code(text, q) {
  const qr = qrcode(0, 'H')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  const size = n + 2 * q
  // The logo hole: a centred square about a fifth of the code, odd-sized so
  // it sits on the module grid. H recovers 30%; this clears about 5%.
  const hole = Math.round(n * 0.22) | 1
  const h0 = (n - hole) / 2
  const inEye = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
  const inHole = (r, c) => r >= h0 - 0.5 && r < h0 + hole && c >= h0 - 0.5 && c < h0 + hole
  let dots = ''
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || inEye(r, c) || inHole(r, c)) continue
      dots += `<circle cx="${q + c + 0.5}" cy="${q + r + 0.5}" r="0.44"/>`
    }
  }
  const eye = (x, y) => `
    <path d="M${x + 1.6} ${y}h3.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6h-3.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6zM${x + 1.9} ${y + 1}a.9 .9 0 0 0-.9 .9v3.2a.9 .9 0 0 0 .9 .9h3.2a.9 .9 0 0 0 .9-.9v-3.2a.9 .9 0 0 0-.9-.9z" fill="${INK}" fill-rule="evenodd"/>
    <rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.8" fill="url(#qr-orange)"/>`
  const logo = hole - 1
  return {
    size,
    svg: `<svg class="qr-code" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <defs><linearGradient id="qr-orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fe8c01"/><stop offset="1" stop-color="#e05504"/></linearGradient></defs>
      <g fill="${INK}">${dots}</g>
      ${eye(q, q)}${eye(q + n - 7, q)}${eye(q, q + n - 7)}
      <clipPath id="qr-logo"><rect x="${q + h0 + 0.5}" y="${q + h0 + 0.5}" width="${logo}" height="${logo}" rx="${logo * 0.22}"/></clipPath>
      <image href="/icon.png" x="${q + h0 + 0.5}" y="${q + h0 + 0.5}" width="${logo}" height="${logo}" clip-path="url(#qr-logo)"/>
    </svg>`,
  }
}

function stage(ctx, inner) {
  const c = ctx.cls
  return `<div class="canvas qrh" style="--fit:${ctx.fit}"><div class="stage clip" style="--stage-w:${c.stage[0]}px;--stage-h:${c.stage[1]}px">${inner}</div></div>`
}

export function codeHeader(ctx, t, [l, r]) {
  const { device } = ctx.kit
  const c = ctx.cls, [W, H] = c.stage
  if (c.frame !== 'iphone' || W !== 3840) throw new Error('code-header is drawn for the 3840×1646 header class only')
  const cx = W / 2
  const card = Math.round(H * 0.76)
  const half = card / 2
  const cy = Math.round(H * 0.47)
  const { svg } = code(URL, 4)
  const devW = 600, top = Math.round(H * 0.13)
  const [size, inset] = c.mark
  return stage(ctx, `
    <div class="qr-paper" style="left:0;width:${W / 2}px"></div><div class="qr-orange" style="left:${W / 2}px;width:${W / 2}px"></div>
    <div class="qr-card" style="left:${Math.round(cx - half)}px;top:${Math.round(cy - half)}px;width:${card}px;height:${card}px">${svg}</div>
    ${device(ctx, l, { w: devW, left: Math.round(cx - half - devW * 0.97), top, rot: -6, z: 3 })}
    ${device(ctx, r, { w: devW, left: Math.round(cx + half + devW * 0.02), top, rot: 6, z: 3 })}
    <img class="unisim-mark" src="/kit/brand/unisim-icon-white.png" alt="UNI·SIM" style="width:${size}px;right:${inset}px;top:${inset}px">`)
}

export const LAYOUTS = { 'code-header': codeHeader }
