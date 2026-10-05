// studio strings. English (en-GB) is the source; every other language is typed
// against this file. Keys are snake_case; a comment after a key tells the
// translator where it shows and any length limit.
//
// The QR studio page: headline, export button and menu, Simple / Branding /
// Advanced switch, Branding panel, the preview (in-column, pinned on a phone,
// and enlarged full screen), Regenerate style, the link test under the address
// box, the barcode preview and "Save to this device".
export default {
  // Shared
  'remove': 'Remove', // verb, small button: removes the logo, or a saved design
  'close': 'Close', // verb, aria label of the × button on the enlarged code

  // Header
  'headline': 'QR codes that {em}. Forever.', // page title; {em} is headline_em, shown in orange
  'headline_em': 'just work', // the orange words inside headline
  'lead': 'Pick your colours, shape the modules, drop in a logo — it renders live, on your device. Download as PNG, SVG, JPEG or WebP.', // paragraph under the headline

  // Mode switch + reset
  'mode_aria': 'Editor mode', // screen-reader label of the Simple / Branding / Advanced tabs
  'mode_simple': 'Simple', // tab, one word
  'mode_branding': 'Branding', // tab, one word
  'mode_advanced': 'Advanced', // tab, one word
  'reset_all': 'Reset all', // small button: puts every style setting back

  // Export button + menu
  'save_or_share': 'Save or share', // main export button in the phone app (opens the share sheet), keep short
  'download_png': 'Download PNG', // main export button in a browser, keep short
  'preparing': 'Preparing…', // main export button while the file is being made, keep short
  'more_export_aria': 'More export options', // screen-reader label of the ▾ beside the export button
  'more_options': 'More options', // tooltip of the ▾ beside the export button
  'download_as': 'Download as', // small uppercase heading over the list of formats (PNG, SVG…)
  'copy_png': 'Copy PNG to clipboard', // menu item
  'back_up_online': 'Save to reopen later', // menu item: opens the dialog that saves the code on this device (no account) or backs it up online (Universal ID). It used to say "Back up online to unisim.co.uk", which hid the free on-device save behind an account-sounding label
  'copied': '✓ Copied to clipboard', // line under the export button after copying
  'copy_unsupported': 'Copy not supported — use Download', // line under the export button when copying failed
  'scan_test_hint': 'Always scan-test before printing at small sizes.', // line under the export button
  'export_failed': 'Sorry, that export failed: {message}', // alert; {message} is the reason
  'nothing_to_export': 'Nothing to export yet.', // the reason inside export_failed
  'export_failed_reason': 'Export failed', // the reason inside export_failed when the image could not be made

  // Branding panel
  'presets_title': 'Style presets', // section heading, and the label of its list of styles
  'presets_hint': 'A starting point — tweak the colours and logo below.',
  'colours_title': 'Colours', // section heading
  'modules': 'Modules', // colour picker: the colour of the QR code's dots
  'background': 'Background', // colour picker
  'transparent_background': 'Transparent background', // switch
  'transparent_background_hint': 'Export a PNG/SVG with no background fill.',
  'gradient_modules': 'Gradient modules', // switch: the dots fade from one colour to another
  'gradient_end': 'Gradient end', // colour picker: the colour the gradient fades to
  'gradient_angle': 'Gradient angle', // slider
  'two_tone_corners': 'Two-tone corners', // switch
  'two_tone_corners_hint': 'Give the three finder corners their own colour.', // "finder corners" are the three big squares in a QR code's corners
  'corner_colour': 'Corner colour', // colour picker
  'hex_value_aria': '{label} hex value', // screen-reader label of the text box beside a colour picker; {label} is its name, e.g. "Modules"
  'logo_title': 'Logo & branding', // section heading
  'logo_drop_label': 'Drop a logo here, or click to choose one', // screen-reader label of the logo drop area
  'logo_not_image': 'Please choose an image file (PNG, JPG, or SVG).', // alert
  'logo_preview_alt': 'Logo preview', // alt text of the uploaded logo's thumbnail
  'logo_added': 'Custom logo added',
  'logo_replace': 'Replace', // verb, small button: choose a different logo
  'logo_size': 'Logo size', // slider
  'logo_padding': 'Logo padding', // slider: the space around the logo
  'clear_behind_logo': 'Clear modules behind logo', // switch: hides the QR dots under the logo

  // Preview
  'enlarge_aria': 'Enlarge QR code for scanning', // screen-reader label of the preview, which opens it full screen
  'qr_code_for': 'QR code for {name}', // screen-reader label / alt text of the code; {name} is the code's name or address
  'nothing_yet': 'Nothing to show yet.', // over the small phone preview before anything is typed, keep short
  'enter_to_generate': 'Enter a URL or some text to generate your QR code.', // over the empty preview
  'tap_to_enlarge': 'Tap to enlarge', // pill shown when hovering the preview, keep short
  'tap_code_to_enlarge': 'Tap the code to enlarge', // caption beside the small phone preview, keep short

  // Pinned preview (phone)
  'hide_pinned': 'Hide the pinned preview', // screen-reader label and tooltip of the ▴ button
  'show_preview': 'Show QR preview', // button that brings the collapsed preview back

  // Enlarged code
  'enlarged_aria': 'Enlarged QR code for {name}', // screen-reader label of the full-screen view; {name} is the code's name or address
  'click_to_dismiss': 'Click to dismiss', // faint hint down each side of the full-screen view, keep short
  'point_camera': 'Point another phone\'s camera at this code',
  'scan_trouble': 'Struggling? Turn your screen brightness up to max, and make sure the camera isn\'t in close-up (macro) mode — pull back a little so the whole code is in frame.',
  'press_to_save': 'On a phone, press and hold the code to save or share it as an image.',

  // Regenerate style
  'regenerate': 'Regenerate style', // button: picks a new random style, keep short
  'regenerate_title': 'Pick a style at random', // tooltip of regenerate
  'regenerate_title_from': '{preset} — pick another style at random', // tooltip of regenerate; {preset} is the current style's name

  // Link test (under the address box)
  'test_link': 'Test link', // button: opens the address in a new tab, keep short
  'no_scheme': 'No {https} in front — some scanners will open this, others will read it as plain text.', // {https} is "https://" in code type
  'add_https': 'Add https://', // small button; keep https:// as is
  'insecure': 'An {http} address. It will open, but phones show it as “Not secure” — and it can’t be checked from this page.', // {http} is "http://" in code type; “Not secure” is what phone browsers show
  'checking': 'Checking the address…', // status beside Test link, keep short
  'responds': 'The address responds', // status beside Test link, keep short
  'responds_title': 'Something answered at that address. It can\'t tell a real page from a 404 — open it to be sure.', // tooltip of responds
  'offline': 'You’re offline — not checked', // status beside Test link, keep short
  'timeout': 'No answer yet — it may just be slow', // status beside Test link, keep short
  'unreachable': 'Couldn’t reach it from this browser', // status beside Test link, keep short
  'not_proof_title': 'Not proof the link is broken — some sites refuse this kind of check. Open it in a tab to be sure.', // tooltip of offline / timeout / unreachable

  // Barcode preview
  'barcode_enter': 'Enter a value to preview your barcode.',
  'barcode_fix': 'Fix the value above to preview your barcode.',
  'barcode_cant_encode': 'That value can’t be encoded.', // error under the barcode value box

  // Save to this device
  'save_title': 'Save your design', // card heading
  'no_account': 'No account', // chip beside save_title, keep short
  'save_body': 'Keep this QR code on this device and reopen it later — free, no sign-in. It stays in your browser and never leaves it.',
  'saved': '✓ Saved to this device', // save button after saving
  'saving': 'Saving…', // save button while saving
  'enter_url_to_save': 'Enter a URL to save', // save button while there is nothing to save
  'save_to_device': 'Save to this device', // save button
  'save_failed': 'Sorry, that couldn\'t be saved: {message}', // alert; {message} is the reason
  'untitled_design': 'QR code', // name shown for a saved design that has none
  'open': 'Open', // verb, small button: reopens a saved design
  'remove_design_aria': 'Remove {name}', // screen-reader label of Remove; {name} is the saved design's name
  'remove_saved_design_aria': 'Remove saved design', // screen-reader label of Remove when the design has no name
} as const
