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
// What is genuinely ours is the preference below: whether opening the tab
// reaches for the camera at all. Someone who doesn't want that gets a checkbox
// remembered on this device, rather than a prompt to dismiss every visit.

const KEY = 'unisim.qr.scan.auto-start.v1'

/**
 * Should opening the Scan tab start the camera? Defaults to ON — that is the
 * behaviour being asked for; the stored value only ever records an opt-OUT, so
 * a missing/unreadable key (private browsing, wiped storage) lands on the
 * default rather than on "off".
 */
export function loadAutoStart(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function saveAutoStart(on: boolean): void {
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
 * Only `'denied'` is load-bearing: it is the one state where auto-starting is
 * pointless (the request fails silently and instantly) and we should show the
 * how-to-unblock help instead. Everything else — including `'unknown'` from the
 * browsers that don't implement the `camera` permission name at all (Safari,
 * Firefox: `query` *throws* there rather than returning anything) — is treated
 * as "worth trying", which is what makes the prompt appear.
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

/** One line under the auto-start checkbox saying who does the remembering. */
export function rememberedByHint(): string {
  return nativePlatform()
    ? 'Your device remembers the answer, so you are only asked once.'
    : 'Your browser remembers this site’s camera permission.'
}
