#!/usr/bin/env node
// The App Store app preview for Universal QR: 15–30 s of the real app, 886×1920.
//
//   npm run build:desktop                 # the bundle the iOS shell loads
//   node store-assets/preview.mjs         # → store-assets/out/en-GB/preview/iphone-01.mp4
//   node store-assets/preview.mjs --stills  # and PNG stills beside it, to look at
//
// The recorder, the status bar and the encoding are the UNI·SIM store kit's
// (Docs_UNI_SIM/store-kit/preview.mjs). The app is served from dist/ as
// generate.mjs serves it, and driven in English. The café, its menu link and
// its logo are invented, as on the screenshots.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const dist = path.join(root, 'dist')
const kit = await import(pathToFileURL(path.resolve(root, '../../Docs_UNI_SIM/store-kit/preview.mjs')).href)
const { IPHONE, playwright, prepare, record, stills, tap, type, scroll, hold } = kit

const ORIGIN = 'https://app.test'
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2',
  '.wasm': 'application/wasm', '.webmanifest': 'application/manifest+json',
}
// An invented café's mark (generate.mjs draws the same one).
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
  <circle cx="100" cy="100" r="96" fill="#1f5135"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#f4e7c8" stroke-width="4"/>
  <path d="M100 42c-30 18-42 52-26 82 10 18 30 26 44 22-4-30 6-62 30-84-16-14-34-20-48-20z" fill="#9fcf6a"/>
  <path d="M84 150c8-34 26-62 52-84" stroke="#1f5135" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M100 150v18" stroke="#f4e7c8" stroke-width="8" stroke-linecap="round"/>
</svg>`

async function serve(ctx) {
  await ctx.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== ORIGIN) {
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

const { chromium } = await playwright()
const browser = await chromium.launch()
const logoPage = await browser.newPage({ viewport: { width: 400, height: 400 } })
await logoPage.setContent(`<style>html,body{margin:0;background:transparent}</style>${LOGO_SVG}`)
const logo = await logoPage.screenshot({ omitBackground: true })
await logoPage.close()

const ctx = await browser.newContext({ ...IPHONE, locale: 'en-GB' })
await ctx.addInitScript(() => { try { localStorage.setItem('universal:language', 'en-gb') } catch {} })
await serve(ctx)
const page = await ctx.newPage()
await prepare(page)
await page.goto(`${ORIGIN}/index.html`)
await page.waitForTimeout(1500)

const tabEl = (name) => page.getByRole('tab', { name, exact: true }).first()
const preset = (name) => page.getByRole('radiogroup', { name: 'Style presets' }).first().getByText(name, { exact: true }).first()

// Before the camera rolls: the plain designer, on the Classic style.
await tabEl('Branding').click(); await preset('Classic').click(); await tabEl('Simple').click()
await page.locator('input[type=url]').first().fill('')
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(600)

const out = path.join(here, 'out/en-GB/preview/iphone-01.mp4')
await record(page, async () => {
  // A link, typed: the code draws itself as you type.
  await type(page, page.locator('input[type=url]').first(), 'https://example.com/menu', { delay: 85, after: 900 })
  await page.locator('input[type=url]').first().blur()
  // Make it yours: a style, the café's green, its logo.
  await tap(page, tabEl('Branding'), { after: 600 })
  await tap(page, preset('Rounded'), { after: 900 })
  await page.locator('input[type=file]').first().setInputFiles({ name: 'cafe-logo.png', mimeType: 'image/png', buffer: logo })
  await hold(page, 1400)
  const remove = page.getByRole('switch', { name: /SIM mark/ }).first()
  if ((await remove.getAttribute('aria-checked')) !== 'true') await tap(page, remove, { after: 900 })
  // Shape and modules, from Advanced.
  await tap(page, tabEl('Advanced'), { after: 600 })
  await tap(page, page.getByRole('radio', { name: 'Circle' }).first(), { after: 1000 })
  await tap(page, page.getByRole('radio', { name: 'Dots' }).last(), { after: 1000 })
  // Back up to the finished code, and open it full screen to scan: the last shot.
  await scroll(page, -3000, { ms: 900, after: 700 })
  await tap(page, page.getByRole('button', { name: 'Enlarge QR code for scanning' }).first(), { after: 600 })
}, { out, tail: 3000 })

if (process.argv.includes('--stills')) console.log((await stills(out, [1, 4, 8, 12, 16, 20])).join('\n'))
await browser.close()
