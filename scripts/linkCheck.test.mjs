// What counts as a web address in the "Test link is working" row.
//
//   npm run test:link-check
//
// Runs under Node's type-stripping, so `linkCheck.ts` is imported directly.
// ⚠️ That is why that module imports NOTHING — see the same note on
// `hostedPath.test.mjs`. Only `parseLink` is covered here: `probeLink` is a
// `fetch` against the open internet and belongs in a browser, not in a test
// that would go red on a train.
//
// What is being pinned, and why each case is here rather than obvious:
//
//   • A QR code carrying plain text is completely legitimate — the single most
//     damaging failure would be nagging "add https://" at someone whose code is
//     a coupon word or a serial number. Everything that is not clearly an
//     address must come back `other` and render no UI at all.
//   • The app composes mailto:/WIFI:/BEGIN:VCARD payloads itself. Those are not
//     links, cannot be opened in a tab, and must never be probed.
//   • http:// is separated from https:// because this page is served over TLS:
//     probing a plain-http address is blocked as mixed content before it leaves
//     the browser, so treating the two alike would report every http site on
//     earth as dead.
//
// Negative control (2026-08-29, run): widening BARE_HOST to accept any dotted
// token turns the "3.5 kg of flour" and "v1.2" cases red.

import { strict as assert } from 'node:assert'
import { parseLink } from '../src/lib/linkCheck.ts'

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

console.log('parseLink')

check('a plain https address is a web link', () => {
  assert.deepEqual(parseLink('https://unisim.co.uk'), { kind: 'web', href: 'https://unisim.co.uk/' })
})

check('surrounding whitespace is ignored', () => {
  assert.equal(parseLink('   https://unisim.co.uk/pricing  ').kind, 'web')
})

check('http is openable but kept apart from https', () => {
  assert.deepEqual(parseLink('http://example.com/x'), { kind: 'insecure', href: 'http://example.com/x' })
})

check('a bare hostname is an address missing its scheme', () => {
  assert.deepEqual(parseLink('unisim.co.uk'), { kind: 'no-scheme', suggestion: 'https://unisim.co.uk' })
})

check('a bare hostname with a path too', () => {
  assert.equal(parseLink('example.com/pricing?x=1').kind, 'no-scheme')
})

check('nothing typed yet', () => {
  assert.equal(parseLink('').kind, 'empty')
  assert.equal(parseLink('    ').kind, 'empty')
})

for (const payload of [
  'mailto:name@example.com?subject=Hi',
  'MAILTO:NAME@EXAMPLE.COM',
  'tel:+447700900000',
  'SMSTO:+447700900000:hello',
  'geo:51.5074,-0.1278',
  'WIFI:T:WPA;S:MyWiFi;P:secret;;',
  'BEGIN:VCARD\nVERSION:3.0\nEND:VCARD',
  'BEGIN:VEVENT\nSUMMARY:Team meeting\nEND:VEVENT',
]) {
  check(`not a web link: ${payload.split('\n')[0].slice(0, 28)}`, () => {
    assert.equal(parseLink(payload).kind, 'other')
  })
}

for (const text of [
  'Ask for Jane at the front desk',
  'SERIAL-8837-XK',
  '3.5 kg of flour',
  'v1.2',
  'Table 4',
  'unisim co uk',
]) {
  check(`plain text is left alone: ${text}`, () => {
    assert.equal(parseLink(text).kind, 'other')
  })
}

check('a non-web scheme that parses as a URL is still not a web link', () => {
  assert.equal(parseLink('ftp://files.example.com').kind, 'other')
  assert.equal(parseLink('javascript:alert(1)').kind, 'other')
})

console.log(failures === 0 ? '\nAll green.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
