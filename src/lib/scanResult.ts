// What did the camera just read, and is it safe to act on?
//
// A QR code is an instruction from a stranger. Printed on a poster, stuck over
// a parking meter's real one, or sent in a phishing email, it can carry an
// address dressed up to look like somewhere else. The Scan tab used to show
// the raw text and, for anything starting `http`, an "Open link" button — so
// `https://paypal.com@evil.example` opened evil.example with one tap and the
// only clue was buried in the middle of a monospace string.
//
// This module answers two questions, offline and without a network call:
//
//   1. What KIND of thing is this? A web link, a Wi-Fi join, a phone number,
//      an email address, a text message, or just text.
//   2. For a web link: what should a careful person notice before opening it?
//
// The link half — the scheme block-list, the user-info / lookalike / IP /
// shortener checks and the host a link REALLY opens — moved into the SDK as
// `classifyLink` (@unisim/sdk 0.179.0), so Universal Family's chat and
// Universal BlackBook's notes warn about the same links this tab does. What
// stays here is what only a scanned code needs: Wi-Fi, phone, email and text
// payloads.
//
// ⚠️ Imports only `@unisim/sdk/link-safety` — the SDK's pure entry point, which
// itself imports nothing — so scripts/scanResult.test.mjs can still load this
// file under Node's type-stripping, without React.

import { classifyLink, dangerousScheme, type LinkReason } from '@unisim/sdk/link-safety'

/** Things worth saying about a web link before somebody taps it — the SDK's
 *  reasons, minus `dangerous-scheme` (such a code is `blocked`, never `web`). */
export type UrlWarning = Exclude<LinkReason, 'dangerous-scheme'>

export type ScanContent =
  /** A web address we will offer to open. `host` is what the browser's address
   *  bar will show — punycode for an IDN host, which is the point. */
  | { kind: 'web'; href: string; host: string; warnings: UrlWarning[] }
  /** A scheme that runs code or reaches into the device (`javascript:`,
   *  `data:`, `file:`…). Shown as text; never offered as a link. */
  | { kind: 'blocked'; scheme: string }
  /** `WIFI:T:WPA;S:name;P:secret;;` — the format every phone camera reads. */
  | { kind: 'wifi'; ssid: string; password: string; security: string; hidden: boolean }
  | { kind: 'tel'; href: string; number: string }
  | { kind: 'email'; href: string; address: string }
  | { kind: 'sms'; href: string; number: string }
  /** Plain text, a vCard, a product barcode number — nothing to open. */
  | { kind: 'text' }

/** `WIFI:` field values escape `\ ; , : "` with a backslash. */
function wifiFields(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  let key = ''
  let value = ''
  let inValue = false
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '\\' && i + 1 < body.length) {
      if (inValue) value += body[i + 1]
      else key += body[i + 1]
      i++
      continue
    }
    if (!inValue && ch === ':') {
      inValue = true
      continue
    }
    if (ch === ';') {
      if (key) out[key.trim().toUpperCase()] = value
      key = ''
      value = ''
      inValue = false
      continue
    }
    if (inValue) value += ch
    else key += ch
  }
  if (key) out[key.trim().toUpperCase()] = value
  return out
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

export function classifyScan(raw: string): ScanContent {
  const text = raw.trim()
  if (!text) return { kind: 'text' }

  // Read the scheme the way a browser would (casing, tabs, control characters
  // and all) — the SDK's job. Free text, so only the known-bad schemes count:
  // `Note: back at 10:30` is a note.
  const scheme = dangerousScheme(text)
  if (scheme) return { kind: 'blocked', scheme }

  const lower = text.toLowerCase()

  if (lower.startsWith('wifi:')) {
    const f = wifiFields(text.slice(5))
    if (f.S !== undefined) {
      return {
        kind: 'wifi',
        ssid: f.S,
        password: f.P ?? '',
        security: (f.T ?? '').toUpperCase(),
        hidden: (f.H ?? '').toLowerCase() === 'true',
      }
    }
    return { kind: 'text' }
  }

  if (lower.startsWith('tel:')) {
    const number = safeDecode(text.slice(4)).trim()
    if (number) return { kind: 'tel', href: `tel:${number.replace(/\s+/g, '')}`, number }
    return { kind: 'text' }
  }

  if (lower.startsWith('mailto:')) {
    const address = safeDecode(text.slice(7).split('?')[0]).trim()
    if (address) return { kind: 'email', href: text, address }
    return { kind: 'text' }
  }

  // `SMSTO:+447700900123:message` (the QR convention) and `sms:+447700900123`.
  if (lower.startsWith('smsto:') || lower.startsWith('sms:')) {
    const rest = text.slice(lower.startsWith('smsto:') ? 6 : 4)
    const number = safeDecode(rest.split(/[:?]/)[0]).trim()
    if (number) return { kind: 'sms', href: `sms:${number.replace(/\s+/g, '')}`, number }
    return { kind: 'text' }
  }

  // A web link is one token with an http(s) scheme. A sentence that merely
  // CONTAINS a URL is text: offering to open "the link" in it would mean
  // guessing which part the author meant.
  if (/^https?:\/\/\S+$/i.test(text)) {
    const link = classifyLink(text)
    if (link.kind === 'web' && link.href) {
      const warnings = link.reasons.filter((r): r is UrlWarning => r !== 'dangerous-scheme')
      return { kind: 'web', href: link.href, host: link.host, warnings }
    }
  }

  return { kind: 'text' }
}
