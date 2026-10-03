// What the Scan tab makes of a decoded code, and what it warns about.
//
//   npm run test:scan-result
//
// Runs under Node's type-stripping, so `scanResult.ts` is imported directly —
// which is why that module imports nothing.
//
// The cases that matter most are the ones that must NOT become a tappable
// link: a `javascript:` or `data:` payload (with the casing and whitespace
// tricks browsers forgive), and the `trusted.com@evil.example` shape whose
// real host is the part after the `@`.

import { strict as assert } from 'node:assert'
import { classifyScan } from '../src/lib/scanResult.ts'

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

check('plain https link, no warnings', () => {
  const r = classifyScan('https://unisim.co.uk/qr')
  assert.equal(r.kind, 'web')
  assert.equal(r.host, 'unisim.co.uk')
  assert.deepEqual(r.warnings, [])
})

check('http link warns it is not encrypted', () => {
  const r = classifyScan('http://example.com')
  assert.equal(r.kind, 'web')
  assert.deepEqual(r.warnings, ['insecure'])
})

check('user-info trick: real host is after the @', () => {
  const r = classifyScan('https://paypal.com@evil.example/login')
  assert.equal(r.kind, 'web')
  assert.equal(r.host, 'evil.example')
  assert.ok(r.warnings.includes('credentials'))
})

check('IDN lookalike host is flagged and shown as punycode', () => {
  const r = classifyScan('https://раураl.com/')
  assert.equal(r.kind, 'web')
  assert.ok(r.host.startsWith('xn--'), r.host)
  assert.ok(r.warnings.includes('lookalike'))
})

check('IPv4 and IPv6 hosts are flagged', () => {
  assert.ok(classifyScan('https://192.168.1.10/admin').warnings.includes('ip'))
  assert.ok(classifyScan('https://[::1]:8080/').warnings.includes('ip'))
})

check('shorteners are flagged, www. or not', () => {
  assert.ok(classifyScan('https://bit.ly/abc').warnings.includes('shortener'))
  assert.ok(classifyScan('https://www.tinyurl.com/abc').warnings.includes('shortener'))
  assert.deepEqual(classifyScan('https://bitly.example.com/abc').warnings, [])
})

for (const payload of [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  ' \tjava\nscript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'file:///etc/passwd',
  'vbscript:msgbox(1)',
  'intent://scan/#Intent;scheme=zxing;end',
]) {
  check(`blocked: ${JSON.stringify(payload)}`, () => {
    assert.equal(classifyScan(payload).kind, 'blocked')
  })
}

check('Wi-Fi payload with escapes', () => {
  const r = classifyScan('WIFI:T:WPA;S:Cafe\\;Guest;P:pa\\:ss\\\\word;H:true;;')
  assert.equal(r.kind, 'wifi')
  assert.equal(r.ssid, 'Cafe;Guest')
  assert.equal(r.password, 'pa:ss\\word')
  assert.equal(r.security, 'WPA')
  assert.equal(r.hidden, true)
})

check('open Wi-Fi network has an empty password', () => {
  const r = classifyScan('WIFI:T:nopass;S:Library;;')
  assert.equal(r.kind, 'wifi')
  assert.equal(r.password, '')
})

check('tel, mailto and SMSTO', () => {
  const tel = classifyScan('tel:+44 7700 900123')
  assert.equal(tel.kind, 'tel')
  assert.equal(tel.href, 'tel:+447700900123')
  const mail = classifyScan('mailto:inbox@unisim.co.uk?subject=Hi')
  assert.equal(mail.kind, 'email')
  assert.equal(mail.address, 'inbox@unisim.co.uk')
  const sms = classifyScan('SMSTO:+447700900123:See you at 6')
  assert.equal(sms.kind, 'sms')
  assert.equal(sms.number, '+447700900123')
})

check('text stays text: sentences, bare hosts, barcodes, vCards, "Note:"', () => {
  for (const t of [
    'Visit https://unisim.co.uk for more',
    'unisim.co.uk',
    '5012345678900',
    'BEGIN:VCARD\nFN:Sam\nEND:VCARD',
    'Note: back at 10:30',
    '',
  ]) {
    assert.equal(classifyScan(t).kind, 'text', t)
  }
})

if (failures) {
  console.error(`\n${failures} failed`)
  process.exit(1)
}
console.log('\nall passed')
