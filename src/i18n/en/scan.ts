// scan strings. English (en-GB) is the source; every other language is typed
// against this file. Keys are snake_case; a comment after a key tells the
// translator where it shows and any length limit.
//
// The Scan tab (ScanStudio) and its camera-permission help (lib/cameraAccess.ts).
export default {
  // Heading
  'headline': 'Scan a {em}', // page heading; {em} is headline_em, highlighted in orange
  'headline_em': 'QR code or barcode', // highlighted end of "Scan a QR code or barcode"
  'intro': 'Point your camera at any QR code or 1D barcode (EAN, UPC, Code 128, Code 39…). Decoding happens on your device — the camera feed never leaves it.', // EAN, UPC, Code 128 and Code 39 are barcode format names, never translated

  // Over the viewfinder while the camera is not running
  'status_waiting': 'Waiting for camera access…', // while the camera permission prompt is up
  'status_scan_another': 'Scan another code when you’re ready.', // after a code has been read
  'status_camera_off': 'The camera is off.',
  'button_starting': 'Starting camera…', // button label while the camera starts; one line on a phone
  'button_scan_again': 'Scan again', // button label; keep short
  'button_start': 'Start scanning', // button label; keep short
  'button_stop': 'Stop', // small button over the live camera view; keep very short

  // Camera errors, shown over the viewfinder
  'error_no_camera': 'No camera was found on this device.',
  'error_camera_start': 'The camera could not start. Close any other app that is using it, then try again.',

  // Ask-on-open checkbox — only shown while camera access has not been answered
  'ask_on_open': 'Ask for camera access when I open Scan', // "Scan" is the tab name (app.tab_scan): use the same word

  // Result card
  'format_unknown': 'Unknown', // barcode type label when the type cannot be told; shown in capitals
  'copy': 'Copy', // button: copies the scanned text; keep short
  'copied': '✓ Copied', // replaces "Copy" for a moment after copying; keep short
  'open_link': 'Open link ↗', // button: opens the scanned web address; keep the ↗ arrow

  // Camera permission help (lib/cameraAccess.ts). The native-app (iOS/Android)
  // and browser versions differ on purpose: a phone app has no address bar.
  // Settings paths: use the names the phone's own Settings app shows in your
  // language; "Universal QR" is the app's name, never translated.
  'blocked_ios': 'Camera access is off for Universal QR. Turn it on in Settings ▸ Universal QR ▸ Camera, then come back to this tab.', // iPhone/iPad app
  'blocked_android': 'Camera access is off for Universal QR. Turn it on in Settings ▸ Apps ▸ Universal QR ▸ Permissions ▸ Camera, then come back to this tab.', // Android app
  'blocked_browser': 'Camera access is blocked for this site. Allow it from the camera icon in your browser’s address bar, then try again.', // web browser
  'remembered_native': 'Your device remembers the answer, so you are only asked once.', // small line under the ask-on-open checkbox, in the phone app
  'remembered_browser': 'Your browser remembers this site’s camera permission.', // small line under the ask-on-open checkbox, in a browser
  'granted_native': 'Camera access is allowed on this device — Scan opens straight to the viewfinder.', // small line under the camera, in the phone app; "Scan" is the tab name
  'granted_browser': 'Camera access is allowed for this site — Scan opens straight to the viewfinder.', // small line under the camera, in a browser; "Scan" is the tab name
} as const
