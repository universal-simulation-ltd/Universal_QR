import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: "O que é, afinal, um QR code?",
    summary: "Uma grade de quadradinhos que guarda texto, e como uma câmera o lê de volta.",
    group: "O básico",
    body: `Um QR code é uma forma de escrever um pequeno trecho de texto como um padrão de quadrados escuros e claros que uma câmera consegue ler de forma rápida e confiável. QR significa Quick Response, ou resposta rápida. O formato foi criado no Japão em 1994 pela Denso Wave para rastrear peças de automóveis nas fábricas, e hoje é um padrão internacional aberto que qualquer pessoa pode usar sem pagar licença.

## O que há dentro

Todo código guarda texto. Normalmente esse texto é um endereço da web, mas pode ser qualquer coisa: uma frase, um número de telefone, os dados necessários para entrar em uma rede Wi-Fi ou um cartão de contato. O celular que lê o código decide o que fazer com o texto. Se parecer um endereço da web, ele oferece abrir. Se parecer dados de Wi-Fi, ele oferece conectar à rede.

O código não contém uma página da web, uma imagem nem um arquivo. Ele contém apenas as palavras. Um código com um endereço da web é, na verdade, só uma forma bem compacta de digitar esse endereço para alguém.

## As partes de um código

- **Módulos** são os quadradinhos. Cada um é uma única unidade de dados, escura ou clara.
- **Padrões de localização** são os três quadrados grandes nos cantos. Eles mostram ao leitor onde o código está, em que posição ele está e qual é o seu tamanho. O leitor precisa encontrar os três antes de conseguir ler qualquer outra coisa.
- **Padrões de sincronização e de alinhamento** são marcas regulares menores que ajudam o leitor a identificar a grade, mesmo que o código seja fotografado de lado ou impresso em uma superfície curva.
- **A zona de silêncio** é a margem vazia em volta do código. Ela separa o código do que estiver ao lado.

## Por que alguns códigos são mais densos que outros

Os QR codes existem em 40 tamanhos, chamados versões. O menor tem 21 por 21 módulos e o maior, 177 por 177. Quanto mais texto você coloca, mais módulos são necessários, então um endereço da web longo gera um código mais carregado do que um curto. Códigos mais carregados precisam ser impressos maiores para serem lidos bem, e esse é um dos motivos pelos quais vale a pena usar endereços curtos sempre que possível.`,
  },
  {
    id: 'error-correction',
    title: "Correção de erros, e por que um logotipo no meio ainda funciona",
    summary: "Como um código resiste a manchas, arranhões e a uma imagem por cima.",
    group: "O básico",
    body: `Um QR code não guarda seu texto apenas uma vez. Ele também guarda dados extras de recuperação, calculados com um método matemático chamado correção de erros Reed–Solomon. A mesma ideia é usada em CDs e nos dados enviados por sondas espaciais. Se alguns dos quadrados estiverem faltando ou ilegíveis, o leitor pode usar os dados de recuperação para reconstruir o que se perdeu.

## Os quatro níveis

O padrão QR oferece quatro níveis de correção de erros. Cada um define, aproximadamente, quanto do código pode estar danificado sem que ele deixe de ser lido:

- **L** (baixo): cerca de 7%
- **M** (médio): cerca de 15%
- **Q** (quartil): cerca de 25%
- **H** (alto): cerca de 30%

Níveis mais altos precisam de mais espaço para os dados de recuperação, então, para o mesmo texto, o código fica mais denso.

## Por que um logotipo funciona

Colocar um logotipo no centro de um código cobre alguns dos seus quadrados. Para o leitor, isso parece exatamente um dano. Desde que a área coberta fique bem dentro do que a correção de erros consegue recuperar, o código continua sendo lido.

Por esse motivo, o Universal QR sempre usa o nível **H**, o mais alto. Por padrão, todo código leva uma pequena marca no meio, e muita gente adiciona o próprio logotipo, então o código precisa da maior folga possível. Quando um logotipo é adicionado, o app normalmente limpa os quadrados atrás dele em vez de desenhar o logotipo por cima de um padrão meio escondido, o que dá ao leitor uma imagem mais limpa para trabalhar.

## Os limites

A correção de erros é uma margem de segurança, não uma permissão para cobrir qualquer coisa. Algumas coisas ela não consegue resolver:

- **Os padrões de localização.** Se os três quadrados grandes dos cantos estiverem cobertos ou distorcidos, o leitor pode nem encontrar o código.
- **Um logotipo muito grande.** O dano causado pelo logotipo e o dano causado por desgaste, reflexo ou impressão ruim saem todos da mesma reserva.
- **Contraste fraco.** A correção de erros repara quadrados faltando, mas não ajuda se o leitor não conseguir distinguir o escuro do claro.

Então a recomendação prática continua a mesma: mantenha o logotipo discreto e sempre teste o código final com um ou dois celulares antes de imprimir uma tiragem grande.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: "QR codes e códigos de barras: qual é a diferença?",
    summary: "Por que o supermercado ainda usa listras, e qual tipo de código de barras escolher.",
    group: "O básico",
    body: `Um código de barras tradicional é uma fileira de listras verticais. A informação está na largura das barras e dos espaços entre elas, lida da esquerda para a direita. Como usa apenas uma direção, ele costuma ser chamado de código de barras unidimensional, ou 1D. Um QR code guarda informação nas duas direções ao mesmo tempo, na horizontal e na vertical, e é por isso que é chamado de código bidimensional.

## O que isso significa na prática

- **Capacidade.** Um código de barras 1D normalmente guarda um número curto ou alguns caracteres. Um QR code pode guardar um endereço da web inteiro ou um parágrafo de texto.
- **Leitores.** Os códigos de barras 1D são feitos para serem lidos por leitores a laser simples e rápidos, no caixa ou em um depósito. Os QR codes são projetados para serem lidos por câmeras, incluindo a do celular.
- **Danos.** Os QR codes têm correção de erros embutida. A maioria dos códigos de barras 1D tem, no máximo, um único dígito verificador, que consegue detectar uma leitura errada, mas não consegue corrigi-la.

## Os tipos de código de barras no Universal QR

O Universal QR também cria códigos de barras 1D. Em Avançado, mude Tipo para Código de barras e escolha o tipo em Conteúdo:

- **Code 128** guarda qualquer texto e é a opção de uso geral.
- **EAN-13** é o código de barras padrão do varejo na Europa e em grande parte do mundo.
- **UPC-A** é o código de barras padrão do varejo nos Estados Unidos e no Canadá.
- **Code 39** é um formato mais antigo, ainda comum em etiquetas de patrimônio e na indústria.
- **ITF-14** é usado em caixas de embarque.

## Dígitos verificadores

EAN-13, UPC-A e ITF-14 terminam com um dígito verificador, calculado a partir dos outros dígitos. Se você digitar o número com um dígito a menos, o app calcula o dígito verificador para você. Se digitar o número completo, o app confere se o último dígito está correto.

## Uma observação sobre números de varejo

Um gerador de códigos de barras desenha as listras para qualquer número que você informar. Ele não lhe dá o direito de usar esse número. Para vender na maioria das lojas, os números de produto normalmente são emitidos pela GS1, a organização que os administra. Se você vende produtos, confira o que o seu varejista exige antes de imprimir as embalagens.

## Por que o app mantém os códigos de barras simples

Os códigos de barras no Universal QR não têm logotipo, cores nem enfeites. Um código 1D muitas vezes precisa ser lido por um leitor básico, e qualquer coisa que borre as bordas das barras pode impedir que ele funcione.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: "Códigos estáticos e dinâmicos",
    summary: "O que a aba Dinâmico muda, e quando vale a pena usá-la.",
    group: "Como funciona",
    body: `O Universal QR pode criar dois tipos de QR code, e eles funcionam de formas diferentes.

## Códigos estáticos

Um código criado na aba QR é estático. Seu endereço da web, ou qualquer texto que você digitou, é gravado diretamente no padrão de quadrados. Quando alguém o lê, o celular lê o endereço no próprio código e vai direto para lá. Não há nada no meio do caminho.

Isso tem algumas vantagens claras:

- Funciona enquanto o destino existir. Nenhum serviço precisa continuar no ar para o código seguir funcionando.
- Ninguém consegue ver quem leu o código nem quando, incluindo nós.
- É gratuito, não exige conta e é criado inteiramente no seu dispositivo.

A única desvantagem é que não dá para alterá-lo. Se o endereço mudar, você precisa criar e imprimir um novo código.

## Códigos dinâmicos

Um código criado na aba Dinâmico não contém o seu destino. Em vez disso, contém um link curto no site da UNI·SIM. Quando alguém lê o código, o celular acessa esse link curto, nosso servidor verifica para onde o código deve apontar no momento, conta a leitura e encaminha o celular para o seu destino.

Como o destino fica guardado no nosso servidor e não no padrão impresso, você pode alterá-lo quando quiser, e todas as cópias do código que já foram impressas acompanham a mudança. A aba Dinâmico também mostra quantas vezes cada código foi lido, quando foi lido pela última vez e um gráfico dos últimos 30 dias.

As contrapartidas:

- **Você precisa entrar** com o seu Universal ID. Os códigos dinâmicos são gratuitos com o seu Universal ID, e as contas gratuitas têm um limite generoso. Se um dia você atingi-lo, exclua um código de que não precisa mais para liberar espaço.
- **Depende do serviço.** Se um código dinâmico for excluído, quem o ler verá uma página dizendo que o código não está mais ativo, em vez do seu destino.
- **Cada leitura é registrada.** Veja o artigo sobre o que sai do seu dispositivo para saber exatamente o que é guardado.

## Qual escolher?

Use um código estático quando o destino não for mudar, como o seu site principal ou uma rede Wi-Fi. Use um código dinâmico quando for imprimir algo que vai durar mais do que a página para a qual aponta, como um cartaz de um cardápio ou evento que muda, ou quando quiser saber com que frequência ele está sendo lido.`,
  },
  {
    id: 'codes-that-scan',
    title: "Como criar um código que funciona sempre",
    summary: "Zona de silêncio, contraste, tamanho e testes antes de imprimir.",
    group: "Como funciona",
    body: `Um QR code bonito que não é lido é pior do que nenhum código. A maioria das falhas vem de um punhado de causas evitáveis.

## Não mexa na zona de silêncio

A margem vazia em volta de um código mostra ao leitor onde o código termina. O padrão QR pede uma margem de quatro módulos de largura. Se você recortar a imagem muito rente, ou colocá-la encostada em um texto ou em uma foto carregada, alguns leitores terão dificuldade. Deixe espaço livre em volta do código na página, e não só na imagem.

## Mantenha escuro sobre claro

Os leitores esperam quadrados escuros sobre um fundo claro. Alguns celulares conseguem ler um código claro sobre fundo escuro, mas muitos leitores não. Um contraste forte importa mais do que as cores exatas: azul-marinho escuro sobre creme funciona bem; cinza médio sobre um cinza um pouco mais claro, não.

O Universal QR avisa se as suas cores gerarem um código invertido ou se o contraste estiver fraco demais, inclusive nos três quadrados dos cantos, que o leitor precisa encontrar primeiro.

## Faça grande o suficiente

Uma regra prática comum é que um código pode ser lido a uma distância de cerca de dez vezes a sua própria largura. Um código de 2 cm de largura funciona à distância de um braço; um código em um cartaz do outro lado de uma sala precisa ser bem maior. Textos mais longos geram códigos mais densos, então um endereço da web curto permite imprimir menor.

Para impressão, a exportação em SVG costuma ser a melhor escolha. É um arquivo vetorial, então fica nítido em qualquer tamanho. Se usar PNG, exporte em um tamanho grande em vez de ampliar uma imagem pequena depois.

## Formatos e enfeites

Colocar um código em um círculo, hexágono ou estrela, ou adicionar enfeites em volta, deixa o código em si menor dentro da imagem, para que nada seja cortado. Exporte em um tamanho maior para compensar e teste a leitura.

## Teste antes de imprimir

1. Leia o arquivo final na tela com pelo menos dois celulares diferentes.
2. Imprima uma cópia no tamanho real e no material real, e leia de novo na iluminação do lugar onde ela será usada.
3. Confira se a página que abre é a que você queria.

O Universal QR verifica, enquanto você digita, se um endereço da web está em um formato utilizável e, discretamente, pergunta se há algo respondendo nele. Um sinal verde significa que algo respondeu, não que é a página certa, então sempre abra o link você mesmo também.`,
  },
  {
    id: 'scanning-safely',
    title: "Como ler códigos com segurança",
    summary: "Um QR code pode esconder para onde um link realmente leva. O que observar.",
    group: "Privacidade e segurança",
    body: `Um QR code é só um link que você não consegue ler a olho nu. Essa praticidade também é o seu ponto fraco: não dá para saber para onde um código leva até lê-lo. A maioria dos códigos é exatamente o que parece, mas criminosos às vezes os usam, por exemplo colando um código falso por cima de um verdadeiro em um parquímetro ou em uma mesa de restaurante, ou enviando um por e-mail ou carta.

## Bons hábitos

- **Leia o endereço antes de abri-lo.** Veja o endereço da web que o celular mostra. O nome corresponde a quem você espera? Fique atento a erros de ortografia, palavras a mais ou terminações incomuns.
- **Desconfie de adesivos.** Em qualquer coisa em local público, confira se o código está impresso como parte da placa e não colado por cima.
- **Pare para pensar quando pedirem pagamento ou login.** Um código que leva direto a uma página de pagamento ou a uma tela de login merece cuidado extra. Na dúvida, digite você mesmo o endereço da organização ou use o app oficial dela.
- **Não instale apps a partir de um código** a menos que tenha certeza da origem. Use a loja de apps oficial do seu celular.
- **Códigos em e-mails e cartas** merecem a mesma desconfiança que links em e-mails e cartas.

## Como a aba Ler ajuda

Quando você lê um código com o Universal QR, ele não abre nada automaticamente. Ele mostra o texto completo do código, que tipo de código é e um botão Copiar. Se o texto for um endereço da web, aparece um botão Abrir link, e nada acontece até você tocar nele. Isso lhe dá um momento para ler o endereço antes.

A leitura em si acontece no seu dispositivo. A imagem da câmera é decodificada no app e nunca é enviada. A câmera para assim que um código é encontrado ou quando você sai da aba Ler.

## Se você acha que leu um código malicioso

Se você informou dados em uma página da qual agora desconfia, troque a senha que usou lá e, se forem dados de cartão ou bancários, entre em contato com o seu banco imediatamente. Você pode denunciar códigos e mensagens suspeitos à polícia ou ao serviço oficial de denúncia de fraudes do seu país.`,
  },
  {
    id: 'what-leaves-your-device',
    title: "O que sai do seu dispositivo",
    summary: "O que fica no seu dispositivo, o que vai para a internet, e quando.",
    group: "Privacidade e segurança",
    body: `O Universal QR foi feito para trabalhar no seu dispositivo. Veja exatamente o que fica nele e o que não fica.

## Fica no seu dispositivo

- **Criar e exportar códigos.** As imagens de QR code e de código de barras são desenhadas no app. Seu texto, suas cores e qualquer logotipo que você adicionar não são enviados.
- **Seu design atual** fica guardado no armazenamento do app neste dispositivo, para que continue lá na próxima vez.
- **Salvar neste dispositivo** mantém uma pequena galeria de designs no mesmo armazenamento local. Não exige conta. Limpar os dados do app, ou os dados do site no navegador, apaga essa galeria.
- **Leitura.** A imagem da câmera é decodificada no seu dispositivo e nunca é enviada.

## Uma verificação automática

Quando você digita um endereço da web que começa com https, o app pede ao seu próprio dispositivo que acesse esse endereço para ver se há algo respondendo. Isso vai diretamente do seu dispositivo para esse site, sem passar pela UNI·SIM, e nada disso é registrado por nós. O site que você digitou verá uma solicitação comum vinda da sua conexão, como se você o tivesse visitado.

## Só quando você escolhe

- **Salvar um código na sua conta.** Fazer backup deste QR code pode guardar uma cópia na internet vinculada ao seu Universal ID. O que é enviado é a imagem do código e as configurações do design, incluindo qualquer logotipo que você tenha adicionado. Eles ficam em um armazenamento privado que só você, e outros membros da sua organização se você fizer parte de uma, podem abrir depois de entrar. É criptografado em trânsito e em repouso, mas é um armazenamento em nuvem comum, e não criptografia de ponta a ponta, então nós temos as chaves. Excluir um backup o remove.
- **Códigos dinâmicos.** O endereço de destino, o nome que você dá ao código e o design dele ficam guardados no nosso servidor, porque é assim que um código dinâmico pode ser alterado depois de impresso.

## O que um código dinâmico registra quando é lido

Cada leitura de um código dinâmico adiciona um registro com:

- a data e a hora
- o país de onde veio a leitura, conforme informado pela rede
- o nome do site que tinha um link para ele, se houver, sem o restante do endereço

Nenhum endereço IP, detalhe do dispositivo ou informação pessoal sobre quem fez a leitura é guardado. Quem faz a leitura não precisa de conta nem de nenhum app. Quando você exclui um código dinâmico, os registros de leitura dele são excluídos junto.

Quando nosso servidor encaminha o celular para o seu destino, ele pede ao navegador que não informe a esse site que o acesso veio pelo link curto.

## O que todo app Universal envia

Enquanto o app está aberto, ele envia ao nosso servidor um pequeno sinal de que está em uso, para que o menu possa mostrar quantas pessoas o usam. Esse sinal contém o nome do app, o tipo de dispositivo (web, celular ou computador), um ID aleatório criado neste dispositivo e, se você tiver entrado, a sua conta. Se você tiver entrado, o app também registra que você o abriu, para a página de atividade da sua conta. Nenhum dos dois inclui nada sobre os códigos que você cria ou lê. Não há análise de dados nem publicidade de terceiros.

## Códigos estáticos são privados por natureza

Um código criado na aba QR contém o seu destino diretamente. Lê-lo nunca passa pela UNI·SIM, então não há nada para vermos ou contarmos.`,
  },
]

export default articles
