// controls strings. English (en-GB) is the source; every other language is typed
// against this file. Keys are snake_case; a comment after a key tells the
// translator where it shows and any length limit.
//
// Covers the Advanced panel (Controls.tsx), the "What's it for?" card and its
// content forms, the dynamic-code branding controls (BrandingControls.tsx) and
// the barcode types (lib/barcode.ts). Brand and format names stay as they are:
// UNI·SIM, SSID, PNG, JPG, SVG, Code 128, EAN-13, UPC-A, Code 39, ITF-14.
export default {
  // ── Name section (Advanced) ────────────────────────────────────────────
  name_title: 'Name', // section heading
  name_desc: 'Shown on this code in your online backups.', // under the heading
  name_label: 'Name', // text field label
  name_placeholder: 'My QR code', // example name in the empty field

  // ── Style presets ──────────────────────────────────────────────────────
  presets_title: 'Style presets', // section heading; also the screen-reader name of the chip row
  presets_desc: 'A starting point — tweak anything below.',
  // Preset names, on chips — keep short, one word
  preset_classic: 'Classic',
  preset_rounded: 'Rounded',
  preset_dots: 'Dots',
  preset_sunset: 'Sunset',
  preset_radial: 'Radial',
  preset_star: 'Star',

  // ── Colours ────────────────────────────────────────────────────────────
  colours_title: 'Colours', // section heading
  colour_modules: 'Modules', // colour picker label: the QR code's dots/squares
  colour_background: 'Background', // colour picker label
  colour_hex_aria: '{label} hex value', // screen reader only: the hex text box beside a colour picker; {label} is e.g. "Modules"
  transparent_background: 'Transparent background', // switch label
  transparent_background_hint: 'Export a PNG/SVG with no background fill.',
  gradient_modules: 'Gradient modules', // switch label
  gradient_end: 'Gradient end', // colour picker label: the gradient's second colour
  gradient_angle: 'Gradient angle', // slider label
  two_tone_corners: 'Two-tone corners', // switch label
  two_tone_corners_hint: 'Give the three finder corners their own colour.',
  corner_colour: 'Corner colour', // colour picker label

  // Contrast warnings (amber box under the colours). Each is a bold first
  // sentence followed by the rest. {ratio} is like "2.4", {min} is "3".
  contrast_inverted_background_title: 'Light modules on a dark background.',
  contrast_inverted_background_body:
    "The QR standard expects the opposite, and strict readers refuse an inverted code outright — this app's own Scan tab is one of them. Most phone cameras cope, but swap the two colours if the code has to work everywhere.",
  contrast_inverted_star_title: 'Light modules on a dark star.',
  contrast_inverted_star_body:
    "The QR standard expects the opposite, and strict readers refuse an inverted code outright — this app's own Scan tab is one of them. Most phone cameras cope, but darken the modules or lighten the star behind them if the code has to work everywhere.",
  contrast_low_star_title: 'Not much contrast between the modules and the star behind them.',
  contrast_low_star_body:
    '{ratio}:1, where a reader wants at least {min}:1. The star sits under most of the code, so it is a background as far as a scanner is concerned — however light the page around it is. Lighten the star or darken the modules.',
  contrast_low_modules_title: 'Not much contrast between the modules and the background.',
  contrast_low_modules_body:
    '{ratio}:1, where a reader wants at least {min}:1. Codes this close tend to scan on screen and then fail printed or at a distance. Darken the module colour or lighten the background.',
  contrast_low_corners_title: 'Not much contrast between the corners and the background.',
  contrast_low_corners_body:
    '{ratio}:1, where a reader wants at least {min}:1. A scanner finds the three corner squares before it reads anything else, so this is the riskiest place to be short. Darken the corner colour or lighten the background.',

  // ── Shape & size ───────────────────────────────────────────────────────
  shape_title: 'Shape & size', // section heading
  shape_desc: "The code's outline, module rounding, corner styling and dimensions.",
  code_shape: 'Code shape', // label above a row of shape buttons
  // Shape buttons — keep short, one word (a grid of six)
  shape_square: 'Square',
  shape_rounded: 'Rounded',
  shape_circle: 'Circle',
  shape_squircle: 'Squircle', // a square with rounded, bulging sides
  shape_hexagon: 'Hexagon',
  shape_star: 'Star',
  star_placement: 'Star placement', // label above two buttons
  star_placement_inside: 'Inside the star', // button — keep short
  star_placement_behind: 'Star behind it', // button — keep short
  star_colour: 'Star colour', // colour picker label
  star_behind_desc:
    'The star sits behind the code as a backdrop, with its points showing around it — the look of the QR star mark in Universal PDF. The code is drawn over the star rather than squeezed inside its points, so it is around half again as big as the same design set to Inside, and correspondingly easier to scan. Decoration has no ring to fill in this arrangement, so it is not offered.',
  star_inside_desc:
    'The code sits inside the star, never crossing its edges. That keeps the star whole, at the cost of a much smaller code — the five notches cut into every side of the square that fits.',
  decoration: 'Decoration', // label above the decoration buttons
  // Decoration buttons — keep short, one word
  decor_none: 'None',
  decor_burst: 'Burst',
  decor_scatter: 'Scatter',
  decoration_matches: 'Decoration matches the modules', // switch label
  decoration_matches_hint: 'Turn off to give the decoration its own colour.',
  decoration_colour: 'Decoration colour', // colour picker label
  decoration_on_note:
    'Decoration fills the space the shape leaves around the code — and needs that space, so the code is drawn smaller to make it. Export larger than usual, and scan-test before printing. It sits outside the code, so its colour is free — there is no contrast rule to satisfy.',
  decoration_off_note:
    'Fills the space a shaped plate leaves around the code. Choosing one switches a square code to a circle, since a square plate has no space to fill.',
  // How much of the image the code fills on a shaped plate. {pct} is a
  // percentage number, {size} and {inner} are pixel counts.
  frame_note_rounded: 'The code fills {pct}% of the {size}px image ({inner}px) — the rest is the rounded square around it.', // the package says "the rounded around it"; fixed here
  frame_note_circle: 'The code fills {pct}% of the {size}px image ({inner}px) — the rest is the circle around it.',
  frame_note_squircle: 'The code fills {pct}% of the {size}px image ({inner}px) — the rest is the squircle around it.',
  frame_note_hexagon: 'The code fills {pct}% of the {size}px image ({inner}px) — the rest is the hexagon around it.',
  frame_note_star: 'The code fills {pct}% of the {size}px image ({inner}px) — the rest is the star around it.',
  frame_note_star_behind: "The code fills {pct}% of the {size}px image ({inner}px) — the star's points show around it.",
  frame_note_never_trimmed: 'The code is never trimmed to fit the shape — that would stop it scanning.', // follows the sentence above
  module_style: 'Module style', // label above the module-shape buttons
  // Module-shape buttons — keep short (a grid of six)
  dot_square: 'Square',
  dot_rounded: 'Rounded',
  dot_extra_rounded: 'Extra rounded',
  dot_dots: 'Dots',
  dot_classy: 'Classy',
  dot_classy_rounded: 'Classy rounded',
  corner_frame: 'Corner frame', // label: style of the three big corner squares' outer ring
  corner_frame_square: 'Square', // button — keep short
  corner_frame_rounded: 'Rounded', // button — keep short
  corner_frame_dot: 'Dot', // button — keep short
  corner_dot: 'Corner dot', // label: style of the centre of the three corner squares
  corner_dot_square: 'Square', // button — keep short
  corner_dot_dot: 'Dot', // button — keep short
  size: 'Size', // slider label, in pixels
  quiet_zone: 'Quiet-zone margin', // slider label: the blank border a scanner needs around a code

  // ── Logo & branding ────────────────────────────────────────────────────
  logo_title: 'Logo & branding', // section heading
  logo_desc: 'Drop your brand mark into the centre.',
  logo_drop_label: 'Drop a logo here, or click to choose one', // screen reader name of the drop area
  logo_not_image: 'Please choose an image file (PNG, JPG, or SVG).', // alert when a non-image is picked
  logo_preview_alt: 'Logo preview', // image alt text
  logo_added: 'Custom logo added',
  logo_replace: 'Replace', // small button
  logo_remove: 'Remove', // small button
  logo_pick_touch: 'Tap to choose a logo (PNG, JPG, SVG)', // phones and tablets
  logo_pick_desktop: 'Drop a logo here, or click to choose (PNG, JPG, SVG)', // computers
  logo_size: 'Logo size', // slider label
  logo_padding: 'Logo padding', // slider label
  clear_behind_logo: 'Clear modules behind logo', // switch label
  remove_unisim_mark: 'Remove UNI·SIM mark', // switch label
  remove_unisim_mark_hint_logo: 'Takes away the small UNI·SIM badge in the bottom-right corner.', // when a logo is set
  remove_unisim_mark_hint: 'Takes the UNI·SIM mark out of the centre.', // when no logo is set

  // ── "What's it for?" card ──────────────────────────────────────────────
  content_title: "What's it for?", // card heading; also the screen-reader name of the chip row
  // Kinds of code: chips (keep short, one word) AND the title on the preview card
  kind_link: 'Link',
  kind_wifi: 'Wi-Fi',
  kind_contact: 'Contact',
  kind_email: 'Email',
  kind_phone: 'Phone',
  kind_sms: 'SMS',
  kind_location: 'Location',
  kind_event: 'Event',
  kind_barcode: 'Barcode',
  kind_more: 'More', // chip that opens a second row of kinds — keep short
  more_kinds_aria: 'More kinds of code', // screen reader name of that second row

  // Content form fields
  optional: 'Optional', // placeholder in an optional field
  link_label: 'Website address or text',
  wifi_ssid: 'Network name (SSID)',
  wifi_ssid_placeholder: 'MyWiFi', // example network name
  wifi_password: 'Password',
  wifi_password_placeholder: 'leave blank if open', // placeholder, lower case
  wifi_hidden: 'Hidden network', // tick box
  email_to: 'To', // email recipient
  email_subject: 'Subject',
  email_message: 'Message',
  phone_number: 'Phone number',
  sms_message: 'Message',
  sms_message_placeholder: 'Optional pre-filled text',
  contact_first_name: 'First name',
  contact_first_name_placeholder: 'Jane', // example first name — use a common one in your language
  contact_last_name: 'Last name',
  contact_last_name_placeholder: 'Doe', // example surname — use a common one in your language
  contact_org: 'Organisation',
  contact_phone: 'Phone',
  contact_email: 'Email',
  contact_website: 'Website',
  geo_latitude: 'Latitude',
  geo_longitude: 'Longitude',
  event_title: 'Title',
  event_title_placeholder: 'Team meeting', // example event name
  event_location: 'Location',
  event_starts: 'Starts', // date and time field
  event_ends: 'Ends', // date and time field
  event_description: 'Description',

  // ── Barcode ────────────────────────────────────────────────────────────
  barcode_type: 'Barcode type', // label above the barcode-format buttons
  barcode_value: 'Value', // label above the barcode's one text field
  barcode_value_aria: '{format} value', // screen reader only; {format} is e.g. "EAN-13"
  barcode_static_note: 'Barcodes are static and unstyled — no colours, logo or shape.', // follows the format's hint
  // One-line hint under the field, per format
  barcode_hint_code128: 'Any text or numbers — the most common general-purpose barcode.',
  barcode_hint_ean13: '12 digits (the 13th check digit is added for you), or paste all 13.',
  barcode_hint_upca: '11 digits (check digit added), or paste all 12.',
  barcode_hint_code39: 'Uppercase A–Z, 0–9 and - . $ / + % or space.',
  barcode_hint_itf14: 'Shipping-carton code — 13 digits (check digit added) or all 14.',
  // Validation errors, in red under the field
  barcode_error_code128: 'Enter up to {max} characters.',
  barcode_error_ean13: 'EAN-13 needs 12 or 13 digits.',
  barcode_error_upca: 'UPC-A needs 11 or 12 digits.',
  barcode_error_code39: 'Use uppercase A–Z, 0–9 and - . $ / + % only.',
  barcode_error_itf14: 'ITF-14 needs 13 or 14 digits.',

  // ── Branding controls (dynamic codes) ──────────────────────────────────
  brand_style: 'Style', // small upper-case label above the preset chips
  brand_use_org: 'use org', // tiny link: put the colour back to the organisation's; lower case
  brand_transparent: 'Transparent', // tick box: no background
  brand_gradient: 'Gradient', // tick box
  brand_gradient_end: 'End', // colour picker: the gradient's second colour — keep short
  brand_angle: 'Angle', // slider: the gradient's direction — keep short
  brand_corners: 'Corners', // colour picker for the corner squares — keep short
  brand_centre_logo: 'Centre logo', // label before the logo choices
  brand_logo_none_preview: 'none', // tiny text in the logo preview box when there is no logo; lower case, very short
  brand_org_icon: 'Org icon', // chip — keep short
  brand_upload: 'Upload…', // chip — keep short
  brand_none: 'None', // chip — keep short
} as const
