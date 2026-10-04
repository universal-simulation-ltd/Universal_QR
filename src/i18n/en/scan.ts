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
  'dont_ask_on_open': "Don't ask for camera access when I open Scan", // "Scan" is the tab name (app.tab_scan): use the same word

  // Result card
  'format_unknown': 'Unknown', // barcode type label when the type cannot be told; shown in capitals
  'copy': 'Copy', // button: copies the scanned text; keep short
  'copied': '✓ Copied', // replaces "Copy" for a moment after copying; keep short
  'open_link': 'Open link ↗', // button: opens the scanned web address; keep the ↗ arrow
  'open_link_anyway': 'Open anyway ↗', // replaces "Open link ↗" when a warning is shown above it; keep the ↗ arrow
  'goes_to': 'Goes to', // label before the website name a scanned link really opens, e.g. "Goes to example.com"

  // Warnings about a scanned web link, shown above the open button. {host} is
  // the website name exactly as the browser will show it — never translated.
  'warn_insecure': 'Not encrypted (http://): anyone on the same network can see or change the page.',
  'warn_lookalike': 'This address uses letters from another alphabet, which can imitate a familiar name. Your browser will show it as {host}.',
  'warn_credentials': 'The part before “@” is not where this link goes. It really opens {host}.',
  'warn_ip': 'It points at a number (an IP address) instead of a named website.',
  'warn_shortener': 'It’s a shortened link, so you can’t see where it really goes until you open it.',
  'blocked': 'This code holds a “{scheme}:” address, which could run code or open files on your device. Universal QR won’t open it.', // {scheme} is e.g. javascript or data, never translated

  // Other kinds of code
  'wifi_network': 'Wi-Fi network', // label above the network name read from a Wi-Fi QR code
  'wifi_password': 'Password', // label above the Wi-Fi password
  'wifi_open': 'No password (open network)', // shown instead of a password for an open network
  'wifi_join_hint': 'To join, open your Wi-Fi settings, choose this network and paste the password.',
  'copy_password': 'Copy password', // button; keep short
  'call': 'Call {number}', // button for a phone-number code; {number} is the number
  'write_email': 'Email {address}', // button for an email code; {address} is the email address
  'send_text': 'Text {number}', // button for an SMS code; {number} is the phone number

  // Scanning a picture instead of the camera
  'scan_image': 'Scan an image', // button: pick a photo or screenshot that has a code in it; keep short
  'reading_image': 'Reading image…',
  'image_no_code': 'No QR code or barcode was found in that image. Try a sharper, closer picture.',

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
