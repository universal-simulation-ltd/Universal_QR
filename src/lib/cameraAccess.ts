// ── Camera access for the Scan tab ───────────────────────────────────────────
// Two things that sound like one thing but aren't:
//
//  1. Opening Scan should ASK for the camera straight away rather than waiting
//     behind a "Start scanning" button. The tab has exactly one purpose, so the
//     extra tap bought nothing — it just meant every scan started with two taps
//     and a prompt instead of one prompt.
//  2. The answer should be REMEMBERED, so the app stops asking on every visit.
//
// (2) is mostly the platform's job, and the platforms do NOT behave the same:
//
//  • iOS (Capacitor/WKWebView) — the OS prompt is once per install and the
//    answer then lives in Settings. Capacitor's `WebViewDelegationHandler`
//    already auto-grants the *second*, WebKit-level prompt
//    (`requestMediaCapturePermissionFor` → `.grant`), so a native build asks
//    once and never again. Nothing to add on this side.
//  • Android (Capacitor/WebView) — `BridgeWebChromeClient.onPermissionRequest`
//    turns the WebView's request into a real runtime CAMERA request, which the
//    OS remembers. ⚠️ That only works if `android.permission.CAMERA` is
//    declared in `AndroidManifest.xml`: Android denies a runtime request for an
//    undeclared permission INSTANTLY and shows no dialog at all. It was
//    undeclared until 2026-09-04, so scanning could not work on Android — the
//    manifest entry is part of this change and the app must be rebuilt
//    (`npm run cap:sync`) for it to take effect.
//  • Browsers — an https origin's granted camera is remembered per site.
//    Safari and any private window re-ask per session; that is the browser's
//    call and not something the page can override.
//
// ⚠️ **Permission decides first, and a GRANTED camera is never gated.** The
// preference below is not "should the camera start" — it is only "should we ASK
// when nobody has answered yet". Once access is granted, opening Scan shows the
// viewfinder, full stop: there is nothing left to protect anyone from, and a tap
// or a stale checkbox standing between them and a camera they already said yes
// to is the exact friction this change exists to remove. The first cut had the
// preference wrapping the permission read, so an opt-out gated a granted camera
// too — the one shape this must not have.

const KEY = 'unisim.qr.scan.ask-on-open.v1'

/**
 * When permission has NOT been decided yet, should opening the tab ask?
 * Defaults to ON. The stored value only ever records an opt-OUT, so a missing
 * or unreadable key (private browsing, wiped storage) lands on the default
 * rather than on "off".
 *
 * Irrelevant once permission is `granted` — nothing reads it in that state.
 */
export function loadAskOnOpen(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function saveAskOnOpen(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off')
  } catch {
    /* storage blocked — the choice holds for this session, then the default */
  }
}

export type CameraPermission = 'granted' | 'denied' | 'prompt' | 'unknown'

/**
 * What the platform already knows about camera access, WITHOUT asking for it.
 *
 * Two states are load-bearing. `'granted'` starts the camera unconditionally —
 * no preference consulted, no tap. `'denied'` never starts it: that request
 * fails instantly and silently, so the tab shows the unblock help instead.
 *
 * `'prompt'` and `'unknown'` mean the same thing in practice — nobody has
 * answered — and only there does the ask-on-open preference get a say.
 * `'unknown'` covers the browsers that don't implement the `camera` permission
 * name at all (Safari, Firefox: `query` *throws* rather than returning
 * anything) and the Capacitor WebViews. On those, the first visit asks and
 * every later one is answered from the platform's own memory of the grant, so
 * the outcome is the same even though we cannot read it up front.
 */
export async function readCameraPermission(): Promise<CameraPermission> {
  const perms = navigator.permissions as Permissions | undefined
  if (!perms?.query) return 'unknown'
  try {
    const status = await perms.query({ name: 'camera' as PermissionName })
    return status.state as CameraPermission
  } catch {
    return 'unknown'
  }
}

/**
 * Fires when the platform's camera permission changes under us — granted or
 * revoked from browser/OS settings while the tab is open. Returns an
 * unsubscribe.
 *
 * Chromium-only in practice (it hangs off the same `PermissionStatus` that
 * Safari and Firefox refuse to hand out for `camera`), so it is a live-update
 * nicety and never what correctness rests on: the state is read fresh on every
 * mount, and a `getUserMedia` that resolves or rejects settles it either way.
 */
export function onCameraPermissionChange(
  listener: (state: CameraPermission) => void,
): () => void {
  const perms = navigator.permissions as Permissions | undefined
  if (!perms?.query) return () => {}
  let status: PermissionStatus | null = null
  const handler = () => listener((status?.state ?? 'unknown') as CameraPermission)
  void perms
    .query({ name: 'camera' as PermissionName })
    .then((s) => {
      status = s
      s.addEventListener('change', handler)
    })
    .catch(() => {
      /* permission name unsupported — no live updates on this browser */
    })
  return () => status?.removeEventListener('change', handler)
}

/** `'ios'` / `'android'` inside the Capacitor shell, `null` in a browser. */
function nativePlatform(): 'ios' | 'android' | null {
  try {
    const cap = (window as unknown as {
      Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string }
    }).Capacitor
    if (cap?.isNativePlatform?.() !== true) return null
    const platform = cap.getPlatform?.()
    return platform === 'ios' || platform === 'android' ? platform : null
  } catch {
    return null
  }
}

/**
 * What to tell someone whose camera access is blocked. The route back differs
 * per platform, and "allow camera access, then try again" is useless on a phone
 * where there is no address bar to allow it from.
 */
export function blockedCameraHelp(): string {
  switch (nativePlatform()) {
    case 'ios':
      return 'Camera access is off for Universal QR. Turn it on in Settings ▸ Universal QR ▸ Camera, then come back to this tab.'
    case 'android':
      return 'Camera access is off for Universal QR. Turn it on in Settings ▸ Apps ▸ Universal QR ▸ Permissions ▸ Camera, then come back to this tab.'
    default:
      return 'Camera access is blocked for this site. Allow it from the camera icon in your browser’s address bar, then try again.'
  }
}

/** One line under the ask-on-open checkbox saying who does the remembering. */
export function rememberedByHint(): string {
  return nativePlatform()
    ? 'Your device remembers the answer, so you are only asked once.'
    : 'Your browser remembers this site’s camera permission.'
}

/** Shown in place of the checkbox once there is nothing left to ask about. */
export function grantedHint(): string {
  return nativePlatform()
    ? 'Camera access is allowed on this device — Scan opens straight to the viewfinder.'
    : 'Camera access is allowed for this site — Scan opens straight to the viewfinder.'
}
