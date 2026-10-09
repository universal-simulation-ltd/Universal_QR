import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: "Che cos'è davvero un codice QR?",
    summary: 'Una griglia di quadratini che memorizza del testo, e come una fotocamera lo rilegge.',
    group: 'Le basi',
    body: `Un codice QR è un modo per scrivere un breve testo sotto forma di schema di quadratini scuri e chiari, che una fotocamera può leggere in modo rapido e affidabile. QR sta per Quick Response, cioè risposta rapida. Il formato è stato inventato in Giappone nel 1994 da Denso Wave per tracciare i componenti delle auto nelle fabbriche, e oggi è uno standard internazionale aperto che chiunque può usare senza pagare alcuna licenza.

## Che cosa contiene

Ogni codice memorizza del testo. Di solito si tratta di un indirizzo web, ma può essere qualsiasi cosa: una frase, un numero di telefono, i dati per collegarsi a una rete Wi-Fi o un biglietto da visita. È il telefono che scansiona il codice a decidere cosa fare con il testo. Se sembra un indirizzo web, propone di aprirlo. Se sembra contenere i dati di una rete Wi-Fi, propone di collegarsi.

Il codice non contiene una pagina web, un'immagine o un file. Contiene solo le parole. Un codice con un indirizzo web è in realtà soltanto un modo molto compatto per digitare quell'indirizzo al posto di qualcuno.

## Le parti di un codice

- **I moduli** sono i quadratini. Ognuno è una singola unità di dati, scura o chiara.
- **I pattern di posizionamento** sono i tre quadrati grandi negli angoli. Indicano allo scanner dove si trova il codice, come è orientato e quanto è grande. Lo scanner deve trovarli tutti e tre prima di poter leggere qualsiasi altra cosa.
- **I pattern di temporizzazione e di allineamento** sono segni più piccoli e regolari che aiutano lo scanner a ricostruire la griglia, anche se il codice è fotografato di sbieco o stampato su una superficie curva.
- **La zona di rispetto** è il bordo vuoto tutto intorno. Separa il codice da ciò che gli sta accanto.

## Perché alcuni codici sono più fitti di altri

I codici QR esistono in 40 dimensioni, chiamate versioni. La più piccola è di 21 per 21 moduli e la più grande di 177 per 177. Più testo inserisci, più moduli servono, quindi un indirizzo web lungo produce un codice più fitto di uno corto. I codici più fitti vanno stampati più grandi per essere letti bene, e questo è uno dei motivi per cui conviene usare indirizzi brevi quando puoi.`,
  },
  {
    id: 'error-correction',
    title: 'La correzione degli errori, e perché un logo al centro non impedisce la lettura',
    summary: "Come un codice resiste a macchie, graffi e a un'immagine sovrapposta.",
    group: 'Le basi',
    body: `Un codice QR non memorizza il tuo testo una sola volta. Memorizza anche dati di recupero aggiuntivi, calcolati con un metodo matematico chiamato correzione degli errori Reed–Solomon. La stessa idea si usa nei CD e nei dati inviati dalle sonde spaziali. Se alcuni quadratini mancano o sono illeggibili, lo scanner può usare i dati di recupero per ricostruire ciò che è andato perso.

## I quattro livelli

Lo standard QR prevede quattro livelli di correzione degli errori. Ognuno stabilisce, più o meno, quanta parte del codice può essere danneggiata senza che smetta di funzionare:

- **L** (basso): circa il 7%
- **M** (medio): circa il 15%
- **Q** (quartile): circa il 25%
- **H** (alto): circa il 30%

I livelli più alti richiedono più spazio per i dati di recupero, quindi a parità di testo il codice diventa più fitto.

## Perché un logo funziona

Un logo al centro del codice copre alcuni quadratini. Per uno scanner è esattamente come un danno. Finché l'area coperta resta ben dentro ciò che la correzione degli errori può recuperare, il codice si legge comunque.

Per questo motivo Universal QR usa sempre il livello **H**, il più alto. Di default ogni codice ha un piccolo marchio al centro, e molte persone aggiungono il proprio logo, quindi il codice ha bisogno di quanta più capacità di riserva possibile. Quando aggiungi un logo, di solito l'app libera i quadratini che stanno dietro invece di disegnare il logo sopra uno schema mezzo nascosto, così lo scanner ha un'immagine più pulita da interpretare.

## I limiti

La correzione degli errori è un margine di sicurezza, non un permesso per coprire qualsiasi cosa. Ecco alcune cose che non può riparare:

- **I pattern di posizionamento.** Se i tre quadrati grandi negli angoli sono coperti o deformati, lo scanner potrebbe non trovare affatto il codice.
- **Un logo molto grande.** I danni dovuti al logo e quelli dovuti a usura, riflessi o stampa scadente attingono tutti alla stessa riserva.
- **Un contrasto scarso.** La correzione degli errori ripara i quadratini mancanti, ma non può aiutare se lo scanner non riesce a distinguere lo scuro dal chiaro.

Il consiglio pratico quindi resta lo stesso: tieni il logo di dimensioni contenute e prova sempre il codice finito con un paio di telefoni prima di stamparne una grande quantità.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'Codici QR e codici a barre: qual è la differenza?',
    summary: 'Perché i supermercati usano ancora le strisce, e quale tipo di codice a barre scegliere.',
    group: 'Le basi',
    body: `Un codice a barre tradizionale è una fila di strisce verticali. Le informazioni stanno nella larghezza delle barre e degli spazi tra di esse, lette da sinistra a destra. Poiché usa una sola direzione, viene spesso chiamato codice a barre monodimensionale o 1D. Un codice QR memorizza le informazioni in entrambe le direzioni contemporaneamente, in orizzontale e in verticale, ed è per questo che si chiama codice bidimensionale.

## Che cosa significa in pratica

- **Capacità.** Un codice a barre 1D contiene di solito un numero breve o pochi caratteri. Un codice QR può contenere un indirizzo web completo o un intero paragrafo di testo.
- **Lettori.** I codici a barre 1D sono pensati per essere letti da scanner laser semplici e veloci, alla cassa o in magazzino. I codici QR sono pensati per essere letti da fotocamere, compresa quella di un telefono.
- **Danni.** I codici QR hanno una correzione degli errori integrata. La maggior parte dei codici a barre 1D ha al massimo una singola cifra di controllo, che può individuare una lettura sbagliata ma non correggerla.

## I tipi di codice a barre in Universal QR

Universal QR può creare anche codici a barre 1D. Imposta Avanzate, Tipo su Codice a barre, poi scegli il tipo in Contenuto:

- **Code 128** contiene qualsiasi testo ed è la scelta per uso generale.
- **EAN-13** è il codice a barre standard per la vendita al dettaglio in Europa e in gran parte del mondo.
- **UPC-A** è il codice a barre standard per la vendita al dettaglio negli Stati Uniti e in Canada.
- **Code 39** è un formato più vecchio, ancora diffuso sulle etichette di inventario e nell'industria.
- **ITF-14** si usa sugli imballaggi esterni per la spedizione.

## Cifre di controllo

EAN-13, UPC-A e ITF-14 terminano con una cifra di controllo, calcolata a partire dalle altre cifre. Se digiti il numero con una cifra in meno, l'app calcola la cifra di controllo per te. Se digiti il numero completo, l'app verifica che l'ultima cifra sia corretta.

## Una nota sui numeri per la vendita

Un generatore di codici a barre disegna le strisce per qualsiasi numero tu gli fornisca. Non ti dà però il diritto di usare quel numero. Per vendere nella maggior parte dei negozi, i codici prodotto vengono normalmente assegnati da GS1, l'organizzazione che li gestisce. Se vendi prodotti, verifica cosa richiede il tuo rivenditore prima di stampare le confezioni.

## Perché l'app mantiene semplici i codici a barre

I codici a barre in Universal QR non hanno logo, colori o decorazioni. Un codice 1D spesso deve essere letto da uno scanner elementare, e qualsiasi cosa sfumi i bordi delle barre può impedirne la lettura.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Codici statici e dinamici',
    summary: 'Che cosa cambia la scheda Dinamico, e quando vale la pena usarla.',
    group: 'Come funziona',
    body: `Universal QR può creare due tipi di codice QR, che funzionano in modo diverso.

## Codici statici

Un codice creato nella scheda Progetta è statico. Il tuo indirizzo web, o qualunque testo tu abbia digitato, è scritto direttamente nello schema di quadratini. Quando qualcuno lo scansiona, il suo telefono legge l'indirizzo dal codice e ci va direttamente. Non c'è nulla nel mezzo.

Questo ha alcuni punti di forza evidenti:

- Funziona finché esiste la destinazione. Nessun servizio deve restare attivo perché il codice continui a funzionare.
- Nessuno può vedere chi l'ha scansionato o quando, noi compresi.
- È gratuito, non richiede un account ed è creato interamente sul tuo dispositivo.

L'unico svantaggio è che non puoi modificarlo. Se l'indirizzo cambia, devi creare e stampare un nuovo codice.

## Codici dinamici

Un codice creato nella scheda Dinamico non contiene la tua destinazione. Contiene invece un link breve sul sito di UNI·SIM. Quando qualcuno scansiona il codice, il suo telefono visita quel link breve, il nostro server controlla dove deve puntare il codice in quel momento, conta la scansione e rimanda il telefono alla tua destinazione.

Poiché la destinazione è memorizzata sul nostro server e non nello schema stampato, puoi cambiarla quando vuoi e ogni copia del codice già stampata si aggiorna di conseguenza. La scheda Dinamico mostra anche quante volte è stato scansionato ogni codice, quando è stato scansionato l'ultima volta e un grafico degli ultimi 30 giorni.

I compromessi:

- **Devi accedere** con il tuo Universal ID. I codici dinamici sono gratuiti con il tuo Universal ID, e gli account gratuiti hanno un limite generoso. Se dovessi raggiungerlo, elimina un codice che non ti serve più per fare spazio.
- **Dipende dal servizio.** Se un codice dinamico viene eliminato, chi lo scansiona vede una pagina che dice che il codice non è più attivo, invece della tua destinazione.
- **Ogni scansione viene registrata.** Consulta l'articolo su ciò che lascia il tuo dispositivo per sapere esattamente cosa viene conservato.

## Quale scegliere?

Usa un codice statico quando la destinazione non cambierà, come il tuo sito principale o una rete Wi-Fi. Usa un codice dinamico quando stampi qualcosa che durerà più a lungo della pagina a cui punta, come un manifesto per un menu o un evento che cambia, oppure quando vuoi sapere quanto spesso viene scansionato.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Creare un codice che si legge sempre',
    summary: 'Zona di rispetto, contrasto, dimensioni e prove prima di stampare.',
    group: 'Come funziona',
    body: `Un codice QR bello da vedere ma che non si legge è peggio di nessun codice. La maggior parte dei problemi nasce da poche cause evitabili.

## Lascia libera la zona di rispetto

Il bordo vuoto intorno a un codice indica allo scanner dove finisce il codice. Lo standard QR richiede un bordo largo quattro moduli. Se ritagli l'immagine troppo stretta, o la metti a ridosso di un testo o di una foto piena di dettagli, alcuni scanner avranno difficoltà. Lascia spazio libero intorno al codice sulla pagina, non solo nell'immagine.

## Scuro su chiaro

Gli scanner si aspettano quadratini scuri su sfondo chiaro. Alcuni telefoni riescono a leggere un codice chiaro su sfondo scuro, ma molti lettori no. Un contrasto forte conta più dei colori esatti: un blu notte su color crema va bene, un grigio medio su un grigio appena più chiaro no.

Universal QR ti avvisa se i tuoi colori producono un codice invertito o se il contrasto è troppo debole, anche sui tre quadrati negli angoli, che uno scanner deve trovare per primi.

## Fallo abbastanza grande

Una regola pratica diffusa è che un codice si può leggere da una distanza di circa dieci volte la sua larghezza. Un codice largo 2 cm funziona a distanza di braccio; un codice su un manifesto dall'altra parte di una stanza deve essere molto più grande. Un testo più lungo produce un codice più fitto, quindi un indirizzo web breve ti permette di stampare più piccolo.

Per la stampa, l'esportazione in SVG è di solito la scelta migliore. È un file vettoriale, quindi resta nitido a qualsiasi dimensione. Se usi PNG, esporta a una dimensione grande invece di ingrandire un'immagine piccola in un secondo momento.

## Forme e decorazioni

Mettere un codice su un cerchio, un esagono o una stella, o aggiungere decorazioni intorno, rende il codice stesso più piccolo all'interno dell'immagine, così che nulla venga tagliato. Esporta a una dimensione maggiore per compensare e prova a scansionarlo.

## Prova prima di stampare

1. Scansiona il file finito sullo schermo con almeno due telefoni diversi.
2. Stampa una copia alla dimensione reale e sul materiale reale, poi scansionala di nuovo con la luce del luogo in cui verrà usata.
3. Verifica che la pagina che si apre sia quella che intendevi.

Mentre digiti, Universal QR controlla che un indirizzo web sia in una forma utilizzabile e verifica discretamente se a quell'indirizzo risponde qualcosa. Una spunta verde significa che qualcosa ha risposto, non che sia la pagina giusta, quindi apri sempre anche tu il link.`,
  },
  {
    id: 'scanning-safely',
    title: 'Scansionare i codici in sicurezza',
    summary: 'Un codice QR può nascondere dove porta davvero un link. A cosa fare attenzione.',
    group: 'Privacy e sicurezza',
    body: `Un codice QR è semplicemente un link che non puoi leggere a occhio. Questa comodità è anche il suo punto debole: non puoi sapere dove porta un codice finché non lo scansioni. La maggior parte dei codici è esattamente ciò che sembra, ma a volte i criminali li usano, per esempio incollando un codice falso sopra uno vero su un parchimetro o sul tavolo di un ristorante, oppure inviandone uno in un'email o in una lettera.

## Buone abitudini

- **Leggi l'indirizzo prima di aprirlo.** Guarda l'indirizzo web che ti mostra il telefono. Il nome corrisponde a chi ti aspetti? Fai attenzione a errori di ortografia, parole in più o estensioni insolite.
- **Diffida degli adesivi.** Su qualsiasi cosa in un luogo pubblico, controlla che il codice sia stampato come parte del cartello e non incollato sopra.
- **Fermati se ti chiedono di pagare o di accedere.** Un codice che ti porta direttamente a una pagina di pagamento o a una schermata di accesso merita più attenzione. Nel dubbio, digita tu stesso l'indirizzo dell'organizzazione o usa la sua app ufficiale.
- **Non installare app da un codice** a meno che tu non sia sicuro della fonte. Usa lo store ufficiale del tuo telefono.
- **I codici in email e lettere** meritano lo stesso sospetto dei link in email e lettere.

## Come ti aiuta la scheda Scansiona

Quando scansioni un codice con Universal QR, l'app non apre nulla automaticamente. Ti mostra il testo completo del codice, che tipo di codice è e un pulsante Copia. Se il testo è un indirizzo web, compare un pulsante Apri link, e non succede nulla finché non lo premi. Così hai un momento per leggere prima l'indirizzo.

La scansione avviene sul tuo dispositivo. L'immagine della fotocamera viene decodificata nell'app e non viene mai caricata online. La fotocamera si ferma non appena trova un codice o quando esci dalla scheda Scansiona.

## Se pensi di aver scansionato un codice sospetto

Se hai inserito dei dati in una pagina di cui ora dubiti, cambia la password che hai usato lì e, se si trattava di dati della carta o bancari, contatta subito la tua banca. Puoi segnalare codici e messaggi sospetti alla polizia o al servizio ufficiale per la segnalazione delle frodi del tuo Paese.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'Cosa lascia il tuo dispositivo',
    summary: 'Cosa resta sul tuo dispositivo, cosa va online, e quando.',
    group: 'Privacy e sicurezza',
    body: `Universal QR è pensato per svolgere il proprio lavoro sul tuo dispositivo. Ecco esattamente cosa resta lì e cosa no.

## Resta sul tuo dispositivo

- **Progettazione ed esportazione dei codici.** Le immagini dei codici QR e dei codici a barre vengono disegnate nell'app. Il tuo testo, i colori e l'eventuale logo che aggiungi non vengono caricati online.
- **Il progetto attuale** viene ricordato nella memoria dell'app su questo dispositivo, così lo ritrovi la volta successiva.
- **Salva su questo dispositivo** conserva una piccola galleria di progetti nella stessa memoria locale. Non richiede un account. Cancellando i dati dell'app, o i dati del sito nel browser, la galleria viene eliminata.
- **Scansione.** L'immagine della fotocamera viene decodificata sul tuo dispositivo e non viene mai caricata online.

## Un controllo automatico

Quando digiti un indirizzo web che inizia con https, l'app chiede al tuo dispositivo di contattare quell'indirizzo per vedere se risponde qualcosa. La richiesta va direttamente dal tuo dispositivo a quel sito, non passa per UNI·SIM, e noi non ne registriamo nulla. Il sito che hai digitato vedrà una normale richiesta dalla tua connessione, come se lo visitassi.

## Solo se lo scegli tu

- **Salvare un codice nel tuo account.** Esegui il backup di questo codice QR può conservare una copia online associata al tuo Universal ID. Viene caricata l'immagine del codice con le sue impostazioni di design, compreso l'eventuale logo che hai aggiunto. Sono conservate in uno spazio privato che solo tu, e gli altri membri della tua organizzazione se ne fai parte, potete aprire dopo aver effettuato l'accesso. Sono cifrate in transito e a riposo, ma si tratta di un normale archivio cloud e non di crittografia end-to-end, quindi le chiavi le abbiamo noi. Eliminando un backup, questo viene rimosso.
- **Codici dinamici.** L'indirizzo di destinazione, il nome che dai al codice e il suo design sono memorizzati sul nostro server, perché è così che un codice dinamico può essere modificato dopo la stampa.

## Cosa registra un codice dinamico quando viene scansionato

Ogni scansione di un codice dinamico aggiunge un record con:

- la data e l'ora
- il Paese da cui proviene la scansione, secondo quanto indicato dalla rete
- il nome del sito che vi ha portato, se presente, senza il resto dell'indirizzo

Non vengono memorizzati indirizzi IP, dettagli del dispositivo o informazioni personali su chi scansiona. Chi scansiona non ha bisogno di un account né di alcuna app. Quando elimini un codice dinamico, vengono eliminati anche i suoi record di scansione.

Quando il nostro server rimanda il telefono alla tua destinazione, chiede al browser di non dire a quel sito che è arrivato tramite il link breve.

## Cosa invia ogni app Universal

Mentre l'app è aperta, invia al nostro server un piccolo segnale per indicare che è in uso, così il menu può mostrare quante persone la usano. Il segnale contiene il nome dell'app, il tipo di dispositivo (web, telefono o computer), un ID casuale creato su questo dispositivo e, se hai effettuato l'accesso, il tuo account. Se hai effettuato l'accesso, l'app registra anche che l'hai aperta, per la pagina delle attività del tuo account. Nessuno dei due include qualcosa sui codici che crei o scansioni. Non ci sono strumenti di analisi o pubblicità di terze parti.

## I codici statici sono privati per natura

Un codice creato nella scheda Progetta contiene direttamente la tua destinazione. Scansionarlo non coinvolge mai UNI·SIM, quindi non c'è nulla che possiamo vedere o contare.`,
  },
]

export default articles
