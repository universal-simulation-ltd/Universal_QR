import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: 'O que é, afinal, um código QR?',
    summary: 'Uma grelha de quadrados que guarda texto, e como uma câmara o volta a ler.',
    group: 'O essencial',
    body: `Um código QR é uma forma de escrever um pequeno texto como um padrão de quadrados escuros e claros que uma câmara consegue ler de forma rápida e fiável. QR significa Quick Response (resposta rápida). O formato foi inventado no Japão em 1994 pela Denso Wave para seguir peças de automóveis nas fábricas, e é hoje uma norma internacional aberta que qualquer pessoa pode usar sem pagar licença.

## O que tem lá dentro

Todos os códigos guardam texto. Normalmente esse texto é um endereço web, mas pode ser qualquer coisa: uma frase, um número de telefone, os dados necessários para aceder a uma rede Wi-Fi ou um cartão de contacto. É o telemóvel que lê o código que decide o que fazer com o texto. Se parecer um endereço web, propõe abri-lo. Se parecer dados de Wi-Fi, propõe ligar-se à rede.

O código não contém uma página web, uma imagem nem um ficheiro. Contém apenas as palavras. Um código com um endereço web é, na verdade, apenas uma forma muito compacta de escrever esse endereço por alguém.

## As partes de um código

- **Os módulos** são os pequenos quadrados. Cada um é uma única unidade de dados, escura ou clara.
- **Os padrões de localização** são os três quadrados grandes nos cantos. Indicam ao leitor onde está o código, qual é a sua orientação e que tamanho tem. O leitor tem de encontrar os três antes de conseguir ler o resto.
- **Os padrões de temporização e de alinhamento** são marcas regulares mais pequenas que ajudam o leitor a reconstituir a grelha, mesmo que o código seja fotografado de lado ou impresso numa superfície curva.
- **A zona de silêncio** é a margem vazia à volta do código. Separa o código daquilo que estiver ao lado.

## Porque é que alguns códigos são mais densos do que outros

Os códigos QR existem em 40 tamanhos, chamados versões. O mais pequeno tem 21 por 21 módulos e o maior tem 177 por 177. Quanto mais texto colocar, mais módulos são necessários, pelo que um endereço web longo dá um código mais carregado do que um curto. Os códigos mais carregados têm de ser impressos maiores para serem bem lidos, o que é uma das razões pelas quais vale a pena usar endereços curtos sempre que possível.`,
  },
  {
    id: 'error-correction',
    title: 'Correção de erros, e porque é que um logótipo ao centro continua a ser lido',
    summary: 'Como um código sobrevive a manchas, riscos e a uma imagem por cima.',
    group: 'O essencial',
    body: `Um código QR não guarda o seu texto apenas uma vez. Guarda também dados de recuperação adicionais, calculados com um método matemático chamado correção de erros Reed–Solomon. A mesma ideia é usada nos CD e nos dados enviados por sondas espaciais. Se alguns quadrados faltarem ou não puderem ser lidos, o leitor pode usar os dados de recuperação para reconstruir o que se perdeu.

## Os quatro níveis

A norma QR oferece quatro níveis de correção de erros. Cada um define, aproximadamente, que parte do código pode estar danificada sem que deixe de ser lido:

- **L** (baixo): cerca de 7%
- **M** (médio): cerca de 15%
- **Q** (quartil): cerca de 25%
- **H** (alto): cerca de 30%

Os níveis mais altos precisam de mais espaço para os dados de recuperação, pelo que, para o mesmo texto, o código fica mais denso.

## Porque é que um logótipo funciona

Colocar um logótipo no centro de um código tapa alguns dos seus quadrados. Para o leitor, isso é exatamente igual a um dano. Desde que a área tapada fique bem dentro do que a correção de erros consegue recuperar, o código continua a ser lido.

É por isso que o Universal QR usa sempre o nível **H**, o mais alto. Por predefinição, todos os códigos têm uma pequena marca ao centro, e muitas pessoas acrescentam o seu próprio logótipo, por isso o código precisa de toda a margem possível. Quando é adicionado um logótipo, a aplicação normalmente limpa os quadrados por trás dele em vez de desenhar o logótipo por cima de um padrão meio escondido, o que dá ao leitor uma imagem mais limpa.

## Os limites

A correção de erros é uma margem de segurança, não uma autorização para tapar o que quer que seja. Há algumas coisas que não consegue resolver:

- **Os padrões de localização.** Se os três quadrados grandes dos cantos estiverem tapados ou deformados, o leitor pode nem sequer encontrar o código.
- **Um logótipo muito grande.** Os danos causados pelo logótipo e os danos causados pelo desgaste, por reflexos ou por uma má impressão saem todos da mesma margem.
- **Pouco contraste.** A correção de erros repara quadrados em falta, mas não ajuda se o leitor não conseguir, à partida, distinguir o escuro do claro.

Por isso, o conselho prático mantém-se: use um logótipo discreto e teste sempre o código final com um ou dois telemóveis antes de imprimir uma grande quantidade.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'Códigos QR e códigos de barras: qual é a diferença?',
    summary: 'Porque é que o supermercado ainda usa riscas, e que tipo de código de barras escolher.',
    group: 'O essencial',
    body: `Um código de barras tradicional é uma fila de riscas verticais. A informação está na largura das barras e dos espaços entre elas, lida da esquerda para a direita. Como usa apenas uma direção, é muitas vezes chamado código de barras unidimensional ou 1D. Um código QR guarda informação nas duas direções ao mesmo tempo, na horizontal e na vertical, e é por isso que se chama código bidimensional.

## O que isso significa na prática

- **Capacidade.** Um código de barras 1D guarda normalmente um número curto ou poucos caracteres. Um código QR pode guardar um endereço web completo ou um parágrafo de texto.
- **Leitores.** Os códigos de barras 1D foram feitos para serem lidos por leitores laser simples e rápidos, numa caixa ou num armazém. Os códigos QR foram concebidos para serem lidos por câmaras, incluindo a de um telemóvel.
- **Danos.** Os códigos QR têm correção de erros incorporada. A maioria dos códigos de barras 1D tem, no máximo, um único dígito de controlo, que consegue detetar uma leitura errada mas não a consegue reparar.

## Os tipos de código de barras no Universal QR

O Universal QR também consegue criar códigos de barras 1D. Em Avançado, mude Tipo para Código de barras e escolha o tipo em Conteúdo:

- **Code 128** guarda qualquer texto e é a escolha para uso geral.
- **EAN-13** é o código de barras de retalho padrão na Europa e em grande parte do mundo.
- **UPC-A** é o código de barras de retalho padrão nos Estados Unidos e no Canadá.
- **Code 39** é um formato mais antigo, ainda comum em etiquetas de inventário e na indústria.
- **ITF-14** é usado nas caixas exteriores de expedição.

## Dígitos de controlo

EAN-13, UPC-A e ITF-14 terminam num dígito de controlo, calculado a partir dos outros dígitos. Se escrever o número com um dígito a menos, a aplicação calcula o dígito de controlo por si. Se escrever o número completo, a aplicação verifica se o último dígito está correto.

## Uma nota sobre números de retalho

Um gerador de códigos de barras desenha as riscas para qualquer número que lhe dê. Não lhe dá o direito de usar esse número. Para vender na maioria das lojas, os números dos produtos são normalmente atribuídos pela GS1, a organização que os gere. Se vende produtos, confirme o que o seu retalhista exige antes de imprimir embalagens.

## Porque é que a aplicação mantém os códigos de barras simples

No Universal QR, os códigos de barras não têm logótipo, cores nem decoração. Um código 1D tem muitas vezes de ser lido por um leitor básico, e qualquer coisa que torne difusas as margens das barras pode impedir a leitura.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Códigos estáticos e dinâmicos',
    summary: 'O que muda o separador Dinâmico, e quando vale a pena usá-lo.',
    group: 'Como funciona',
    body: `O Universal QR consegue criar dois tipos de código QR, e funcionam de formas diferentes.

## Códigos estáticos

Um código criado no separador Criar é estático. O seu endereço web, ou o texto que tiver escrito, fica gravado diretamente no padrão de quadrados. Quando alguém o lê, o telemóvel lê o endereço a partir do código e vai diretamente para lá. Não há nada pelo meio.

Isso tem algumas vantagens claras:

- Funciona enquanto o destino existir. Nenhum serviço tem de continuar a funcionar para que o código continue a funcionar.
- Ninguém consegue ver quem o leu nem quando, incluindo nós.
- É gratuito, não precisa de conta e é criado inteiramente no seu dispositivo.

A única desvantagem é que não o pode alterar. Se o endereço mudar, precisa de criar e imprimir um novo código.

## Códigos dinâmicos

Um código criado no separador Dinâmico não contém o seu destino. Em vez disso, contém uma ligação curta no site da UNI·SIM. Quando alguém lê o código, o telemóvel visita essa ligação curta, o nosso servidor procura para onde o código deve apontar nesse momento, conta a leitura e encaminha o telemóvel para o seu destino.

Como o destino está guardado no nosso servidor e não no padrão impresso, pode alterá-lo sempre que quiser, e todas as cópias do código já impressas acompanham a alteração. O separador Dinâmico mostra também quantas vezes cada código foi lido, quando foi lido pela última vez e um gráfico dos últimos 30 dias.

As contrapartidas:

- **Tem de iniciar sessão** com o seu Universal ID. Os códigos dinâmicos são gratuitos com o seu Universal ID, e as contas gratuitas têm um limite generoso. Se algum dia o atingir, elimine um código de que já não precisa para libertar espaço.
- **Depende do serviço.** Se um código dinâmico for eliminado, quem o ler vê uma página a informar que o código já não está ativo, em vez do seu destino.
- **Cada leitura é registada.** Consulte o artigo sobre o que sai do seu dispositivo para saber exatamente o que é guardado.

## Qual deve escolher?

Use um código estático quando o destino não vai mudar, como o seu site principal ou uma rede Wi-Fi. Use um código dinâmico quando estiver a imprimir algo que vai durar mais do que a página para onde aponta, como um cartaz para um menu ou evento que muda, ou quando quiser saber quantas vezes está a ser lido.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Criar um código que é sempre lido',
    summary: 'Zona de silêncio, contraste, tamanho e testes antes de imprimir.',
    group: 'Como funciona',
    body: `Um código QR com bom aspeto mas que não é lido é pior do que não ter código nenhum. A maioria das falhas deve-se a meia dúzia de causas evitáveis.

## Não mexa na zona de silêncio

A margem vazia à volta de um código indica ao leitor onde o código termina. A norma QR pede uma margem com quatro módulos de largura. Se recortar a imagem muito justa, ou a colocar encostada a texto ou a uma fotografia carregada, alguns leitores terão dificuldade. Deixe espaço livre à volta do código na página, e não apenas na imagem.

## Escuro sobre claro

Os leitores esperam quadrados escuros sobre um fundo claro. Alguns telemóveis conseguem ler um código claro sobre fundo escuro, mas muitos leitores não. Um contraste forte importa mais do que as cores exatas: azul-marinho escuro sobre creme serve, cinzento médio sobre um cinzento ligeiramente mais claro não serve.

O Universal QR avisa-o se as suas cores produzirem um código invertido ou se o contraste for demasiado fraco, incluindo nos três quadrados dos cantos, que o leitor tem de encontrar primeiro.

## Faça-o suficientemente grande

Uma regra prática comum é que um código pode ser lido a cerca de dez vezes a sua própria largura. Um código com 2 cm de largura funciona à distância de um braço; um código num cartaz do outro lado de uma sala tem de ser muito maior. Um texto mais longo dá um código mais denso, por isso um endereço web curto permite imprimir mais pequeno.

Para impressão, a exportação em SVG é normalmente a melhor opção. É um ficheiro vetorial, por isso mantém-se nítido em qualquer tamanho. Se usar PNG, exporte num tamanho grande em vez de ampliar mais tarde uma imagem pequena.

## Formas e decoração

Colocar um código dentro de um círculo, hexágono ou estrela, ou acrescentar decoração à volta, torna o próprio código mais pequeno dentro da imagem para que nada fique cortado. Exporte num tamanho maior para compensar e teste a leitura.

## Teste antes de imprimir

1. Leia o ficheiro final no ecrã com pelo menos dois telemóveis diferentes.
2. Imprima uma cópia no tamanho real e no material real e volte a lê-la com a iluminação do local onde vai ser usada.
3. Confirme que a página que abre é a que pretendia.

O Universal QR verifica, à medida que escreve, se um endereço web tem um formato utilizável e pergunta discretamente se alguma coisa responde nesse endereço. Um visto verde significa que algo respondeu, não que seja a página certa, por isso abra sempre também a ligação pessoalmente.`,
  },
  {
    id: 'scanning-safely',
    title: 'Ler códigos em segurança',
    summary: 'Um código QR pode esconder para onde uma ligação vai realmente. Em que reparar.',
    group: 'Privacidade e segurança',
    body: `Um código QR é apenas uma ligação que não consegue ler a olho nu. Essa comodidade é também o seu ponto fraco: não consegue saber para onde um código vai até o ler. A maioria dos códigos é exatamente o que parece, mas por vezes há criminosos que os usam, por exemplo colando um código falso por cima de um verdadeiro num parquímetro ou numa mesa de restaurante, ou enviando um por email ou por carta.

## Bons hábitos

- **Leia o endereço antes de o abrir.** Veja o endereço web que o telemóvel lhe mostra. O nome corresponde a quem espera? Esteja atento a erros ortográficos, palavras a mais ou terminações invulgares.
- **Desconfie de autocolantes.** Em qualquer coisa pública, confirme que o código está impresso como parte do letreiro e não colado por cima.
- **Pare quando lhe pedirem para pagar ou iniciar sessão.** Um código que o leva diretamente a uma página de pagamento ou a um ecrã de início de sessão merece cuidado redobrado. Em caso de dúvida, escreva pessoalmente o endereço da organização ou use a aplicação oficial dela.
- **Não instale aplicações a partir de um código** a menos que tenha a certeza da origem. Use a loja de aplicações oficial do seu telemóvel.
- **Os códigos em emails e cartas** merecem a mesma desconfiança que as ligações em emails e cartas.

## Como o separador Ler ajuda

Quando lê um código com o Universal QR, a aplicação não abre nada automaticamente. Mostra-lhe o texto completo do código, o tipo de código e um botão Copiar. Se o texto for um endereço web, aparece um botão Abrir ligação, e nada acontece até o premir. Isso dá-lhe um momento para ler primeiro o endereço.

A leitura em si acontece no seu dispositivo. A imagem da câmara é descodificada na aplicação e nunca é carregada. A câmara para assim que é encontrado um código ou quando sai do separador Ler.

## Se achar que leu um código malicioso

Se introduziu dados numa página de que agora desconfia, altere a palavra-passe que usou nela e, se se tratar de dados de cartão ou bancários, contacte imediatamente o seu banco. Pode comunicar códigos e mensagens suspeitos às autoridades policiais ou ao serviço oficial de denúncia de fraudes do seu país.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'O que sai do seu dispositivo',
    summary: 'O que fica no seu dispositivo, o que vai para a internet, e quando.',
    group: 'Privacidade e segurança',
    body: `O Universal QR foi feito para trabalhar no seu dispositivo. Eis exatamente o que fica nele e o que não fica.

## Fica no seu dispositivo

- **Criar e exportar códigos.** As imagens dos códigos QR e dos códigos de barras são desenhadas na aplicação. O seu texto, as suas cores e qualquer logótipo que adicione não são carregados.
- **O seu design atual** fica guardado no armazenamento da aplicação neste dispositivo, para que continue lá da próxima vez.
- **Guardar neste dispositivo** mantém uma pequena galeria de designs no mesmo armazenamento local. Não precisa de conta. Limpar os dados da aplicação, ou os dados do site no seu navegador, apaga-a.
- **Leitura.** A imagem da câmara é descodificada no seu dispositivo e nunca é carregada.

## Uma verificação automática

Quando escreve um endereço web que começa por https, a aplicação pede ao seu próprio dispositivo que contacte esse endereço para ver se alguma coisa responde. Isto vai diretamente do seu dispositivo para esse site, sem passar pela UNI·SIM, e nada sobre isso é registado por nós. O site que escreveu verá um pedido normal a partir da sua ligação, tal como aconteceria se o visitasse.

## Só quando escolher

- **Guardar um código na sua conta.** Fazer cópia de segurança deste código QR pode guardar uma cópia online associada ao seu Universal ID. O que é carregado é a imagem do código e as respetivas definições de design, incluindo qualquer logótipo que tenha adicionado. Ficam guardados num armazenamento privado que só o utilizador e, se pertencer a uma organização, os outros membros dessa organização podem abrir com sessão iniciada. São encriptados em trânsito e em repouso, mas trata-se de armazenamento na nuvem comum e não de encriptação ponto a ponto, pelo que somos nós que detemos as chaves. Eliminar uma cópia de segurança apaga-a.
- **Códigos dinâmicos.** O endereço de destino, o nome que dá ao código e o seu design ficam guardados no nosso servidor, porque é isso que permite alterar um código dinâmico depois de impresso.

## O que um código dinâmico regista quando é lido

Cada leitura de um código dinâmico acrescenta um registo com:

- a data e a hora
- o país de onde veio a leitura, tal como indicado pela rede
- o nome do site que tinha a ligação para ele, se existir, sem o resto do endereço

Não é guardado nenhum endereço IP, dados do dispositivo nem informação pessoal sobre a pessoa que lê o código. Quem lê o código não precisa de conta nem de nenhuma aplicação. Quando elimina um código dinâmico, os respetivos registos de leitura são eliminados com ele.

Quando o nosso servidor encaminha o telemóvel para o seu destino, pede ao navegador que não diga a esse site que chegou através da ligação curta.

## O que todas as aplicações Universal enviam

Enquanto a aplicação está aberta, envia ao nosso servidor um pequeno sinal de que está a ser usada, para que o menu possa mostrar quantas pessoas a usam. Esse sinal contém o nome da aplicação, o tipo de dispositivo (web, telemóvel ou computador), um ID aleatório criado neste dispositivo e, se tiver sessão iniciada, a sua conta. Se tiver sessão iniciada, a aplicação regista também que a abriu, para a página de atividade da sua conta. Nenhum dos dois inclui qualquer informação sobre os códigos que cria ou lê. Não há análises de terceiros nem publicidade.

## Os códigos estáticos são privados por natureza

Um código criado no separador Criar contém diretamente o seu destino. Lê-lo nunca passa pela UNI·SIM, por isso não há nada que possamos ver ou contar.`,
  },
]

export default articles
