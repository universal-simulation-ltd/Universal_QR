#!/usr/bin/env node
// Regenerates the App Store and Google Play images for Universal QR.
//
//   npm run build:desktop                 # the bundle the iOS/Android shells load
//   node store-assets/generate.mjs        # every screen, every device
//   node store-assets/generate.mjs 03     # only screens whose name starts 03
//   DEVICE=iphone node store-assets/generate.mjs
//
// Needs Playwright's Chromium. It is not a dependency of this repo, so either
// `npm i --no-save playwright && npx playwright install chromium`, or point
// PLAYWRIGHT at an existing copy's index.mjs.
//
// The screens are the real app: dist/ is served to the browser through
// Playwright's request routing (no local server, no port), at each store
// device's viewport and pixel ratio, and driven like a person would drive it.
// Anything that is not the app itself is refused, except link checks, which
// are answered with an empty 200 so the "Test link" probe reads as reachable.
// The logo is drawn here from SVG — an invented café, not a real business.
//
// Output (committed): the real captures, raw/iphone (1320x2580), raw/ipad
// (2064x2664) and raw/android (1080x2172). The UNI·SIM store kit frames them
// into the store screenshots in out/, drawing the status bar and home
// indicator they leave out. store.json says which capture each screen shows,
// strings/en-GB.json every word on it:
//
//   node ../../Docs_UNI_SIM/store-kit/build.mjs store-assets
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const dist = path.join(root, 'dist')
const { chromium } = await import(
  process.env.PLAYWRIGHT ? pathToFileURL(process.env.PLAYWRIGHT).href : 'playwright'
)

// Each device's screen less the status bar and home indicator the store kit
// draws (its layouts.mjs, CLASSES[…].insets): iPhone 17 Pro Max 956 pt less
// 62 + 34, iPad 13" 1376 pt less 24 + 20, an Android phone 780 dp less 32 + 24.
const DEVICES = [
  { key: 'iphone', dir: 'raw/iphone', width: 440, height: 860, dpr: 3 },
  { key: 'ipad', dir: 'raw/ipad', width: 1032, height: 1332, dpr: 2 },
  { key: 'android', dir: 'raw/android', width: 360, height: 724, dpr: 3 },
]
const ORIGIN = 'https://app.test'
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2',
  '.wasm': 'application/wasm', '.webmanifest': 'application/manifest+json',
}

// ── Sample content ─────────────────────────────────────────────────────────
// An invented café's mark: a pear-green roundel with a leaf. Drawn, not found.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
  <circle cx="100" cy="100" r="96" fill="#1f5135"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#f4e7c8" stroke-width="4"/>
  <path d="M100 42c-30 18-42 52-26 82 10 18 30 26 44 22-4-30 6-62 30-84-16-14-34-20-48-20z" fill="#9fcf6a"/>
  <path d="M84 150c8-34 26-62 52-84" stroke="#1f5135" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M100 150v18" stroke="#f4e7c8" stroke-width="8" stroke-linecap="round"/>
</svg>`

async function svgToPng(browser, svg, w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`)
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } })
  await page.close()
  return buf
}

// ── The screens ────────────────────────────────────────────────────────────
const MENU_URL = 'https://example.com/menu'

async function tab(page, name) {
  await page.getByText(name, { exact: true }).first().click()
  await page.waitForTimeout(400)
}
async function setUrl(page, url) {
  const box = page.locator('input[type=url]').first()
  await box.fill(url)
  await box.blur()
}
async function setHex(page, label, value) {
  const box = page.getByLabel(`${label} hex value`).first()
  await box.fill(value)
  await box.press('Enter').catch(() => {})
  await box.blur()
}
async function uploadLogo(page, logo) {
  await page.locator('input[type=file]').first().setInputFiles({ name: 'orchard-lane.png', mimeType: 'image/png', buffer: logo })
  await page.waitForTimeout(1500)
}
/** The app opens on a style picked at random, so every screen names one. */
async function preset(page, name) {
  await page.getByRole('radiogroup', { name: 'Style presets' }).first().getByText(name, { exact: true }).first().click()
  await page.waitForTimeout(400)
}
async function brand(page, logo) {
  await tab(page, 'Branding')
  await setUrl(page, MENU_URL)
  await preset(page, 'Rounded')
  await setHex(page, 'Modules', '#1F5135')
  await uploadLogo(page, logo)
  // With a logo of your own in, the UNI·SIM mark moves to a corner of the code.
  // It is a switch in the app; this is the café's code, so it goes.
  const mark = page.getByRole('switch', { name: /SIM mark/ }).first()
  if ((await mark.getAttribute('aria-checked')) === 'true') await mark.click()
  await page.waitForTimeout(800)
}
const top = (page) => page.evaluate(() => window.scrollTo(0, 0))

const SCREENS = {
  // First open: the designer, with a code already drawn.
  async '01-designer'(page) {
    await tab(page, 'Branding')
    await preset(page, 'Classic')
    await tab(page, 'Simple')
    await top(page)
    await page.waitForTimeout(600)
  },
  // A branded code: colours, rounded modules and a logo in the middle.
  async '02-branding'(page, { logo }) {
    await brand(page, logo)
    // The colour and logo cards, under the preview that pins itself on scroll.
    await page.getByText('Colours', { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await page.evaluate(() => window.scrollBy(0, -290))
    // The pinned copy of the preview redraws on scroll; give its corner mark
    // time to arrive, or it shows as a blank disc.
    await page.waitForTimeout(2500)
  },
  // The same code, tapped to enlarge.
  async '03-enlarge'(page, { logo }) {
    await brand(page, logo)
    await top(page)
    await page.getByRole('button', { name: 'Enlarge QR code for scanning' }).first().click()
    await page.waitForTimeout(900)
  },
  // Shape and module style: a round code with dots, from Advanced.
  async '04-shape'(page, { logo }) {
    await brand(page, logo)
    await tab(page, 'Advanced')
    await page.getByRole('radio', { name: 'Circle' }).first().click().catch(() => page.getByText('Circle', { exact: true }).first().click())
    await page.getByRole('radio', { name: 'Dots' }).last().click().catch(() => page.getByText('Dots', { exact: true }).last().click())
    await page.waitForTimeout(700)
    await page.getByText('Shape & size', { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await page.evaluate(() => window.scrollBy(0, -260))
    await page.waitForTimeout(500)
  },
  // Wi-Fi: guests scan it and join without typing the password.
  async '05-wifi'(page) {
    await tab(page, 'Advanced')
    await page.getByRole('radio', { name: 'Wi-Fi' }).first().click().catch(() => page.getByText('Wi-Fi', { exact: true }).first().click())
    await page.getByPlaceholder('MyWiFi').fill('Garden Room Guest')
    await page.getByPlaceholder('leave blank if open').fill('sunflower-2026')
    await page.getByPlaceholder('leave blank if open').blur()
    await preset(page, 'Sunset')
    await page.waitForTimeout(700)
    await page.getByText('Content', { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await page.evaluate(() => window.scrollBy(0, -250))
    await page.waitForTimeout(500)
  },
  // A 1D barcode: EAN-13, check digit worked out by the app.
  async '06-barcode'(page) {
    await tab(page, 'Advanced')
    await page.getByRole('radio', { name: 'Barcode' }).first().click().catch(() => page.getByText('Barcode', { exact: true }).first().click())
    await page.waitForTimeout(500)
    await page.getByRole('radio', { name: 'EAN-13' }).first().click().catch(() => page.getByText('EAN-13', { exact: true }).first().click())
    await page.waitForTimeout(300)
    const value = page.locator('input[aria-label$=" value"]').first()
    await value.fill('501234567890')
    await value.blur()
    await page.waitForTimeout(800)
    // The whole barcode in frame, under its value.
    await page.getByText('Value', { exact: true }).first().evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await page.evaluate(() => window.scrollBy(0, -40))
    await page.waitForTimeout(500)
  },
}

// ── Running them ───────────────────────────────────────────────────────────
function pngInfo(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), colourType: buf[25] }
}

async function serve(ctx) {
  await ctx.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== ORIGIN) {
      // The changelog feed and anything else off-app is refused; a link probe
      // (a no-cors GET to the code's own URL) gets an empty 200.
      if (url.hostname.startsWith('changelog.')) return route.abort()
      return route.fulfill({ status: 200, body: '' })
    }
    let p = decodeURIComponent(url.pathname)
    if (p.endsWith('/')) p += 'index.html'
    try {
      const file = path.join(dist, p)
      await route.fulfill({ body: await readFile(file), contentType: TYPES[path.extname(file)] ?? 'application/octet-stream' })
    } catch {
      await route.fulfill({ status: 404, body: '' })
    }
  })
}

const only = process.argv.slice(2)
const devices = DEVICES.filter((d) => !process.env.DEVICE || process.env.DEVICE.split(',').includes(d.key))
const browser = await chromium.launch()
const logo = await svgToPng(browser, LOGO_SVG, 400, 400)
let bad = 0
for (const dev of devices) {
  await mkdir(path.join(here, dev.dir), { recursive: true })
  for (const [name, run] of Object.entries(SCREENS)) {
    if (only.length && !only.some((p) => name.startsWith(p))) continue
    const ctx = await browser.newContext({
      viewport: { width: dev.width, height: dev.height }, deviceScaleFactor: dev.dpr,
      isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'en-GB',
    })
    await serve(ctx)
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(`${ORIGIN}/index.html`)
    await page.waitForTimeout(1200)
    try {
      await run(page, { dev, logo })
    } catch (err) {
      console.error(`FAIL ${dev.dir}/${name}: ${err.message.split('\n')[0]}`)
      bad++
    }
    const out = path.join(here, dev.dir, `${name}.png`)
    const buf = await page.screenshot()
    await writeFile(out, buf)
    const { w, h, colourType } = pngInfo(buf)
    const ok = w === dev.width * dev.dpr && h === dev.height * dev.dpr && colourType === 2
    if (!ok) bad++
    console.log(`${ok ? 'OK ' : 'BAD'} ${dev.dir}/${name}.png ${w}x${h}${colourType === 2 ? '' : ' has alpha'}${errors.length ? ` (page errors: ${errors.length})` : ''}`)
    await ctx.close()
  }
}
await browser.close()
if (bad) {
  console.error(`${bad} problem(s) — check the output above`)
  process.exit(1)
}
