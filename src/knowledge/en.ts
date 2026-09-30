import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: 'What actually is a QR code?',
    summary: 'A grid of squares that stores text, and how a camera reads it back.',
    group: 'The basics',
    body: `A QR code is a way of writing a short piece of text as a pattern of dark and light squares that a camera can read quickly and reliably. QR stands for Quick Response. The format was invented in Japan in 1994 by Denso Wave to track car parts in factories, and it is now an open international standard that anyone can use without paying a licence fee.

## What is inside

Every code stores text. Usually that text is a web address, but it can be anything: a sentence, a phone number, the details needed to join a Wi-Fi network, or a contact card. The phone that scans the code decides what to do with the text. If it looks like a web address, it offers to open it. If it looks like Wi-Fi details, it offers to join the network.

The code does not contain a web page, a picture or a file. It only contains the words. A code that holds a web address is really just a very compact way of typing that address for someone.

## The parts of a code

- **Modules** are the small squares. Each one is a single dark or light unit of data.
- **Finder patterns** are the three large squares in the corners. They tell a scanner where the code is, which way up it is and how big it is. A scanner has to find all three before it can read anything else.
- **Timing and alignment patterns** are smaller regular marks that help the scanner work out the grid, even if the code is photographed at an angle or printed on a curved surface.
- **The quiet zone** is the empty border around the outside. It separates the code from whatever is next to it.

## Why some codes are denser than others

QR codes come in 40 sizes, called versions. The smallest is 21 by 21 modules and the largest is 177 by 177. The more text you put in, the more modules are needed, so a long web address makes a busier code than a short one. Busier codes need to be printed larger to scan well, which is one reason short addresses are worth using where you can.`,
  },
  {
    id: 'error-correction',
    title: 'Error correction, and why a logo in the middle still scans',
    summary: 'How a code survives smudges, scratches and a picture on top.',
    group: 'The basics',
    body: `A QR code does not only store your text once. It also stores extra recovery data, worked out with a mathematical method called Reed–Solomon error correction. The same idea is used on CDs and in data sent from space probes. If some of the squares are missing or unreadable, the scanner can use the recovery data to rebuild what was lost.

## The four levels

The QR standard offers four levels of error correction. Each one sets roughly how much of the code can be damaged while it still reads:

- **L** (low): about 7%
- **M** (medium): about 15%
- **Q** (quartile): about 25%
- **H** (high): about 30%

Higher levels need more room for recovery data, so for the same text the code gets denser.

## Why a logo works

Placing a logo in the centre of a code covers some of its squares. To a scanner, that looks exactly like damage. As long as the covered area is well within what the error correction can recover, the code still reads.

Universal QR always uses level **H**, the highest, for this reason. By default every code carries a small mark in the middle, and many people add their own logo, so the code needs as much spare capacity as possible. When a logo is added, the app normally clears the squares behind it rather than drawing the logo on top of a half-hidden pattern, which gives the scanner a cleaner picture to work with.

## The limits

Error correction is a safety margin, not a licence to cover anything. A few things it cannot fix:

- **The finder patterns.** If the three large corner squares are covered or distorted, the scanner may not find the code at all.
- **A very large logo.** Damage from the logo and damage from wear, glare or a poor print all come out of the same budget.
- **Poor contrast.** Error correction repairs missing squares, but it cannot help if the scanner cannot tell dark from light in the first place.

So the practical advice stays the same: keep the logo modest, and always test the finished code with a phone or two before you print a large run.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'QR codes and barcodes: what is the difference?',
    summary: 'Why a supermarket still uses stripes, and which barcode type to pick.',
    group: 'The basics',
    body: `A traditional barcode is a row of vertical stripes. The information is in the widths of the bars and the gaps between them, read from left to right. Because it only uses one direction, it is often called a one-dimensional or 1D barcode. A QR code stores information in both directions at once, across and down, which is why it is called a two-dimensional code.

## What that means in practice

- **Capacity.** A 1D barcode usually holds a short number or a few characters. A QR code can hold a full web address or a paragraph of text.
- **Readers.** 1D barcodes are built to be read by simple, fast laser scanners at a till or in a warehouse. QR codes are designed to be read by cameras, including the one on a phone.
- **Damage.** QR codes have built-in error correction. Most 1D barcodes have, at most, a single check digit that can spot a misread but cannot repair it.

## The barcode types in Universal QR

Universal QR can also make 1D barcodes. Switch Advanced, Type to Barcode, then choose the type under Content:

- **Code 128** holds any text and is the general-purpose choice.
- **EAN-13** is the standard retail barcode in Europe and much of the world.
- **UPC-A** is the standard retail barcode in the United States and Canada.
- **Code 39** is an older format still common on asset tags and in industry.
- **ITF-14** is used on outer shipping cartons.

## Check digits

EAN-13, UPC-A and ITF-14 end in a check digit, worked out from the other digits. If you type the number one digit short, the app calculates the check digit for you. If you type the full number, the app checks that the last digit is correct.

## A note on retail numbers

A barcode generator draws the stripes for whatever number you give it. It does not give you the right to use that number. To sell through most shops, product numbers are normally issued by GS1, the organisation that manages them. If you are selling products, check what your retailer needs before printing packaging.

## Why the app keeps barcodes plain

Barcodes in Universal QR have no logo, colours or decoration. A 1D code often has to be read by a basic scanner, and anything that blurs the edges of the bars can stop it working.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Static and dynamic codes',
    summary: 'What the Dynamic tab changes, and when it is worth using.',
    group: 'How it works',
    body: `Universal QR can make two kinds of QR code, and they work in different ways.

## Static codes

A code made on the QR tab is static. Your web address, or whatever text you typed, is written directly into the pattern of squares. When someone scans it, their phone reads the address from the code and goes straight there. Nothing sits in between.

That has some clear strengths:

- It works for as long as the destination exists. No service has to stay running for the code to keep working.
- Nobody can see who scanned it or when, including us.
- It is free, needs no account and is made entirely on your device.

The one drawback is that you cannot change it. If the address changes, you need to make and print a new code.

## Dynamic codes

A code made on the Dynamic tab does not contain your destination. Instead it contains a short link on the UNI·SIM website. When someone scans the code, their phone visits that short link, our server looks up where the code should currently point, counts the scan and sends the phone on to your destination.

Because the destination is stored on our server rather than in the printed pattern, you can change it whenever you like and every copy of the code already printed follows along. The Dynamic tab also shows how many times each code has been scanned, when it was last scanned, and a chart of the last 30 days.

The trade-offs:

- **You need to sign in** with your Universal ID. Dynamic codes are free with a Universal ID, and free accounts have a generous limit. If you ever reach it, delete a code you no longer need to make room.
- **It depends on the service.** If a dynamic code is deleted, anyone who scans it sees a page saying the code is no longer active, instead of your destination.
- **Each scan is recorded.** See the article on what leaves your device for exactly what is kept.

## Which should you choose?

Use a static code when the destination will not change, such as your main website or a Wi-Fi network. Use a dynamic code when you are printing something that will outlive the page it points to, such as a poster for a changing menu or event, or when you want to know how often it is being scanned.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Making a code that scans every time',
    summary: 'Quiet zone, contrast, size and testing before you print.',
    group: 'How it works',
    body: `A QR code that looks good but does not scan is worse than no code at all. Most failures come from a handful of avoidable causes.

## Leave the quiet zone alone

The empty border around a code tells the scanner where the code ends. The QR standard asks for a border four modules wide. If you crop the image tightly, or place it right up against text or a busy photo, some scanners will struggle. Leave clear space around the code on the page, not only in the image.

## Keep it dark on light

Scanners expect dark squares on a light background. Some phones cope with a light code on a dark background, but many readers do not. Strong contrast matters more than the exact colours: a dark navy on cream is fine, a mid-grey on a slightly lighter grey is not.

Universal QR warns you if your colours make an inverted code or if the contrast is too thin, including on the three corner squares, which a scanner has to find first.

## Make it big enough

A common rule of thumb is that a code can be scanned from about ten times its own width. A code 2 cm wide works at arm's length; a code on a poster across a room needs to be much bigger. Longer text makes a denser code, so a short web address lets you print smaller.

For print, the SVG export is usually the best choice. It is a vector file, so it stays sharp at any size. If you use PNG, export at a large size rather than enlarging a small image later.

## Shapes and decoration

Placing a code on a circle, hexagon or star, or adding decoration around it, makes the code itself smaller within the image so that nothing is clipped. Export at a larger size to compensate, and scan-test it.

## Test before you print

1. Scan the finished file on screen with at least two different phones.
2. Print one copy at the real size and on the real material, then scan it again in the lighting where it will be used.
3. Check that the page it opens is the one you meant.

Universal QR checks that a web address is in a usable form as you type, and quietly asks whether anything answers at it. A green tick means something responded, not that it is the right page, so always open the link yourself too.`,
  },
  {
    id: 'scanning-safely',
    title: 'Scanning codes safely',
    summary: 'A QR code can hide where a link really goes. What to look for.',
    group: 'Privacy and security',
    body: `A QR code is just a link you cannot read by eye. That convenience is also its weakness: you cannot tell where a code goes until you scan it. Most codes are exactly what they seem, but criminals do sometimes use them, for example by sticking a fake code over a real one on a parking meter or a restaurant table, or by sending one in an email or letter.

## Good habits

- **Read the address before you open it.** Look at the web address your phone shows you. Does the name match who you expect? Look out for misspellings, extra words or unusual endings.
- **Be wary of stickers.** On anything public, check that the code is printed as part of the sign rather than stuck on top.
- **Pause when asked to pay or sign in.** A code that takes you straight to a payment page or a login screen deserves extra care. If in doubt, type the organisation's address yourself or use their official app.
- **Do not install apps from a code** unless you are sure of the source. Use your phone's official app store.
- **Codes in emails and letters** deserve the same suspicion as links in emails and letters.

## How the Scan tab helps

When you scan a code with Universal QR, it does not open anything automatically. It shows you the full text of the code, what type of code it is, and a Copy button. If the text is a web address, an Open link button appears, and nothing happens until you press it. That gives you a moment to read the address first.

The scanning itself happens on your device. The camera picture is decoded in the app and is never uploaded. The camera stops as soon as a code is found or when you leave the Scan tab.

## If you think you scanned a bad code

If you entered details on a page you now doubt, change the password you used there and, if it was card or bank details, contact your bank straight away. In the UK you can report suspicious codes and messages to Action Fraud or forward scam messages to 7726.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'What leaves your device',
    summary: 'What stays on your device, what goes online, and when.',
    group: 'Privacy and security',
    body: `Universal QR is built to do its work on your device. Here is exactly what stays there and what does not.

## Stays on your device

- **Designing and exporting codes.** The QR code and barcode images are drawn in the app. Your text, colours and any logo you add are not uploaded.
- **Your current design** is remembered in the app's storage on this device so it is still there next time.
- **Save to this device** keeps a small gallery of designs in the same local storage. It needs no account. Clearing the app's data, or your browser's site data, removes it.
- **Scanning.** The camera picture is decoded on your device and never uploaded.

## One automatic check

When you type a web address starting with https, the app asks your own device to contact that address to see whether anything answers. This goes directly from your device to that website, not through UNI·SIM, and nothing about it is recorded by us. The website you typed will see an ordinary request from your connection, as it would if you visited it.

## Only when you choose

- **Saving a code to your account.** Back up this QR code can store a copy online against your Universal ID. What is uploaded is the image of the code and its design settings, including any logo you added. They are kept in private storage that only you, and other members of your organisation if you belong to one, can open when signed in. It is encrypted in transit and at rest, but it is ordinary cloud storage rather than end-to-end encryption, so we hold the keys. Deleting a backup removes it.
- **Dynamic codes.** The destination address, the name you give the code and its design are stored on our server, because that is how a dynamic code can be changed after printing.

## What a dynamic code records when scanned

Each scan of a dynamic code adds one record with:

- the date and time
- the country the scan came from, as reported by the network
- the name of the website that linked to it, if any, without the rest of the address

No IP address, device details or personal information about the person scanning is stored. The person scanning does not need an account or any app. When you delete a dynamic code, its scan records are deleted with it.

When our server sends the phone on to your destination, it asks the browser not to tell that site it came through the short link.

## What every Universal app sends

While the app is open, it sends our server a small signal that it is in use, so the menu can show how many people use it. That signal holds the app's name, the kind of device (web, phone or desktop), a random ID created on this device and, if you are signed in, your account. If you are signed in, the app also records that you opened it, for your account's activity page. Neither includes anything about the codes you make or scan. There is no third-party analytics or advertising.

## Static codes are private by nature

A code made on the QR tab contains your destination directly. Scanning it never touches UNI·SIM, so there is nothing for us to see or count.`,
  },
]

export default articles
