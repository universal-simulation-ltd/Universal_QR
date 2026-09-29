import type { Source } from './types'

// The research, standards and reports behind each article, keyed by article
// id. The same in every language, so kept once here and attached by index.ts.
//
// Original research papers first, then the standards, then guidance — and
// only sources for what the app really does (checked against src/ and
// @unisim/qr on 2026-09-29: qr-code-styling, which wraps Kazuhiko Arase's
// qrcode-generator, draws the codes at error-correction level H
// (DEFAULT_CONFIG.ecLevel); bwip-js draws the five 1D symbologies and works
// the check digits; @zxing/browser decodes the camera on the device; the
// contrast warning is the WCAG relative-luminance ratio with a 3:1 floor
// (qrContrastIssue); the link check is a no-cors fetch from the device
// (lib/linkCheck.ts); and a dynamic code is a 302 with Cache-Control: no-store
// and Referrer-Policy: no-referrer from the qr-redirect Edge Function).
//
// ⚠️ `pdf` (our hosted copy at opensource.unisim.co.uk/kb/papers/) ONLY where
// the licence allows redistribution: US Government works and IETF RFCs. ISO,
// GS1, Springer and SIAM documents link to the publisher or the authors' own
// free copy instead. iso.org, epubs.siam.org and link.springer.com bot-block
// curl, so those pages were confirmed through Wayback Machine captures (and
// the SIAM and Springer DOIs through Crossref); the links point at the
// publishers themselves.

const ISO_18004: Source = {
  kind: 'standard',
  title: 'ISO/IEC 18004:2024 — Automatic identification and data capture techniques — QR Code bar code symbology specification',
  publisher: 'ISO/IEC',
  year: 2024,
  href: 'https://www.iso.org/standard/83389.html',
}

const RFC_9110: Source = {
  kind: 'standard',
  title: 'HTTP Semantics (RFC 9110)',
  authors: 'Roy T. Fielding, Mark Nottingham, Julian Reschke',
  publisher: 'IETF',
  year: 2022,
  href: 'https://www.rfc-editor.org/rfc/rfc9110.html',
  pdf: 'papers/rfc-9110-http-semantics.pdf',
  licence: 'IETF Trust — RFC, freely redistributable unmodified',
}

export const SOURCES: Record<string, Source[]> = {
  'what-is-a-qr-code': [
    {
      kind: 'paper',
      title: 'Optically readable two-dimensional code and method and apparatus using the same (US Patent 5,726,435)',
      authors: 'Masahiro Hara, Motoaki Watabe, Tadao Nojiri, Takayuki Nagaya, Yuji Uchiyama',
      publisher: 'Nippondenso — the QR code patent',
      year: 1998,
      href: 'https://patents.google.com/patent/US5726435A/en',
    },
    {
      kind: 'report',
      title: 'History of QR Code',
      publisher: 'Denso Wave',
      href: 'https://www.qrcode.com/en/history/',
    },
    ISO_18004,
    {
      kind: 'guidance',
      title: 'qrcode-generator — the open-source QR encoder this app draws codes with',
      authors: 'Kazuhiko Arase',
      publisher: 'GitHub',
      href: 'https://github.com/kazuhikoarase/qrcode-generator',
    },
  ],
  'error-correction': [
    {
      kind: 'paper',
      title: 'Polynomial Codes Over Certain Finite Fields',
      authors: 'Irving S. Reed, Gustave Solomon',
      publisher: 'Journal of the Society for Industrial and Applied Mathematics',
      year: 1960,
      href: 'https://doi.org/10.1137/0108018',
    },
    {
      kind: 'report',
      title: 'Tutorial on Reed-Solomon Error Correction Coding (NASA TM-102162)',
      authors: 'William A. Geisel',
      publisher: 'NASA Lyndon B. Johnson Space Center',
      year: 1990,
      href: 'https://ntrs.nasa.gov/citations/19900019023',
      pdf: 'papers/nasa-tm-102162-reed-solomon-tutorial.pdf',
      licence: 'Public domain (US Government work)',
    },
    { ...ISO_18004, title: 'ISO/IEC 18004:2024 — QR Code, the four error-correction levels (L, M, Q, H)' },
  ],
  'qr-codes-and-barcodes': [
    {
      kind: 'paper',
      title: 'Classifying apparatus and method (US Patent 2,612,994) — the first barcode',
      authors: 'Norman J. Woodland, Bernard Silver',
      publisher: 'US Patent Office',
      year: 1952,
      href: 'https://patents.google.com/patent/US2612994A/en',
    },
    {
      kind: 'standard',
      title: 'GS1 General Specifications (EAN-13, UPC-A, ITF-14 and the check digit)',
      publisher: 'GS1',
      year: 2026,
      href: 'https://ref.gs1.org/standards/genspecs/',
    },
    {
      kind: 'standard',
      title: 'ISO/IEC 15417:2007 — Code 128 bar code symbology specification',
      publisher: 'ISO/IEC',
      year: 2007,
      href: 'https://www.iso.org/standard/43896.html',
    },
    {
      kind: 'guidance',
      title: 'bwip-js — the open-source barcode writer this app draws barcodes with',
      publisher: 'GitHub',
      href: 'https://github.com/metafloor/bwip-js',
    },
  ],
  'static-and-dynamic-codes': [
    { ...RFC_9110, title: 'HTTP Semantics (RFC 9110), §15.4.3: 302 Found — the redirect a dynamic code uses' },
    {
      kind: 'standard',
      title: 'HTTP Caching (RFC 9111)',
      authors: 'Roy T. Fielding, Mark Nottingham, Julian Reschke',
      publisher: 'IETF',
      year: 2022,
      href: 'https://www.rfc-editor.org/rfc/rfc9111.html',
      pdf: 'papers/rfc-9111-http-caching.pdf',
      licence: 'IETF Trust — RFC, freely redistributable unmodified',
    },
  ],
  'codes-that-scan': [
    { ...ISO_18004, title: 'ISO/IEC 18004:2024 — QR Code, including the four-module quiet zone' },
    {
      kind: 'standard',
      title: 'ISO/IEC 15415:2024 — Bar code symbol print quality test specification — Two-dimensional symbols',
      publisher: 'ISO/IEC',
      year: 2024,
      href: 'https://www.iso.org/standard/76876.html',
    },
    {
      kind: 'standard',
      title: 'Web Content Accessibility Guidelines (WCAG) 2.2 — relative luminance and contrast ratio',
      publisher: 'W3C',
      year: 2023,
      href: 'https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio',
    },
  ],
  'scanning-safely': [
    {
      kind: 'paper',
      title: 'QRishing: The Susceptibility of Smartphone Users to QR Code Phishing Attacks',
      authors: 'Timothy Vidas, Emmanuel Owusu, Shuai Wang, Cheng Zeng, Lorrie Faith Cranor, Nicolas Christin',
      publisher: 'Financial Cryptography workshops (USEC)',
      year: 2013,
      href: 'https://www.andrew.cmu.edu/user/nicolasc/publications/Vidas-USEC13.pdf',
    },
    {
      kind: 'paper',
      title: 'QR Code Security: A Survey of Attacks and Challenges for Usable Security',
      authors: 'Katharina Krombholz, Peter Frühwirt, Peter Kieseberg, Ioannis Kapsalis, Markus Huber, Edgar Weippl',
      publisher: 'HCI International (HAS)',
      year: 2014,
      href: 'https://doi.org/10.1007/978-3-319-07620-1_8',
    },
    {
      kind: 'guidance',
      title: 'Scammers hide harmful links in QR codes to steal your information',
      publisher: 'US Federal Trade Commission',
      year: 2023,
      href: 'https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information',
    },
    {
      kind: 'guidance',
      title: 'Phishing scams: report a scam text (7726)',
      publisher: 'National Cyber Security Centre',
      href: 'https://www.ncsc.gov.uk/collection/phishing-scams/report-scam-text-message',
    },
  ],
  'what-leaves-your-device': [
    {
      kind: 'standard',
      title: 'Referrer Policy — the no-referrer policy a dynamic code\'s redirect sends',
      publisher: 'W3C',
      year: 2017,
      href: 'https://www.w3.org/TR/referrer-policy/',
    },
    {
      kind: 'standard',
      title: 'Fetch Standard — no-cors requests and opaque responses, as the link check uses',
      publisher: 'WHATWG',
      href: 'https://fetch.spec.whatwg.org/',
    },
    {
      kind: 'paper',
      title: 'Local-first software: You own your data, in spite of the cloud',
      authors: 'Martin Kleppmann, Adam Wiggins, Peter van Hardenberg, Mark McGranaghan',
      publisher: 'ACM Onward!',
      year: 2019,
      href: 'https://www.inkandswitch.com/local-first/static/local-first.pdf',
    },
  ],
}
