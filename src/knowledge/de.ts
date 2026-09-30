import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: 'Was ist eigentlich ein QR-Code?',
    summary: 'Ein Raster aus Quadraten, das Text speichert, und wie eine Kamera ihn ausliest.',
    group: 'Die Grundlagen',
    body: `Ein QR-Code ist eine Möglichkeit, ein kurzes Stück Text als Muster aus dunklen und hellen Quadraten zu schreiben, das eine Kamera schnell und zuverlässig lesen kann. QR steht für Quick Response, also schnelle Antwort. Das Format wurde 1994 in Japan von Denso Wave erfunden, um Autoteile in Fabriken zu verfolgen. Heute ist es ein offener internationaler Standard, den jeder ohne Lizenzgebühr nutzen kann.

## Was darin steckt

Jeder Code speichert Text. Meist ist dieser Text eine Webadresse, er kann aber alles Mögliche sein: ein Satz, eine Telefonnummer, die Angaben zum Verbinden mit einem WLAN oder eine Visitenkarte. Das Telefon, das den Code scannt, entscheidet, was mit dem Text geschieht. Sieht er wie eine Webadresse aus, bietet es an, sie zu öffnen. Sieht er wie WLAN-Zugangsdaten aus, bietet es an, sich mit dem Netzwerk zu verbinden.

Der Code enthält keine Webseite, kein Bild und keine Datei. Er enthält nur die Zeichen. Ein Code mit einer Webadresse ist im Grunde nur eine sehr kompakte Art, diese Adresse für jemanden einzutippen.

## Die Bestandteile eines Codes

- **Module** sind die kleinen Quadrate. Jedes ist eine einzelne dunkle oder helle Dateneinheit.
- **Positionsmarken** sind die drei großen Quadrate in den Ecken. Sie zeigen einem Scanner, wo sich der Code befindet, wie er ausgerichtet ist und wie groß er ist. Ein Scanner muss alle drei finden, bevor er irgendetwas anderes lesen kann.
- **Timing- und Ausrichtungsmuster** sind kleinere, regelmäßige Markierungen, mit denen der Scanner das Raster bestimmt, selbst wenn der Code schräg fotografiert oder auf eine gewölbte Fläche gedruckt wurde.
- **Die Ruhezone** ist der leere Rand rundherum. Sie trennt den Code von allem, was daneben steht.

## Warum manche Codes dichter sind als andere

QR-Codes gibt es in 40 Größen, den sogenannten Versionen. Die kleinste hat 21 mal 21 Module, die größte 177 mal 177. Je mehr Text Sie hineinschreiben, desto mehr Module werden gebraucht. Eine lange Webadresse ergibt also einen unruhigeren Code als eine kurze. Dichtere Codes müssen größer gedruckt werden, damit sie sich gut scannen lassen. Das ist ein Grund, möglichst kurze Adressen zu verwenden.`,
  },
  {
    id: 'error-correction',
    title: 'Fehlerkorrektur, und warum ein Logo in der Mitte trotzdem funktioniert',
    summary: 'Wie ein Code Schmutz, Kratzer und ein Bild darüber übersteht.',
    group: 'Die Grundlagen',
    body: `Ein QR-Code speichert Ihren Text nicht nur einmal. Er speichert zusätzlich Wiederherstellungsdaten, die mit einem mathematischen Verfahren namens Reed–Solomon-Fehlerkorrektur berechnet werden. Dieselbe Idee steckt in CDs und in Daten, die Raumsonden zur Erde senden. Fehlen einige Quadrate oder sind sie unlesbar, kann der Scanner das Verlorene aus den Wiederherstellungsdaten rekonstruieren.

## Die vier Stufen

Der QR-Standard kennt vier Stufen der Fehlerkorrektur. Jede legt ungefähr fest, wie viel vom Code beschädigt sein darf, damit er noch lesbar ist:

- **L** (niedrig): etwa 7 %
- **M** (mittel): etwa 15 %
- **Q** (Quartil): etwa 25 %
- **H** (hoch): etwa 30 %

Höhere Stufen brauchen mehr Platz für Wiederherstellungsdaten. Bei gleichem Text wird der Code also dichter.

## Warum ein Logo funktioniert

Ein Logo in der Mitte eines Codes verdeckt einige seiner Quadrate. Für einen Scanner sieht das genauso aus wie eine Beschädigung. Solange die verdeckte Fläche deutlich innerhalb dessen liegt, was die Fehlerkorrektur ausgleichen kann, bleibt der Code lesbar.

Deshalb verwendet Universal QR immer die höchste Stufe, **H**. Standardmäßig trägt jeder Code ein kleines Zeichen in der Mitte, und viele fügen ihr eigenes Logo hinzu. Der Code braucht also so viel Reserve wie möglich. Wird ein Logo hinzugefügt, entfernt die App normalerweise die Quadrate dahinter, statt das Logo über ein halb verdecktes Muster zu legen. So bekommt der Scanner ein saubereres Bild.

## Die Grenzen

Fehlerkorrektur ist ein Sicherheitspuffer, kein Freibrief, alles abzudecken. Einige Dinge kann sie nicht beheben:

- **Die Positionsmarken.** Sind die drei großen Eckquadrate verdeckt oder verzerrt, findet der Scanner den Code unter Umständen gar nicht.
- **Ein sehr großes Logo.** Die „Beschädigung“ durch das Logo und Schäden durch Abnutzung, Spiegelungen oder einen schlechten Druck gehen alle vom selben Budget ab.
- **Schwacher Kontrast.** Fehlerkorrektur ersetzt fehlende Quadrate, hilft aber nicht, wenn der Scanner Dunkel und Hell gar nicht erst unterscheiden kann.

Der praktische Rat bleibt daher derselbe: Halten Sie das Logo bescheiden, und testen Sie den fertigen Code immer mit ein oder zwei Telefonen, bevor Sie eine große Auflage drucken.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'QR-Codes und Barcodes: Was ist der Unterschied?',
    summary: 'Warum der Supermarkt noch Striche nutzt, und welcher Barcode-Typ der richtige ist.',
    group: 'Die Grundlagen',
    body: `Ein klassischer Barcode ist eine Reihe senkrechter Striche. Die Information steckt in der Breite der Striche und der Lücken dazwischen und wird von links nach rechts gelesen. Weil er nur eine Richtung nutzt, nennt man ihn oft eindimensionalen oder 1D-Barcode. Ein QR-Code speichert Informationen in beiden Richtungen zugleich, waagerecht und senkrecht. Deshalb heißt er zweidimensionaler Code.

## Was das in der Praxis bedeutet

- **Kapazität.** Ein 1D-Barcode enthält meist eine kurze Zahl oder wenige Zeichen. Ein QR-Code kann eine vollständige Webadresse oder einen ganzen Absatz Text aufnehmen.
- **Lesegeräte.** 1D-Barcodes sind dafür gemacht, von einfachen, schnellen Laserscannern an der Kasse oder im Lager gelesen zu werden. QR-Codes sind für Kameras gedacht, auch für die im Telefon.
- **Beschädigung.** QR-Codes haben eine eingebaute Fehlerkorrektur. Die meisten 1D-Barcodes haben höchstens eine Prüfziffer, die einen Lesefehler erkennen, aber nicht beheben kann.

## Die Barcode-Typen in Universal QR

Universal QR kann auch 1D-Barcodes erstellen. Stellen Sie unter Erweitert den Typ auf Barcode und wählen Sie dann unter Inhalt die Art aus:

- **Code 128** nimmt beliebigen Text auf und ist die Allzweckwahl.
- **EAN-13** ist der übliche Handels-Barcode in Europa und weiten Teilen der Welt.
- **UPC-A** ist der übliche Handels-Barcode in den USA und Kanada.
- **Code 39** ist ein älteres Format, das auf Inventaretiketten und in der Industrie noch verbreitet ist.
- **ITF-14** wird auf Versandkartons verwendet.

## Prüfziffern

EAN-13, UPC-A und ITF-14 enden mit einer Prüfziffer, die aus den übrigen Ziffern berechnet wird. Geben Sie die Nummer eine Ziffer zu kurz ein, berechnet die App die Prüfziffer für Sie. Geben Sie die vollständige Nummer ein, prüft die App, ob die letzte Ziffer stimmt.

## Ein Hinweis zu Artikelnummern

Ein Barcode-Generator zeichnet die Striche für jede Nummer, die Sie ihm geben. Das Recht, diese Nummer zu verwenden, gibt er Ihnen nicht. Wer über die meisten Geschäfte verkaufen will, bekommt Artikelnummern normalerweise von GS1, der Organisation, die sie verwaltet. Wenn Sie Produkte verkaufen, klären Sie vor dem Druck der Verpackung, was Ihr Händler verlangt.

## Warum die App Barcodes schlicht hält

Barcodes in Universal QR haben kein Logo, keine Farben und keine Verzierungen. Ein 1D-Code muss oft von einem einfachen Scanner gelesen werden, und alles, was die Kanten der Striche verwischt, kann ihn unbrauchbar machen.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Statische und dynamische Codes',
    summary: 'Was der Tab Dynamisch ändert, und wann er sich lohnt.',
    group: 'So funktioniert es',
    body: `Universal QR kann zwei Arten von QR-Codes erstellen, und sie funktionieren unterschiedlich.

## Statische Codes

Ein Code aus dem Tab QR ist statisch. Ihre Webadresse oder der Text, den Sie eingegeben haben, steht direkt im Muster der Quadrate. Wenn jemand ihn scannt, liest das Telefon die Adresse aus dem Code und ruft sie direkt auf. Nichts steht dazwischen.

Das hat klare Vorteile:

- Er funktioniert, solange das Ziel existiert. Kein Dienst muss weiterlaufen, damit der Code funktioniert.
- Niemand kann sehen, wer ihn wann gescannt hat, auch wir nicht.
- Er ist kostenlos, braucht kein Konto und wird vollständig auf Ihrem Gerät erstellt.

Der einzige Nachteil: Sie können ihn nicht ändern. Ändert sich die Adresse, müssen Sie einen neuen Code erstellen und drucken.

## Dynamische Codes

Ein Code aus dem Tab Dynamisch enthält nicht Ihr Ziel. Er enthält stattdessen einen kurzen Link auf der UNI·SIM-Website. Wenn jemand den Code scannt, ruft das Telefon diesen kurzen Link auf. Unser Server schlägt nach, wohin der Code gerade zeigen soll, zählt den Scan und leitet das Telefon an Ihr Ziel weiter.

Weil das Ziel auf unserem Server gespeichert ist und nicht im gedruckten Muster, können Sie es jederzeit ändern, und jedes bereits gedruckte Exemplar des Codes folgt. Der Tab Dynamisch zeigt außerdem, wie oft jeder Code gescannt wurde, wann zuletzt, und ein Diagramm der letzten 30 Tage.

Die Kompromisse:

- **Sie müssen sich anmelden**, mit Ihrer Universal ID. Dynamische Codes sind mit Ihrer Universal ID kostenlos, und kostenlose Konten haben ein großzügiges Limit. Sollten Sie es einmal erreichen, löschen Sie einen Code, den Sie nicht mehr brauchen, um Platz zu schaffen.
- **Er hängt vom Dienst ab.** Wird ein dynamischer Code gelöscht, sieht jeder, der ihn scannt, statt Ihres Ziels eine Seite mit dem Hinweis, dass der Code nicht mehr aktiv ist.
- **Jeder Scan wird erfasst.** Was genau gespeichert wird, steht im Artikel darüber, was Ihr Gerät verlässt.

## Welchen sollten Sie wählen?

Nehmen Sie einen statischen Code, wenn sich das Ziel nicht ändern wird, etwa bei Ihrer Hauptwebsite oder einem WLAN. Nehmen Sie einen dynamischen Code, wenn Sie etwas drucken, das die Seite, auf die es verweist, überdauern wird, etwa ein Plakat für eine wechselnde Speisekarte oder Veranstaltung, oder wenn Sie wissen möchten, wie oft er gescannt wird.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Ein Code, der jedes Mal funktioniert',
    summary: 'Ruhezone, Kontrast, Größe und Testen vor dem Druck.',
    group: 'So funktioniert es',
    body: `Ein QR-Code, der gut aussieht, aber nicht scannt, ist schlechter als gar keiner. Die meisten Fehlschläge haben eine Handvoll vermeidbarer Ursachen.

## Lassen Sie die Ruhezone frei

Der leere Rand um einen Code zeigt dem Scanner, wo der Code endet. Der QR-Standard verlangt einen Rand von vier Modulen Breite. Wenn Sie das Bild knapp zuschneiden oder direkt an Text oder ein unruhiges Foto setzen, haben manche Scanner Probleme. Lassen Sie auch auf der Seite Platz um den Code, nicht nur im Bild.

## Dunkel auf Hell

Scanner erwarten dunkle Quadrate auf hellem Grund. Manche Telefone kommen mit einem hellen Code auf dunklem Grund zurecht, viele Lesegeräte aber nicht. Starker Kontrast ist wichtiger als die genauen Farben: Dunkelblau auf Creme ist in Ordnung, Mittelgrau auf etwas hellerem Grau nicht.

Universal QR warnt Sie, wenn Ihre Farben einen invertierten Code ergeben oder der Kontrast zu schwach ist, auch bei den drei Eckquadraten, die ein Scanner zuerst finden muss.

## Groß genug

Als gängige Faustregel lässt sich ein Code aus etwa dem Zehnfachen seiner eigenen Breite scannen. Ein 2 cm breiter Code funktioniert auf Armlänge; ein Code auf einem Plakat, das man quer durch den Raum liest, muss viel größer sein. Längerer Text ergibt einen dichteren Code, eine kurze Webadresse erlaubt also einen kleineren Druck.

Für den Druck ist der SVG-Export meist die beste Wahl. Es ist eine Vektordatei, die in jeder Größe scharf bleibt. Wenn Sie PNG verwenden, exportieren Sie gleich in großer Größe, statt ein kleines Bild später zu vergrößern.

## Formen und Verzierungen

Wenn Sie einen Code auf einen Kreis, ein Sechseck oder einen Stern setzen oder Verzierungen hinzufügen, wird der Code selbst im Bild kleiner, damit nichts abgeschnitten wird. Exportieren Sie zum Ausgleich in einer größeren Größe, und testen Sie das Scannen.

## Vor dem Druck testen

1. Scannen Sie die fertige Datei auf dem Bildschirm mit mindestens zwei verschiedenen Telefonen.
2. Drucken Sie ein Exemplar in der echten Größe und auf dem echten Material, und scannen Sie es noch einmal in dem Licht, in dem es verwendet wird.
3. Prüfen Sie, ob die Seite, die sich öffnet, die gewünschte ist.

Universal QR prüft schon beim Tippen, ob eine Webadresse eine brauchbare Form hat, und fragt im Hintergrund nach, ob unter ihr etwas antwortet. Ein grünes Häkchen bedeutet, dass etwas geantwortet hat, nicht, dass es die richtige Seite ist. Öffnen Sie den Link deshalb immer auch selbst.`,
  },
  {
    id: 'scanning-safely',
    title: 'Codes sicher scannen',
    summary: 'Ein QR-Code kann verbergen, wohin ein Link wirklich führt. Worauf Sie achten sollten.',
    group: 'Datenschutz und Sicherheit',
    body: `Ein QR-Code ist einfach ein Link, den man mit bloßem Auge nicht lesen kann. Diese Bequemlichkeit ist zugleich seine Schwäche: Wohin ein Code führt, erfahren Sie erst beim Scannen. Die meisten Codes sind genau das, wonach sie aussehen, doch Kriminelle nutzen sie manchmal, zum Beispiel indem sie einen gefälschten Code über einen echten an einem Parkautomaten oder Restauranttisch kleben oder einen per E-Mail oder Brief verschicken.

## Gute Gewohnheiten

- **Lesen Sie die Adresse, bevor Sie sie öffnen.** Sehen Sie sich die Webadresse an, die Ihr Telefon anzeigt. Passt der Name zu dem, den Sie erwarten? Achten Sie auf Tippfehler, zusätzliche Wörter oder ungewöhnliche Endungen.
- **Seien Sie bei Aufklebern vorsichtig.** Prüfen Sie an allem Öffentlichen, ob der Code Teil des gedruckten Schildes ist und nicht darübergeklebt wurde.
- **Halten Sie inne, wenn Sie bezahlen oder sich anmelden sollen.** Ein Code, der direkt auf eine Zahlungsseite oder eine Anmeldemaske führt, verdient besondere Vorsicht. Tippen Sie im Zweifel die Adresse der Organisation selbst ein oder nutzen Sie deren offizielle App.
- **Installieren Sie keine Apps über einen Code**, solange Sie sich der Quelle nicht sicher sind. Nutzen Sie den offiziellen App-Store Ihres Telefons.
- **Codes in E-Mails und Briefen** verdienen dasselbe Misstrauen wie Links in E-Mails und Briefen.

## Wie der Tab Scannen hilft

Wenn Sie mit Universal QR einen Code scannen, wird nichts automatisch geöffnet. Die App zeigt Ihnen den vollständigen Text des Codes, die Art des Codes und eine Schaltfläche Kopieren. Ist der Text eine Webadresse, erscheint die Schaltfläche Link öffnen, und es passiert nichts, bis Sie darauf tippen. So haben Sie einen Moment Zeit, die Adresse zuerst zu lesen.

Das Scannen selbst findet auf Ihrem Gerät statt. Das Kamerabild wird in der App ausgewertet und nie hochgeladen. Die Kamera stoppt, sobald ein Code gefunden wurde oder Sie den Tab Scannen verlassen.

## Wenn Sie glauben, einen schädlichen Code gescannt zu haben

Wenn Sie auf einer Seite, der Sie jetzt misstrauen, Daten eingegeben haben, ändern Sie das dort verwendete Passwort. Waren es Karten- oder Bankdaten, wenden Sie sich sofort an Ihre Bank. Verdächtige Codes und Nachrichten können Sie der Polizei oder der offiziellen Meldestelle für Betrug in Ihrem Land melden.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'Was Ihr Gerät verlässt',
    summary: 'Was auf Ihrem Gerät bleibt, was online geht, und wann.',
    group: 'Datenschutz und Sicherheit',
    body: `Universal QR ist so gebaut, dass es seine Arbeit auf Ihrem Gerät erledigt. Hier steht genau, was dort bleibt und was nicht.

## Bleibt auf Ihrem Gerät

- **Codes gestalten und exportieren.** Die Bilder der QR-Codes und Barcodes werden in der App gezeichnet. Ihr Text, Ihre Farben und ein eventuell hinzugefügtes Logo werden nicht hochgeladen.
- **Ihr aktuelles Design** wird im Speicher der App auf diesem Gerät gemerkt, damit es beim nächsten Mal noch da ist.
- **Auf diesem Gerät speichern** legt eine kleine Galerie mit Designs im selben lokalen Speicher an. Dafür ist kein Konto nötig. Wenn Sie die Daten der App oder die Websitedaten Ihres Browsers löschen, wird sie entfernt.
- **Scannen.** Das Kamerabild wird auf Ihrem Gerät ausgewertet und nie hochgeladen.

## Eine automatische Prüfung

Wenn Sie eine Webadresse eingeben, die mit https beginnt, lässt die App Ihr eigenes Gerät diese Adresse kontaktieren, um zu sehen, ob dort etwas antwortet. Das geht direkt von Ihrem Gerät zu dieser Website, nicht über UNI·SIM, und wir zeichnen nichts davon auf. Die eingegebene Website sieht eine gewöhnliche Anfrage von Ihrer Verbindung, so als würden Sie sie besuchen.

## Nur wenn Sie es wählen

- **Einen Code in Ihrem Konto speichern.** Mit Diesen QR-Code sichern können Sie eine Kopie online bei Ihrer Universal ID ablegen. Hochgeladen werden das Bild des Codes und seine Designeinstellungen, einschließlich eines eventuell hinzugefügten Logos. Sie liegen in einem privaten Speicher, den nur Sie und, falls Sie einer Organisation angehören, deren andere Mitglieder nach der Anmeldung öffnen können. Die Daten sind bei der Übertragung und im Ruhezustand verschlüsselt, es handelt sich aber um gewöhnlichen Cloud-Speicher und nicht um Ende-zu-Ende-Verschlüsselung: Die Schlüssel liegen bei uns. Wenn Sie eine Sicherung löschen, wird sie entfernt.
- **Dynamische Codes.** Die Zieladresse, der Name, den Sie dem Code geben, und sein Design werden auf unserem Server gespeichert, denn nur so lässt sich ein dynamischer Code nach dem Druck ändern.

## Was ein dynamischer Code beim Scannen erfasst

Jeder Scan eines dynamischen Codes erzeugt einen Eintrag mit:

- Datum und Uhrzeit
- dem Land, aus dem der Scan kam, wie es das Netzwerk meldet
- dem Namen der Website, die darauf verlinkt hat, falls vorhanden, ohne den Rest der Adresse

Es werden keine IP-Adresse, keine Gerätedaten und keine persönlichen Informationen über die scannende Person gespeichert. Wer scannt, braucht weder ein Konto noch eine App. Wenn Sie einen dynamischen Code löschen, werden seine Scan-Einträge mit ihm gelöscht.

Wenn unser Server das Telefon an Ihr Ziel weiterleitet, bittet er den Browser, dieser Website nicht mitzuteilen, dass der Besuch über den kurzen Link kam.

## Was jede Universal-App sendet

Solange die App geöffnet ist, sendet sie unserem Server ein kleines Signal, dass sie in Gebrauch ist, damit das Menü anzeigen kann, wie viele Menschen sie nutzen. Dieses Signal enthält den Namen der App, die Art des Geräts (Web, Telefon oder Desktop), eine auf diesem Gerät erzeugte Zufalls-ID und, wenn Sie angemeldet sind, Ihr Konto. Wenn Sie angemeldet sind, vermerkt die App außerdem für die Aktivitätsseite Ihres Kontos, dass Sie sie geöffnet haben. Keines von beiden enthält etwas über die Codes, die Sie erstellen oder scannen. Es gibt keine Analyse- oder Werbedienste von Drittanbietern.

## Statische Codes sind von Natur aus privat

Ein Code aus dem Tab QR enthält Ihr Ziel direkt. Beim Scannen wird UNI·SIM nie berührt, es gibt für uns also nichts zu sehen oder zu zählen.`,
  },
]

export default articles
