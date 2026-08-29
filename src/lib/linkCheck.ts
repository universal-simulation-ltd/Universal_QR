// Is the thing this QR code points at actually going to work?
//
// Two different questions, deliberately kept apart:
//
//   1. Is it a full web address? — answered here, offline, and always right.
//   2. Does anything answer at it? — answered by asking the visitor's own
//      browser to fetch it, which is the only way an app with no backend can
//      ask at all.
//
// (2) is a weak signal and the UI must not oversell it. A cross-origin fetch
// can only be made in `no-cors` mode, and an opaque response carries no status
// — so a 404 page, a parked domain and a real site are indistinguishable, all
// three "respond". It can also fail on a perfectly good site (a server that
// refuses HEAD, a CDN that blocks the origin, an extension). So: a green tick
// means "something answered", never "your link works" — the button that opens
// the link in a tab is what actually answers that, and a human eye on the page
// is the only real test.

/** Anything the app itself composes that is NOT a web link — a Wi-Fi join, a
 *  vCard, a mailto. There is nothing to open in a tab and nothing to probe. */
const NON_WEB_PREFIXES = [
  'mailto:', 'tel:', 'sms:', 'smsto:', 'geo:', 'wifi:',
  'begin:vcard', 'begin:vevent', 'matmsg:', 'bitcoin:',
]

/** A bare hostname with a dot in it and no whitespace — `unisim.co.uk`,
 *  `example.com/pricing`, `localhost:3000` deliberately NOT matched (a QR code
 *  pointing at a laptop is a mistake, not an address worth suggesting). */
const BARE_HOST = /^[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)*\.[a-z]{2,}(:\d+)?([/?#].*)?$/i

export type LinkShape =
  /** Nothing typed yet. */
  | { kind: 'empty' }
  /** Plain text, or a Wi-Fi/vCard/mailto payload — not a web address at all. */
  | { kind: 'other' }
  /** Looks like an address but has no `https://` in front of it. */
  | { kind: 'no-scheme'; suggestion: string }
  /** A real `http://` address — openable, but never probed (see probeLink). */
  | { kind: 'insecure'; href: string }
  /** A real `https://` address. */
  | { kind: 'web'; href: string }

export function parseLink(raw: string): LinkShape {
  const value = raw.trim()
  if (!value) return { kind: 'empty' }
  if (NON_WEB_PREFIXES.some((p) => value.toLowerCase().startsWith(p))) return { kind: 'other' }

  let url: URL | null = null
  try {
    url = new URL(value)
  } catch {
    url = null
  }

  if (url) {
    if (url.protocol === 'https:') return { kind: 'web', href: url.href }
    if (url.protocol === 'http:') return { kind: 'insecure', href: url.href }
    return { kind: 'other' }
  }

  // No scheme. Only call it an address if it really looks like one — a QR code
  // carrying a sentence of plain text is entirely legitimate and must not be
  // nagged at about a missing `https://`.
  if (BARE_HOST.test(value)) return { kind: 'no-scheme', suggestion: `https://${value}` }
  return { kind: 'other' }
}

export type ProbeResult =
  /** Something answered at that address. NOT "the page is right". */
  | 'ok'
  /** The browser could not reach it: no such host, refused, blocked. */
  | 'unreachable'
  /** It never answered inside the time limit. */
  | 'timeout'
  /** This device has no network — nothing was checked. */
  | 'offline'

/** Ask the browser to touch the address. HEAD first because it is cheap; a
 *  server answering 405 still counts as an answer, but one that drops HEAD
 *  entirely does not, and that is common enough to be worth a second ask
 *  with GET before calling a live site dead. */
export async function probeLink(href: string, timeoutMs = 8000): Promise<ProbeResult> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline'

  for (const method of ['HEAD', 'GET'] as const) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      await fetch(href, {
        method,
        mode: 'no-cors',
        redirect: 'follow',
        cache: 'no-store',
        signal: controller.signal,
      })
      return 'ok'
    } catch {
      if (controller.signal.aborted) return 'timeout'
    } finally {
      clearTimeout(timer)
    }
  }

  return typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'unreachable'
}
