// The theme key is written down TWICE, and this is what stops the two drifting.
//
//   npm run test:theme
//
// `src/stores/themeStore.ts` names it for the SDK's store; `index.html` names it
// again in the inline script that puts `.dark` on `<html>` before the first
// paint, which is the only place early enough to matter (the store applies the
// same class, but not until the module bundle has parsed). There is no way to
// share one constant between a bundled module and a script that must run during
// head parsing — so instead, renaming either without the other fails here.
//
// It is not a style rule. The key IS every user's saved choice: change it and
// everybody who chose dark is silently back on light.
//
// The first, third and fourth are the same checks as Universal Jukebox's `src/lib/theme.test.ts`, in this
// repo's own test style (plain Node, no test runner).

import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8')

let failures = 0
function check(name, fn) {
  try {
    fn()
    console.log(`  ok  ${name}`)
  } catch (err) {
    failures++
    console.error(`FAIL  ${name}\n      ${err.message}`)
  }
}

/** The key as the store declares it: `createThemeStore('…')`. */
function storeKey() {
  const match = /createThemeStore\('([^']+)'\)/.exec(read('src/stores/themeStore.ts'))
  if (!match) throw new Error('themeStore.ts no longer calls createThemeStore with a literal key')
  return match[1]
}

/** The `<head>` script, i.e. everything before the module bundle can run. */
function headScript() {
  const html = read('index.html')
  return html.slice(0, html.indexOf('</head>'))
}

check('the pre-paint script reads the same localStorage key as the theme store', () => {
  const key = storeKey()
  assert.ok(
    headScript().includes(`localStorage.getItem('${key}')`),
    `index.html <head> does not read localStorage.getItem('${key}')`,
  )
})

// Since SDK 0.143 the app's key is an override: absent, the global choice
// applies, and the pre-paint script has to know that as well as the store does.
check("it falls back to Global preferences' universal:color-scheme when the app has no override", () => {
  assert.ok(
    headScript().includes("localStorage.getItem('universal:color-scheme')"),
    "index.html <head> does not read localStorage.getItem('universal:color-scheme')",
  )
})

check('it puts the dark class on <html> before anything is painted', () => {
  const head = headScript()
  assert.ok(head.includes("classList.add('dark')"), "no classList.add('dark') in index.html <head>")
  // 'system' has to be honoured here too, or somebody on the OS setting gets
  // the light ground first and the dark one once the bundle catches up.
  assert.ok(head.includes('prefers-color-scheme: dark'), "no 'prefers-color-scheme: dark' check in index.html <head>")
})

check('it never removes the class — light is the default, so it only ever adds', () => {
  assert.ok(!headScript().includes("classList.remove('dark')"), "index.html <head> removes the dark class")
})

if (failures) {
  console.error(`\n${failures} failing`)
  process.exit(1)
}
console.log('\nall passing')
