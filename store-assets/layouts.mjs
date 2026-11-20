// Universal QR's own creative layout, rendered by the UNI·SIM store kit
// (Docs_UNI_SIM/store-kit/build.mjs reads it through store.json "layouts";
// the look is store.css).
//
//   code-header  The App Store product page header (3840×1646, 21:9), which
//                the open-source portal's app grid also shows as the card art
//                and the square's peek (backoffice/opensource-portal
//                scripts/spotlight-art.sh). Built the way Jukebox's
//                sleeve-header is: the icon's own idea blown up on a two-tone
//                join, with the app either side of it — but a laptop on the
//                left and a phone on the right (James, 2026-11-20: QR is
//                web-first, unlike Jukebox). Here it is a real code, styled
//                the way the app styles one (dot modules, rounded eyes with
//                orange pupils, the app's icon as the logo, modules cleared
//                behind it), on a white card standing on the paper / orange
//                join. It scans: it opens the app's page on the portal. No
//                words, so one render serves every language.
//
// The matrix comes from qrcode-generator, the encoder the app itself draws
// with (a dependency of qr-code-styling), so `npm install` the app first.
// `raw` is [phone]; the laptop shows LAPTOP, a capture from generate.mjs's
// opt-in laptop device (npm run build:desktop, then DEVICE=laptop node
// store-assets/generate.mjs 01). Geometry is in stage pixels.

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const qrcode = require('qrcode-generator')

const URL = 'https://opensource.unisim.co.uk/qr'
const LAPTOP = '/app/raw/laptop/01-designer.png'
// ── Geometry (James, 2026-11-20: "it doesn't look quite right") ─────────────
// The same rules as Universal PDF's page-header (its layouts.mjs says why):
// the paper / orange join runs under the card's centre; laptop and phone near
// true scale (phone ≈ 0.85 of the lid), upright on one baseline with contact
// shadows; the whole group centred, and the grid square's crop pointed at the
// card (PEEK_X). spotlight/scenes.js qr() in the open-source portal repeats
// the card's left, top and size (CARD_LEFT, CARD_TOP, CARD): change both.
const W = 3840, H = 1646
export const CARD = 1152
const LAP_W = 1500, PHONE_W = 400, OVERLAP = 60
const BASELINE = Math.round(H * 0.86)
const lapBase = (w) => Math.round(w * 1.14)
const GROUP = (lapBase(LAP_W) - LAP_W) / 2 + LAP_W + (CARD - OVERLAP) + (PHONE_W - OVERLAP)
const LAP_LEFT = Math.round((W - GROUP) / 2 + (lapBase(LAP_W) - LAP_W) / 2)
export const CARD_CX = LAP_LEFT + LAP_W - OVERLAP + CARD / 2
export const CARD_CY = Math.round(H * 0.47)
export const CARD_LEFT = CARD_CX - CARD / 2
export const CARD_TOP = CARD_CY - CARD / 2
export const PEEK_X = `${Math.round((100 * (CARD_CX - H / 2)) / (W - H))}%`
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

/**
 * `layer` splits the header for the portal's live scene (spotlight/scenes.js
 * qr()): 'back' is the ground and the empty white card, 'front' the phones and
 * mark alone on a transparent ground ("alpha": true in store.json). The scene
 * draws the code between them from MATRIX (below), so its finished state is
 * the flat header.
 */
function codeHeader(ctx, t, [r], layer = 'full') {
  const { device, deviceHeight } = ctx.kit
  const c = ctx.cls
  if (c.frame !== 'iphone' || c.stage[0] !== W) throw new Error('code-header is drawn for the 3840×1646 header class only')
  const { svg } = code(URL, 4)
  // laptop()'s own proportions: lid = bezel + 16:10 screen + chin, then base.
  const bezel = Math.round(LAP_W * 0.024), chin = Math.round(LAP_W * 0.034)
  const lidH = bezel + Math.round((LAP_W - 2 * bezel) * 0.625) + chin, baseH = Math.round(LAP_W * 0.028)
  const phoneH = deviceHeight(c.frame, PHONE_W, r.aspect)
  const phoneLeft = CARD_CX + CARD / 2 - OVERLAP
  const floor = (cx, w, h) => `<div class="floor qr-floor" style="left:${Math.round(cx - w / 2)}px;top:${Math.round(BASELINE - h / 2)}px;width:${Math.round(w)}px;height:${Math.round(h)}px"></div>`
  const [size, inset] = c.mark
  return stage(ctx, `
    ${layer === 'front' ? '' : `<div class="qr-paper" style="left:0;width:${CARD_CX}px"></div><div class="qr-orange" style="left:${CARD_CX}px;width:${W - CARD_CX}px"></div>
    <div class="qr-card" style="left:${CARD_LEFT}px;top:${CARD_TOP}px;width:${CARD}px;height:${CARD}px">${layer === 'full' ? svg : ''}</div>`}
    ${layer === 'back' ? '' : `${floor(LAP_LEFT + LAP_W / 2, lapBase(LAP_W) * 1.1, 90)}${floor(phoneLeft + PHONE_W / 2, PHONE_W * 1.5, 60)}
    ${ctx.kit.laptop(LAPTOP, { w: LAP_W, left: LAP_LEFT, top: BASELINE - lidH - baseH, z: 3 })}
    ${device(ctx, r, { w: PHONE_W, left: phoneLeft, top: Math.round(BASELINE - phoneH), rot: 0, z: 3 })}
    <img class="unisim-mark" src="/kit/brand/unisim-icon-white.png" alt="UNI·SIM" style="width:${size}px;right:${inset}px;top:${inset}px">`}`)
}

/**
 * The code's modules as hex, row by row (n × n bits, MSB first), for the
 * portal's live scene, which pastes it in as QR_MATRIX:
 *   node -e "import('./store-assets/layouts.mjs').then(m => console.log(m.MATRIX))"
 * run from Universal_QR. Re-paste it if URL changes.
 */
export const MATRIX = (() => {
  const qr = qrcode(0, 'H')
  qr.addData(URL)
  qr.make()
  const n = qr.getModuleCount()
  let bits = ''
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) bits += qr.isDark(r, c) ? '1' : '0'
  while (bits.length % 4) bits += '0'
  let hex = ''
  for (let i = 0; i < bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16)
  return { n, hex }
})()

export const LAYOUTS = {
  'code-header': (ctx, t, caps) => codeHeader(ctx, t, caps),
  'code-header-back': (ctx, t, caps) => codeHeader(ctx, t, caps, 'back'),
  'code-header-front': (ctx, t, caps) => codeHeader(ctx, t, caps, 'front'),
}
