import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// Universal QR is served at opensource.unisim.co.uk/qr in production.
// `base` + PWA scope derive from Vite's `mode`; local dev stays `/`. The
// `desktop` mode targets the Electron build, which loads index.html over
// `file://`, so assets must resolve relative to it (`./`) and the PWA service
// worker is skipped (it cannot register under a `file://` origin).
// Build-version marker: prefer the Cloudflare Pages commit SHA baked in at build
// time, fall back to the local git short SHA, then 'dev'. Surfaced as a
// <meta name="build-sha"> tag and a startup console.log so the live build is
// identifiable in-browser without wrangler.
function resolveBuildSha(): string {
  // ⚠️ Truncated to the same 7 characters the local fallback below produces.
  // Cloudflare hands over the FULL 40-character SHA, so the same commit used to
  // stamp two different markers depending on where it was built — and the marker
  // exists precisely to be compared against `git log` by eye.
  // Also reads GITHUB_SHA, so an Actions build stamps the commit it is
  // building rather than falling through.
  const ciSha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA
  if (ciSha) return ciSha.slice(0, 7)

  // ⚠️ THE LOCAL-GIT FALLBACK MUST NEVER RUN IN CI. On 2026-07-26 a Pages
  // build of b4e0699 fell through to it and shipped `ac02d14` — the PREVIOUS
  // commit. The marker built to answer "is the live build current?" reported a
  // stale-looking SHA for a perfectly current deploy, and cost a later session
  // two days chasing a build that was never broken. In CI we emit 'unknown'
  // instead: a marker that is obviously useless beats one that quietly lies.
  //
  // CF_PAGES is set by Cloudflare Pages; CI by essentially every other runner.
  if (process.env.CF_PAGES || process.env.CI) {
    console.warn(
      '[build-sha] CI build with no commit SHA in the environment ' +
        '(CF_PAGES_COMMIT_SHA / GITHUB_SHA). Emitting "unknown" — the local git ' +
        "fallback reports the checkout's HEAD, which can disagree with the " +
        'commit actually being deployed.',
    )
    return 'unknown'
  }

  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
}
const BUILD_SHA = resolveBuildSha()

export default defineConfig(({ mode }) => {
  const isDesktop = mode === 'desktop'
  const BASE_PATH = isDesktop ? './' : mode === 'production' ? '/qr/' : '/'
  return {
    base: BASE_PATH,
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      'import.meta.env.VITE_BUILD_SHA': JSON.stringify(BUILD_SHA)
    },
    resolve: {
      // Force a single React instance so @unisim/sdk's hooks share the same
      // dispatcher as the host app. Without this, Vite's dep optimizer can
      // bundle a second copy of React inside the SDK's pre-bundle, which
      // surfaces as "Invalid hook call" at runtime.
      dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
      exclude: ['@unisim/sdk']
    },
    plugins: [
      {
        name: 'build-sha-meta',
        transformIndexHtml() {
          return [
            { tag: 'meta', attrs: { name: 'build-sha', content: BUILD_SHA }, injectTo: 'head' as const },
          ]
        },
      },
      react(),
      tailwindcss(),
      // The PWA service worker is for the hosted web app only — under Electron's
      // `file://` origin it cannot register and is unnecessary, so skip it.
      ...(isDesktop ? [] : [VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'og-image.png'],
        manifest: {
          name: 'Universal QR',
          short_name: 'UniQR',
          description: 'Design branded, styled QR codes — works offline',
          theme_color: '#0f172a',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: BASE_PATH,
          scope: BASE_PATH,
          icons: [
            { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          // SPA navigations under the base path fall back to the prefixed shell.
          navigateFallback: `${BASE_PATH}index.html`,
        },
        devOptions: { enabled: false }
      })]),
    ]
  }
})
