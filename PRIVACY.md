# What Universal QR does with what you type

The short version: **your codes are drawn by your own device.** The text, link,
colours and logo you put into a QR code or barcode are not sent to us to be
rendered, and nothing leaves your device unless you press a button that says so.

Every claim below names the file in this repository that makes it true, so you
can go and check it.

---

## What stays on your device

| What | Where it happens | The code |
|---|---|---|
| Drawing QR codes and barcodes, and exporting PNG, SVG, JPEG or WebP | your browser or the app | [`src/components/qr/QrCanvas.tsx`](src/components/qr/QrCanvas.tsx), [`src/lib/barcode.ts`](src/lib/barcode.ts), [`src/lib/download.ts`](src/lib/download.ts) |
| Your current design, remembered for next time | the app's storage on this device | [`src/stores/qrStore.ts`](src/stores/qrStore.ts) |
| **Save to this device** — a small gallery of designs | the same local storage; no account needed | [`src/lib/localDesigns.ts`](src/lib/localDesigns.ts) |
| Scanning a code with the camera | decoded on your device; the picture is never uploaded, and the camera stops when a code is found or you leave the Scan tab | [`src/components/qr/ScanStudio.tsx`](src/components/qr/ScanStudio.tsx) |

Clearing the app's data, or your browser's site data, removes the local copies.
Nobody else can read them, including us.

A code made on the **Design** tab contains your destination directly. Scanning
it never touches UNI·SIM, so there is nothing for us to see or count.

---

## Checking a link — only when you press "Check link"

Under a web address that starts with `https://`, the **Check link** button asks
whether anything answers at that address. Nothing is contacted until you press
it, and editing the address clears the answer.

- The request goes **straight from your device to that website**, the same as
  opening it would. It does not pass through UNI·SIM and we record nothing about
  it. The website sees an ordinary request from your connection.
- A green tick means "something answered", not "this is the right page". Use
  **Test link** to open it and look.
- The code: [`src/components/qr/LinkCheck.tsx`](src/components/qr/LinkCheck.tsx)
  and [`src/lib/linkCheck.ts`](src/lib/linkCheck.ts).

---

## What leaves your device only when you choose

These need a **Universal ID** (sign-in is optional; the app works without one).

- **Back up this QR code.** Stores the code's image and its design settings
  (including any logo you added) against your account, in private storage that
  only you, and other members of your organisation if you belong to one, can
  open. Deleting a backup removes it. See
  [`src/lib/hostedStore.ts`](src/lib/hostedStore.ts).
- **Dynamic codes.** The destination address, the name you give the code and
  its design are stored on our server, because that is how a dynamic code can be
  changed after printing. See [`src/lib/dynamicCodes.ts`](src/lib/dynamicCodes.ts).
  Each scan of a dynamic code records the date and time, the country reported by
  the network, and the name of the website that linked to it (if any). No IP
  address and nothing about the person scanning is stored. Deleting the code
  deletes its scan records.

⚠️ **This is ordinary cloud storage, not end-to-end encryption.** It is
encrypted in transit and at rest, and access is limited to your account and
organisation, but we hold the keys — so this is a promise about our conduct,
not a mathematical guarantee.

---

## What the app talks to a server for, even when your codes don't

- **Signing in.** Only if you choose to, through Universal ID (our accounts
  service, run on Supabase). Signing in with Apple, Google or Microsoft goes
  through that provider's own sign-in page. You can delete your account from
  **Delete my account** in Global Tuning, in the profile menu; that deletes it
  in every UNI·SIM app.
- **"You opened the app".** When you are signed in, the app records one event
  saying it was opened, for your account's activity page. Nothing about your
  codes. This is `UsageTracker` in [`@unisim/sdk`](https://www.npmjs.com/package/@unisim/sdk),
  mounted in [`src/main.tsx`](src/main.tsx).
- **"This app is in use" — the website only.** While the website is open, it
  tells our server every 45 seconds that the app is in use, so the menu can
  show how many people use it. That message holds the app's name, a random ID
  made in your browser, and your account if you are signed in: nothing about
  your codes. See `presence.ts` in `@unisim/sdk`. **The iPhone, iPad, Android
  and desktop apps don't send this and keep no such ID** — `presence` is
  switched off for them in [`src/main.tsx`](src/main.tsx).
- **The changelog and update notice**, which fetches a list of releases.

**There is no third-party analytics, no tracking pixel and no advertising
script.** The website's Content-Security-Policy
([`public/_headers`](public/_headers)) only lets the page run scripts from our
own domain and Google's sign-in script.

---

## How to check it yourself

1. Open the app, then your browser's developer tools (F12) on the **Network**
   tab.
2. Make a code: type a link, change colours, add a logo, export it.
3. Watch the list. What you typed is never in it — until you press **Check
   link**, and then only as a request to the site you typed.

Or turn off your Wi-Fi and keep using the app. Designing, exporting and
scanning keep working.

---

## If you find this page is wrong

Open an issue on
[the repository](https://github.com/universal-simulation-ltd/Universal_QR/issues).
