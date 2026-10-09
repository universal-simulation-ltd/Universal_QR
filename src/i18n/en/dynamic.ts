// dynamic strings. English (en-GB) is the source; every other language is typed
// against this file. Keys are snake_case; a comment after a key tells the
// translator where it shows and any length limit.
//
// The Dynamic tab (hosted, re-pointable QR codes with scan counts), each saved
// dynamic code's card, and the "Back up this QR code" dialog. Brand names stay
// as they are: UNI·SIM, Universal ID, Universal QR.
export default {
  // Shared across this namespace
  'loading': 'Loading…',
  'cancel': 'Cancel',
  'delete': 'Delete',
  'saving': 'Saving…',
  'need_more': 'Need more? Tell us', // low-key link to the support page, under the at-limit note
  'signin_button': 'Create / sign in with Universal ID →', // button, opens the Universal ID sign-in page

  // Dynamic tab — header
  'title': 'Dynamic QR codes', // page heading
  'requires_universal_id': 'Requires Universal ID', // small chip beside the heading; keep short
  'intro': 'One printed code, a destination you can change any time — plus a live scan count. The link stays fixed ({link}); you repoint where it sends people whenever you like.', // link = the literal web address, shown as code

  // Dynamic tab — signed out
  'signin_title': 'Create a Universal ID to make dynamic QR codes for FREE.', // heading of the sign-in card; FREE is deliberately in capitals
  'signin_body': 'A dynamic code holds a short link we keep for you under your {id} — that’s how you can change where it goes after it’s printed, and see how often it’s scanned. The plain {qr} tab stays 100% free and on your device.', // id = "Universal ID" in bold; qr = the QR tab's name, as a link
  'signin_body_qr_tab': 'QR', // the name of the plain QR tab, inside signin_body — must match the tab's own label

  // Dynamic tab — branding for new codes
  'branding_title': 'Branding for new codes', // collapsible section heading
  'branding_hint_org': 'Defaults to your organisation’s icon and colour. Each code keeps the look it was created with — change an existing one with Tune branding on its card.', // "Tune branding" = the edit_branding button on each code's card
  'branding_hint_no_org': 'Each code keeps the look it was created with — change an existing one with Tune branding on its card. Add a logo and brand colour to your organisation and they’ll fill in here automatically.',
  'branding_reset': 'Reset', // small button, puts the branding back to the defaults
  'branding_preview_caption': 'Example · unisim.co.uk', // caption under the example QR; keep the web address as it is
  'branding_preview_label': 'Example dynamic QR with your branding', // screen-reader description of the example QR

  // Dynamic tab — create a code
  'new_code_title': 'New dynamic code', // panel heading
  'purchased_tokens_one': '{count} purchased token', // small badge; only shown once someone has bought tokens
  'purchased_tokens_other': '{count} purchased tokens',
  'signed_in_as': 'Signed in as {email}',
  'destination_label': 'Destination URL', // field label: where the code sends people
  'name_label': 'Label {optional}', // field label; optional = the optional key, shown lighter
  'optional': '(optional)',
  'name_placeholder': 'Spring campaign flyer', // example label in the empty field
  'creating': 'Creating…',
  'create': 'Create dynamic code', // button
  'checking_account': 'Checking your account…',

  // Dynamic tab — reaching the limit. Only ever shown once the free allowance
  // has run out; deliberately no numbers and no "tokens".
  'near_limit': "You've used {used} of your {limit} free dynamic codes.", // quiet note under the Create button, only once 80% or more are used; used and limit are numbers
  'at_limit': "You've used your free dynamic codes.",
  'at_limit_make_room': "You've used your free dynamic codes. Delete one to make room.", // shown at the free limit, web and phone apps alike

  // Dynamic tab — errors
  'error_branding_too_large': 'That branding is too big to save — try a smaller centre logo.',
  'error_no_org': 'Online codes are kept with your company, and your Universal ID doesn’t have one yet. Setting one up is free.', // since 2026-10-02 the hub no longer creates a company for you
  'setup_company_button': 'Set up a company →',
  'error_could_not_create': 'Could not create this dynamic code.',
  'error_could_not_delete': 'Could not delete this code.',
  'confirm_delete': 'Delete "{name}"? Anyone who scans it will hit a "not active" page.', // confirmation box; name = the code's label or short code

  // Dynamic tab — the list of codes
  'your_codes': 'Your dynamic codes', // small uppercase list heading
  'empty': 'No dynamic codes yet. Create your first one on the left — you can re-point it and watch the scans roll in.',

  // A dynamic code's card
  'tap_to_enlarge': 'Tap to enlarge', // tooltip on the small QR
  'enlarge_label': 'Enlarge QR code for {target}', // screen-reader label; target = the destination's website name
  'qr_label': 'Dynamic QR code for {target}', // screen-reader description of the QR; target = the destination's website name
  'edit_branding': '✏️ Tune branding', // small link under the QR
  'close_branding': 'Close branding',
  'copy': 'Copy', // tiny uppercase button beside the link; keep very short
  'copy_link_label': 'Copy dynamic link', // screen-reader label of the Copy button
  'delete_title': 'Delete this code', // tooltip on Delete
  'redirects_to': 'Redirects to', // small uppercase label above the destination
  'change_destination': 'Change destination', // small button
  'save_destination': 'Save destination', // button
  'destination_hint': 'The printed code stays the same — only where it sends people changes.',
  'error_could_not_update_destination': 'Could not update the destination.',
  'total_scans': 'Total scans', // small uppercase label under the scan count
  'last_scan': 'Last scan', // label above the date and time of the latest scan
  'no_scans_yet': 'No scans yet',
  'scans_chart_label': 'Scans over the last 30 days', // screen-reader label of the small bar chart
  'scans_one': '{count} scan', // tooltip on one day's bar in the chart
  'scans_other': '{count} scans',

  // A dynamic code's card — editing its branding
  'brand_own_hint': 'This code’s own branding. Changing it re-draws this code and nothing else.',
  'brand_legacy_hint': 'This code was made before codes kept their own branding, so it still follows the panel above. Saving here pins the look to this code.', // "the panel above" = Branding for new codes
  'match_branding': 'Match branding for new codes', // small button: copies the branding_title settings into this code
  'brand_preview_caption': 'Preview · {target}', // caption under the preview; target = the destination's website name
  'brand_preview_label': 'Preview of {name} with this branding', // screen-reader description; name = the code's label or website name
  'save_branding': 'Save branding', // button
  'brand_save_hint': 'The link and the scan count are untouched — but anything already printed keeps the old look, so re-download it.',
  'error_could_not_save_branding': 'Could not save this code’s branding.',
  'error_design_too_large': 'That design is too big to save — try a smaller centre logo.',

  // "Back up this QR code" dialog
  'backup_title': 'Save this QR code', // dialog heading
  'backup_close': 'Close', // screen-reader label of the ✕ button
  'backup_sign_in': 'Create a {id} to back up your QR codes online for FREE — then open them on any device.', // id = "Universal ID" in bold; FREE is deliberately in capitals
  'backup_backing_up': 'Backing up…',
  'backup_backed_up': '✓ Backed up',
  'backup_back_up_online': 'Back up this QR online', // button
  'backup_needs_data': 'Enter a URL or some text to back up your QR code.',
  'backup_near_limit': "You've used {used} of your {limit} free online backups.", // quiet note under the Back up button, only once 80% or more are used; used and limit are numbers
  'backup_used_up': "You've used your free online backups. Delete one below to make room.", // shown at the free limit, web and phone apps alike
  'backup_your_backups': 'Your backups', // small uppercase list heading
  'backup_none_yet': 'None yet.',
  'backup_open': 'Open', // button, opens the saved QR image
  'backup_delete_title': 'Delete this backup', // tooltip on Delete
  'backup_missing': '{file} is listed here, but there is no file behind it — this save never finished, so nothing was ever stored. Your save slot is still being held for it.', // file = the file name in bold
  'backup_remove_entry': 'Remove this entry and free the save', // button
  'backup_could_not_store': 'Could not store this QR code.',
  'backup_could_not_delete': 'Could not delete this QR code.',
  'backup_could_not_save_now': 'Could not save right now.',
  'backup_could_not_delete_now': 'Could not delete this backup right now.',
} as const
