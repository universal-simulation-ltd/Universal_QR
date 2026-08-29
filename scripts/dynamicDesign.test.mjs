// A dynamic code's saved design — the rules that keep a printed code stable.
//
//   npm run test:dynamic-design
//
// Runs under Node's type-stripping, so `dynamicCodes.ts` is imported directly.
// Its only runtime import is `@unisim/qr`, which is a plain ESM package and
// resolves fine; the SDK is `import type` only and is stripped away with the
// types. ⚠️ Adding a real (value) import of the SDK or a zustand store to that
// module takes this red for a reason unrelated to designs.
//
// WHAT IS BEING PINNED. Dynamic-code branding used to live in one client-side
// store applied to every code at render time, so editing it silently re-skinned
// codes that were already printed on flyers, and a second device drew them all
// differently again. Migration 0129 moved the look onto the row. Three rules
// make that work, and all three are quiet failures if they break:
//
//   1. A code's own design WINS over the studio branding. If it ever stopped
//      winning, nothing would error — every code would simply go back to
//      following the panel, which is the whole bug.
//   2. `data` and `name` are the ROW's, always. The design carries the look and
//      nothing else, so a renamed or re-pointed code cannot keep drawing a
//      stale copy of either. Universal PDF's shelf relies on the same rule.
//   3. A design missing a field comes back with the default, not undefined. The
//      renderer looks `frameShape` up in a table — undefined there is NaN
//      geometry and a blank code, not a cosmetic difference.
//
// Negative control (2026-08-29, measured — each mutation applied, run, and
// reverted): making `dynamicQrConfig` prefer `fallbackBrand` over `code.design`
// turns 2 red; dropping the `data`/`name` overwrite turns 4 red; returning a
// stored design unmerged turns 1 red. The last is only one because "what was
// saved still wins" passes either way — the merge exists for the field that
// ISN'T there, which is exactly the failure that renders as a blank code.

import {
  dynamicQrConfig,
  hydrateDesign,
  logoModeOf,
  redirectUrl,
  storableDesign,
  targetLabel,
} from '../src/lib/dynamicCodes.ts'
import { DEFAULT_CONFIG } from '@unisim/qr'

let pass = 0
let fail = 0
const eq = (actual, expected, label) => {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a === e) {
    pass++
    console.log(`  ok   ${label}  -> ${a}`)
  } else {
    fail++
    console.log(`  FAIL ${label}\n       expected ${e}\n       actual   ${a}`)
  }
}

const ORG_ICON = 'data:image/png;base64,ORGMARK'
const OTHER_LOGO = 'data:image/png;base64,SOMETHINGELSE'

/** A code row as `listDynamicCodes` hands it over. */
function row(over = {}) {
  return {
    id: 'c1',
    org_id: 'o1',
    user_id: 'u1',
    code: 'ab12cd34',
    target_url: 'https://www.example.com/spring',
    name: 'Spring flyer',
    design: null,
    scan_count: 0,
    last_scan_at: null,
    created_at: '2026-08-29T00:00:00Z',
    updated_at: '2026-08-29T00:00:00Z',
    ...over,
  }
}

const SAVED = { ...DEFAULT_CONFIG, fgColor: '#123456', dotType: 'dots' }
const STUDIO = { ...DEFAULT_CONFIG, fgColor: '#abcdef', dotType: 'classy' }

console.log('storableDesign (the look, and nothing that belongs to the row):')
eq(storableDesign({ ...SAVED, data: 'https://old', name: 'Old name' }).data, '', 'the payload is emptied')
eq(storableDesign({ ...SAVED, data: 'https://old', name: 'Old name' }).name, '', 'the label is emptied')
eq(storableDesign(SAVED).fgColor, '#123456', 'the look is kept verbatim')

console.log('\nhydrateDesign (a stored design merged over the defaults):')
eq(hydrateDesign(null), null, 'no design saved stays absent')
eq(hydrateDesign(undefined), null, 'a missing column is absent, not an empty design')
eq(hydrateDesign('nonsense'), null, 'a non-object is treated as absent, never spread')
eq(hydrateDesign([1, 2]), null, 'an array is not a design either')
eq(hydrateDesign({ fgColor: '#123456' }).frameShape, DEFAULT_CONFIG.frameShape, 'a field saved before it existed comes back as the default, not undefined')
eq(hydrateDesign({ fgColor: '#123456' }).fgColor, '#123456', 'what was saved still wins')

console.log('\ndynamicQrConfig (rule 1 — the code owns its look):')
eq(dynamicQrConfig(row({ design: SAVED }), STUDIO).fgColor, '#123456', 'a saved design beats the studio branding')
eq(dynamicQrConfig(row({ design: SAVED }), STUDIO).dotType, 'dots', 'every field of it, not just the colour')
eq(dynamicQrConfig(row(), STUDIO).fgColor, '#abcdef', 'a pre-0129 code with no design still follows the studio')
eq(dynamicQrConfig(row()).fgColor, DEFAULT_CONFIG.fgColor, 'and the suite default when there is no studio branding either')

console.log('\ndynamicQrConfig (rule 2 — the payload and label are the ROW’s):')
eq(
  dynamicQrConfig(row({ design: { ...SAVED, data: 'https://stale.example', name: 'Stale name' } }), STUDIO).data,
  redirectUrl('ab12cd34'),
  'the payload is the redirect, never a copy stored in the design',
)
eq(
  dynamicQrConfig(row({ design: { ...SAVED, name: 'Stale name' } }), STUDIO).name,
  'Spring flyer',
  'the label is the row’s, so a rename shows up immediately',
)
eq(
  dynamicQrConfig(row({ name: null, design: SAVED })).name,
  'example.com',
  'an unnamed code falls back to the destination’s host',
)
eq(
  dynamicQrConfig(row({ name: '   ', design: SAVED })).name,
  'example.com',
  'a whitespace-only label counts as unnamed',
)
eq(redirectUrl('ab12cd34'), 'https://opensource.unisim.co.uk/qr/r/ab12cd34', 'the redirect is the production one wherever it was made')

console.log('\ntargetLabel:')
eq(targetLabel('https://www.example.com/spring'), 'example.com', 'host only, www stripped')
eq(targetLabel('example.com'), 'example.com', 'a bare host is given a scheme first')
eq(targetLabel('not a url'), 'not a url', 'anything unparseable comes back as itself')

console.log('\nlogoModeOf (which chip the editor lights):')
eq(logoModeOf({ logoDataUrl: ORG_ICON, unisimMark: false }, ORG_ICON), 'org', 'the org mark in the centre reads as Org icon')
eq(logoModeOf({ logoDataUrl: OTHER_LOGO, unisimMark: false }, ORG_ICON), 'custom', 'anything else in the centre is an upload')
eq(logoModeOf({ logoDataUrl: OTHER_LOGO, unisimMark: false }, null), 'custom', 'still an upload when the org has no mark at all')
eq(logoModeOf({ logoDataUrl: null, unisimMark: true }, null), 'org', 'no org mark degrades to the UNI·SIM one — the same fallback the new-code panel applies')
eq(logoModeOf({ logoDataUrl: null, unisimMark: false }, ORG_ICON), 'none', 'an empty centre is None even when an org mark exists')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
