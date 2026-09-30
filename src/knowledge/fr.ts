import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: "Qu'est-ce qu'un QR code, au juste ?",
    summary: "Une grille de carrés qui contient du texte, et comment un appareil photo la relit.",
    group: 'Les bases',
    body: `Un QR code est une manière d'écrire un court texte sous la forme d'un motif de carrés sombres et clairs qu'un appareil photo peut lire rapidement et de façon fiable. QR signifie Quick Response (réponse rapide). Le format a été inventé au Japon en 1994 par Denso Wave pour suivre des pièces automobiles dans les usines. C'est aujourd'hui une norme internationale ouverte que chacun peut utiliser sans payer de licence.

## Ce qu'il contient

Chaque code contient du texte. Le plus souvent, il s'agit d'une adresse web, mais ce peut être n'importe quoi : une phrase, un numéro de téléphone, les informations nécessaires pour rejoindre un réseau Wi-Fi ou une fiche de contact. C'est le téléphone qui scanne le code qui décide quoi faire de ce texte. S'il ressemble à une adresse web, il propose de l'ouvrir. S'il ressemble à des informations Wi-Fi, il propose de rejoindre le réseau.

Le code ne contient ni page web, ni image, ni fichier. Il ne contient que les mots. Un code qui renferme une adresse web n'est en réalité qu'un moyen très compact de taper cette adresse à la place de quelqu'un.

## Les éléments d'un code

- **Les modules** sont les petits carrés. Chacun est une unité de données, sombre ou claire.
- **Les motifs de repérage** sont les trois grands carrés situés dans les coins. Ils indiquent au lecteur où se trouve le code, dans quel sens il est orienté et quelle est sa taille. Le lecteur doit trouver les trois avant de pouvoir lire quoi que ce soit d'autre.
- **Les motifs de synchronisation et d'alignement** sont des repères réguliers plus petits qui aident le lecteur à reconstituer la grille, même si le code est photographié de biais ou imprimé sur une surface courbe.
- **La zone de silence** est la bordure vide tout autour. Elle sépare le code de ce qui l'entoure.

## Pourquoi certains codes sont plus denses que d'autres

Les QR codes existent en 40 tailles, appelées versions. La plus petite mesure 21 modules sur 21 et la plus grande 177 sur 177. Plus vous y mettez de texte, plus il faut de modules : une longue adresse web donne donc un code plus chargé qu'une adresse courte. Les codes plus chargés doivent être imprimés plus grands pour bien se scanner, et c'est l'une des raisons pour lesquelles il vaut la peine d'utiliser des adresses courtes quand c'est possible.`,
  },
  {
    id: 'error-correction',
    title: "La correction d'erreurs, ou pourquoi un code avec un logo au centre se scanne quand même",
    summary: "Comment un code résiste aux taches, aux rayures et à une image posée par-dessus.",
    group: 'Les bases',
    body: `Un QR code ne se contente pas de stocker votre texte une seule fois. Il contient aussi des données de récupération supplémentaires, calculées grâce à une méthode mathématique appelée correction d'erreurs Reed–Solomon. Le même principe est utilisé sur les CD et dans les données envoyées par les sondes spatiales. Si certains carrés manquent ou sont illisibles, le lecteur peut se servir des données de récupération pour reconstituer ce qui a été perdu.

## Les quatre niveaux

La norme QR propose quatre niveaux de correction d'erreurs. Chacun détermine, approximativement, quelle part du code peut être endommagée tout en restant lisible :

- **L** (bas) : environ 7 %
- **M** (moyen) : environ 15 %
- **Q** (quartile) : environ 25 %
- **H** (haut) : environ 30 %

Les niveaux plus élevés demandent plus de place pour les données de récupération : pour un même texte, le code devient donc plus dense.

## Pourquoi un logo fonctionne

Placer un logo au centre d'un code en recouvre une partie des carrés. Pour un lecteur, cela ressemble exactement à un dommage. Tant que la zone recouverte reste bien en deçà de ce que la correction d'erreurs peut récupérer, le code reste lisible.

C'est pour cette raison qu'Universal QR utilise toujours le niveau **H**, le plus élevé. Par défaut, chaque code porte une petite marque en son centre, et beaucoup de personnes ajoutent leur propre logo : le code a donc besoin d'autant de marge que possible. Lorsqu'un logo est ajouté, l'application efface normalement les carrés situés derrière plutôt que de dessiner le logo par-dessus un motif à moitié caché, ce qui donne au lecteur une image plus nette à analyser.

## Les limites

La correction d'erreurs est une marge de sécurité, pas une autorisation à tout recouvrir. Voici quelques cas qu'elle ne peut pas rattraper :

- **Les motifs de repérage.** Si les trois grands carrés des coins sont recouverts ou déformés, le lecteur risque de ne pas trouver le code du tout.
- **Un logo très grand.** Les dommages causés par le logo et ceux dus à l'usure, aux reflets ou à une impression de mauvaise qualité puisent tous dans la même réserve.
- **Un contraste insuffisant.** La correction d'erreurs répare les carrés manquants, mais elle ne peut rien si le lecteur n'arrive pas à distinguer le sombre du clair.

Le conseil pratique reste donc le même : gardez un logo de taille raisonnable, et testez toujours le code final avec un ou deux téléphones avant d'en imprimer un grand nombre.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'QR codes et codes-barres : quelle différence ?',
    summary: "Pourquoi les supermarchés utilisent encore des barres, et quel type de code-barres choisir.",
    group: 'Les bases',
    body: `Un code-barres traditionnel est une rangée de barres verticales. L'information se trouve dans la largeur des barres et des espaces qui les séparent, lus de gauche à droite. Comme il n'utilise qu'une seule direction, on parle souvent de code-barres unidimensionnel, ou 1D. Un QR code stocke l'information dans les deux directions à la fois, en largeur et en hauteur : c'est pourquoi on parle de code bidimensionnel.

## Ce que cela change en pratique

- **Capacité.** Un code-barres 1D contient généralement un nombre court ou quelques caractères. Un QR code peut contenir une adresse web complète ou un paragraphe de texte.
- **Lecteurs.** Les codes-barres 1D sont conçus pour être lus par des scanners laser simples et rapides, en caisse ou en entrepôt. Les QR codes sont conçus pour être lus par des appareils photo, y compris celui d'un téléphone.
- **Dommages.** Les QR codes intègrent une correction d'erreurs. La plupart des codes-barres 1D ont tout au plus un chiffre de contrôle, qui permet de repérer une erreur de lecture mais pas de la corriger.

## Les types de codes-barres dans Universal QR

Universal QR peut aussi créer des codes-barres 1D. Activez Avancé, réglez Type sur Code-barres, puis choisissez le type sous Contenu :

- **Code 128** accepte n'importe quel texte et convient à la plupart des usages.
- **EAN-13** est le code-barres standard du commerce de détail en Europe et dans une grande partie du monde.
- **UPC-A** est le code-barres standard du commerce de détail aux États-Unis et au Canada.
- **Code 39** est un format plus ancien, encore courant sur les étiquettes d'inventaire et dans l'industrie.
- **ITF-14** est utilisé sur les cartons d'expédition.

## Chiffres de contrôle

Les codes EAN-13, UPC-A et ITF-14 se terminent par un chiffre de contrôle, calculé à partir des autres chiffres. Si vous saisissez le numéro avec un chiffre de moins, l'application calcule le chiffre de contrôle pour vous. Si vous saisissez le numéro complet, l'application vérifie que le dernier chiffre est correct.

## À propos des numéros de produit

Un générateur de codes-barres dessine les barres correspondant au numéro que vous lui donnez. Il ne vous donne pas le droit d'utiliser ce numéro. Pour vendre dans la plupart des magasins, les numéros de produit sont normalement attribués par GS1, l'organisme qui les gère. Si vous vendez des produits, vérifiez ce que demande votre distributeur avant d'imprimer vos emballages.

## Pourquoi l'application garde des codes-barres sobres

Les codes-barres d'Universal QR n'ont ni logo, ni couleurs, ni décoration. Un code 1D doit souvent être lu par un scanner basique, et tout ce qui rend flous les bords des barres peut l'empêcher de fonctionner.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Codes statiques et codes dynamiques',
    summary: "Ce que change l'onglet Dynamique, et quand il vaut la peine de l'utiliser.",
    group: 'Fonctionnement',
    body: `Universal QR peut créer deux sortes de QR codes, qui fonctionnent différemment.

## Les codes statiques

Un code créé dans l'onglet QR est statique. Votre adresse web, ou le texte que vous avez saisi, est inscrit directement dans le motif de carrés. Quand quelqu'un le scanne, son téléphone lit l'adresse dans le code et s'y rend directement. Rien ne s'intercale entre les deux.

Cela présente des avantages nets :

- Le code fonctionne tant que la destination existe. Aucun service n'a besoin de rester en marche pour que le code continue de fonctionner.
- Personne ne peut savoir qui l'a scanné ni quand, nous y compris.
- C'est gratuit, sans compte, et entièrement créé sur votre appareil.

Le seul inconvénient est qu'on ne peut pas le modifier. Si l'adresse change, vous devez créer et imprimer un nouveau code.

## Les codes dynamiques

Un code créé dans l'onglet Dynamique ne contient pas votre destination. Il contient à la place un lien court vers le site web d'UNI·SIM. Quand quelqu'un scanne le code, son téléphone ouvre ce lien court ; notre serveur regarde alors vers où le code doit pointer à ce moment-là, comptabilise le scan et redirige le téléphone vers votre destination.

Comme la destination est enregistrée sur notre serveur et non dans le motif imprimé, vous pouvez la modifier quand vous le souhaitez, et tous les exemplaires du code déjà imprimés suivent le changement. L'onglet Dynamique indique aussi combien de fois chaque code a été scanné, quand il l'a été pour la dernière fois, et affiche un graphique des 30 derniers jours.

Les contreparties :

- **Vous devez vous connecter** avec votre Universal ID. Les codes dynamiques sont gratuits avec votre Universal ID, et les comptes gratuits disposent d'une limite généreuse. Si vous l'atteignez un jour, supprimez un code dont vous n'avez plus besoin pour faire de la place.
- **Il dépend du service.** Si un code dynamique est supprimé, toute personne qui le scanne voit une page indiquant que le code n'est plus actif, au lieu de votre destination.
- **Chaque scan est enregistré.** Consultez l'article sur ce qui quitte votre appareil pour savoir exactement ce qui est conservé.

## Lequel choisir ?

Utilisez un code statique lorsque la destination ne changera pas, par exemple votre site web principal ou un réseau Wi-Fi. Utilisez un code dynamique lorsque vous imprimez un support qui durera plus longtemps que la page vers laquelle il pointe, comme une affiche pour un menu ou un événement qui change, ou lorsque vous voulez savoir combien de fois il est scanné.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Créer un code qui se scanne à tous les coups',
    summary: "Zone de silence, contraste, taille et tests avant impression.",
    group: 'Fonctionnement',
    body: `Un QR code joli mais impossible à scanner est pire que pas de code du tout. La plupart des échecs viennent d'une poignée de causes évitables.

## Respectez la zone de silence

La bordure vide autour d'un code indique au lecteur où le code s'arrête. La norme QR demande une bordure large de quatre modules. Si vous recadrez l'image trop près, ou si vous la placez tout contre du texte ou une photo chargée, certains lecteurs auront du mal. Laissez de l'espace libre autour du code sur la page, et pas seulement dans l'image.

## Du sombre sur du clair

Les lecteurs s'attendent à des carrés sombres sur un fond clair. Certains téléphones s'en sortent avec un code clair sur fond sombre, mais beaucoup de lecteurs non. Un contraste marqué compte davantage que les couleurs exactes : un bleu marine foncé sur du crème convient, un gris moyen sur un gris à peine plus clair, non.

Universal QR vous prévient si vos couleurs produisent un code inversé ou si le contraste est trop faible, y compris sur les trois carrés des coins, que le lecteur doit trouver en premier.

## Prévoyez une taille suffisante

Une règle empirique courante veut qu'un code puisse être scanné à environ dix fois sa propre largeur. Un code de 2 cm de large fonctionne à bout de bras ; un code sur une affiche à l'autre bout d'une pièce doit être beaucoup plus grand. Un texte plus long donne un code plus dense : une adresse web courte vous permet donc d'imprimer plus petit.

Pour l'impression, l'export SVG est généralement le meilleur choix. C'est un fichier vectoriel, qui reste net à n'importe quelle taille. Si vous utilisez le PNG, exportez-le en grand format plutôt que d'agrandir une petite image après coup.

## Formes et décoration

Placer un code sur un cercle, un hexagone ou une étoile, ou ajouter une décoration autour, réduit la taille du code lui-même dans l'image pour que rien ne soit rogné. Exportez en plus grand pour compenser, et testez le scan.

## Testez avant d'imprimer

1. Scannez le fichier final à l'écran avec au moins deux téléphones différents.
2. Imprimez un exemplaire à la taille réelle et sur le support réel, puis scannez-le de nouveau sous l'éclairage où il sera utilisé.
3. Vérifiez que la page qui s'ouvre est bien celle que vous vouliez.

Universal QR vérifie au fil de la saisie qu'une adresse web est dans une forme utilisable, et demande discrètement si quelque chose y répond. Une coche verte signifie que quelque chose a répondu, pas qu'il s'agit de la bonne page : ouvrez donc toujours le lien vous-même aussi.`,
  },
  {
    id: 'scanning-safely',
    title: 'Scanner des codes en toute sécurité',
    summary: "Un QR code peut masquer la vraie destination d'un lien. Ce qu'il faut surveiller.",
    group: 'Confidentialité et sécurité',
    body: `Un QR code n'est qu'un lien que l'on ne peut pas lire à l'œil nu. Cette commodité est aussi sa faiblesse : impossible de savoir où mène un code avant de l'avoir scanné. La plupart des codes sont exactement ce qu'ils paraissent être, mais des criminels s'en servent parfois, par exemple en collant un faux code sur un vrai sur un horodateur ou une table de restaurant, ou en en envoyant un par e-mail ou par courrier.

## Les bons réflexes

- **Lisez l'adresse avant de l'ouvrir.** Regardez l'adresse web que votre téléphone vous affiche. Le nom correspond-il à l'organisme attendu ? Méfiez-vous des fautes d'orthographe, des mots en trop ou des terminaisons inhabituelles.
- **Méfiez-vous des autocollants.** Sur tout support public, vérifiez que le code est imprimé sur le panneau lui-même et non collé par-dessus.
- **Prenez le temps de réfléchir quand on vous demande de payer ou de vous connecter.** Un code qui vous mène directement à une page de paiement ou à un écran de connexion mérite une attention particulière. En cas de doute, tapez vous-même l'adresse de l'organisme ou utilisez son application officielle.
- **N'installez pas d'application depuis un code** à moins d'être sûr de la source. Passez par la boutique d'applications officielle de votre téléphone.
- **Les codes reçus par e-mail ou par courrier** méritent la même méfiance que les liens reçus par e-mail ou par courrier.

## Comment l'onglet Scanner vous aide

Quand vous scannez un code avec Universal QR, rien ne s'ouvre automatiquement. L'application vous montre le texte complet du code, son type et un bouton Copier. Si le texte est une adresse web, un bouton Ouvrir le lien apparaît, et rien ne se passe tant que vous ne l'avez pas touché. Vous avez ainsi le temps de lire l'adresse d'abord.

Le scan lui-même se fait sur votre appareil. L'image de l'appareil photo est décodée dans l'application et n'est jamais envoyée en ligne. L'appareil photo s'arrête dès qu'un code est trouvé ou quand vous quittez l'onglet Scanner.

## Si vous pensez avoir scanné un code malveillant

Si vous avez saisi des informations sur une page dont vous doutez à présent, changez le mot de passe que vous y avez utilisé et, s'il s'agissait de coordonnées bancaires ou de carte, contactez votre banque sans attendre. Vous pouvez signaler les codes et messages suspects à la police ou au service officiel de signalement des fraudes de votre pays.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'Ce qui quitte votre appareil',
    summary: "Ce qui reste sur votre appareil, ce qui passe en ligne, et à quel moment.",
    group: 'Confidentialité et sécurité',
    body: `Universal QR est conçu pour faire son travail sur votre appareil. Voici exactement ce qui y reste et ce qui n'y reste pas.

## Ce qui reste sur votre appareil

- **La conception et l'export des codes.** Les images des QR codes et des codes-barres sont dessinées dans l'application. Votre texte, vos couleurs et le logo éventuel que vous ajoutez ne sont pas envoyés en ligne.
- **Votre création en cours** est mémorisée dans le stockage de l'application sur cet appareil, pour que vous la retrouviez la prochaine fois.
- **Enregistrer sur cet appareil** conserve une petite galerie de créations dans ce même stockage local. Aucun compte n'est nécessaire. Effacer les données de l'application, ou les données de site de votre navigateur, la supprime.
- **Le scan.** L'image de l'appareil photo est décodée sur votre appareil et n'est jamais envoyée en ligne.

## Une vérification automatique

Quand vous saisissez une adresse web commençant par https, l'application demande à votre propre appareil de contacter cette adresse pour voir si quelque chose répond. Cette requête va directement de votre appareil à ce site web, sans passer par UNI·SIM, et nous n'en enregistrons rien. Le site que vous avez saisi verra une requête ordinaire provenant de votre connexion, comme si vous le visitiez.

## Uniquement si vous le choisissez

- **Enregistrer un code dans votre compte.** Sauvegarder ce QR code permet d'en stocker une copie en ligne, associée à votre Universal ID. Ce qui est envoyé, c'est l'image du code et ses réglages de conception, y compris le logo éventuel que vous avez ajouté. Ils sont conservés dans un stockage privé que seuls vous, et les autres membres de votre organisation si vous en faites partie, pouvez ouvrir une fois connectés. Ce stockage est chiffré pendant le transfert et au repos, mais il s'agit d'un stockage cloud ordinaire et non d'un chiffrement de bout en bout : c'est nous qui détenons les clés. Supprimer une sauvegarde l'efface.
- **Les codes dynamiques.** L'adresse de destination, le nom que vous donnez au code et sa conception sont enregistrés sur notre serveur, car c'est ce qui permet de modifier un code dynamique après impression.

## Ce qu'un code dynamique enregistre lorsqu'il est scanné

Chaque scan d'un code dynamique ajoute un enregistrement comprenant :

- la date et l'heure
- le pays d'où provient le scan, tel qu'indiqué par le réseau
- le nom du site web qui y a mené, le cas échéant, sans le reste de l'adresse

Aucune adresse IP, aucune information sur l'appareil et aucune donnée personnelle concernant la personne qui scanne ne sont conservées. La personne qui scanne n'a besoin ni d'un compte ni d'une application. Quand vous supprimez un code dynamique, ses enregistrements de scans sont supprimés avec lui.

Lorsque notre serveur redirige le téléphone vers votre destination, il demande au navigateur de ne pas indiquer à ce site qu'il est passé par le lien court.

## Ce que chaque application Universal envoie

Pendant que l'application est ouverte, elle envoie à notre serveur un petit signal indiquant qu'elle est utilisée, afin que le menu puisse afficher combien de personnes l'utilisent. Ce signal contient le nom de l'application, le type d'appareil (web, téléphone ou ordinateur), un identifiant aléatoire créé sur cet appareil et, si vous êtes connecté, votre compte. Si vous êtes connecté, l'application enregistre aussi que vous l'avez ouverte, pour la page d'activité de votre compte. Ni l'un ni l'autre ne contient quoi que ce soit sur les codes que vous créez ou scannez. Il n'y a aucun outil d'analyse ni aucune publicité tiers.

## Les codes statiques sont privés par nature

Un code créé dans l'onglet QR contient directement votre destination. Le scanner ne passe jamais par UNI·SIM : nous n'avons donc rien à voir ni à compter.`,
  },
]

export default articles
