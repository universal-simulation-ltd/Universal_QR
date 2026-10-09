import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'what-is-a-qr-code',
    title: '¿Qué es exactamente un código QR?',
    summary: 'Una cuadrícula de cuadrados que guarda texto, y cómo lo lee una cámara.',
    group: 'Conceptos básicos',
    body: `Un código QR es una forma de escribir un texto breve como un patrón de cuadrados oscuros y claros que una cámara puede leer de manera rápida y fiable. QR significa Quick Response (respuesta rápida). El formato lo inventó Denso Wave en Japón en 1994 para seguir piezas de automóvil en las fábricas, y hoy es un estándar internacional abierto que cualquiera puede usar sin pagar una licencia.

## Qué contiene

Todo código guarda texto. Normalmente ese texto es una dirección web, pero puede ser cualquier cosa: una frase, un número de teléfono, los datos necesarios para conectarse a una red Wi-Fi o una tarjeta de contacto. El teléfono que escanea el código decide qué hacer con el texto. Si parece una dirección web, ofrece abrirla. Si parece los datos de una red Wi-Fi, ofrece conectarse a ella.

El código no contiene una página web, una imagen ni un archivo. Solo contiene las palabras. Un código con una dirección web es, en realidad, una manera muy compacta de escribirle esa dirección a otra persona.

## Las partes de un código

- **Los módulos** son los cuadrados pequeños. Cada uno es una única unidad de datos, oscura o clara.
- **Los patrones de posición** son los tres cuadrados grandes de las esquinas. Indican al escáner dónde está el código, en qué orientación y de qué tamaño es. El escáner tiene que encontrar los tres antes de poder leer nada más.
- **Los patrones de sincronización y alineación** son marcas regulares más pequeñas que ayudan al escáner a reconstruir la cuadrícula, aunque el código se fotografíe en ángulo o esté impreso sobre una superficie curva.
- **La zona de silencio** es el margen vacío que rodea el código. Lo separa de lo que tenga al lado.

## Por qué algunos códigos son más densos que otros

Los códigos QR existen en 40 tamaños, llamados versiones. La más pequeña tiene 21 por 21 módulos y la más grande 177 por 177. Cuanto más texto incluya, más módulos hacen falta, así que una dirección web larga genera un código más cargado que una corta. Los códigos más cargados deben imprimirse más grandes para escanearse bien, y esa es una de las razones por las que conviene usar direcciones cortas siempre que se pueda.`,
  },
  {
    id: 'error-correction',
    title: 'La corrección de errores, y por qué se escanea aunque lleve un logotipo en el centro',
    summary: 'Cómo resiste un código a manchas, arañazos y una imagen encima.',
    group: 'Conceptos básicos',
    body: `Un código QR no guarda su texto una sola vez. También guarda datos adicionales de recuperación, calculados con un método matemático llamado corrección de errores Reed–Solomon. La misma idea se usa en los CD y en los datos que envían las sondas espaciales. Si faltan algunos cuadrados o no se pueden leer, el escáner puede usar los datos de recuperación para reconstruir lo que se ha perdido.

## Los cuatro niveles

El estándar QR ofrece cuatro niveles de corrección de errores. Cada uno fija, de forma aproximada, qué parte del código puede estar dañada sin que deje de leerse:

- **L** (bajo): alrededor del 7 %
- **M** (medio): alrededor del 15 %
- **Q** (cuartil): alrededor del 25 %
- **H** (alto): alrededor del 30 %

Los niveles más altos necesitan más espacio para los datos de recuperación, así que, con el mismo texto, el código resulta más denso.

## Por qué funciona un logotipo

Colocar un logotipo en el centro de un código tapa algunos de sus cuadrados. Para un escáner, eso es exactamente igual que un daño. Mientras la zona tapada quede bien dentro de lo que la corrección de errores puede recuperar, el código se sigue leyendo.

Por este motivo, Universal QR usa siempre el nivel **H**, el más alto. De forma predeterminada, cada código lleva una pequeña marca en el centro, y muchas personas añaden su propio logotipo, así que el código necesita tanta capacidad de reserva como sea posible. Cuando se añade un logotipo, la aplicación normalmente despeja los cuadrados que quedan detrás en lugar de dibujar el logotipo sobre un patrón medio oculto, lo que ofrece al escáner una imagen más limpia.

## Los límites

La corrección de errores es un margen de seguridad, no un permiso para tapar cualquier cosa. Hay algunas cosas que no puede arreglar:

- **Los patrones de posición.** Si los tres cuadrados grandes de las esquinas están tapados o deformados, es posible que el escáner ni siquiera encuentre el código.
- **Un logotipo muy grande.** El daño que causa el logotipo y el que causan el desgaste, los reflejos o una mala impresión salen todos del mismo margen.
- **Un contraste pobre.** La corrección de errores repara los cuadrados que faltan, pero no sirve de nada si el escáner no distingue lo oscuro de lo claro.

Así que el consejo práctico sigue siendo el mismo: use un logotipo discreto y pruebe siempre el código terminado con uno o dos teléfonos antes de imprimir una tirada grande.`,
  },
  {
    id: 'qr-codes-and-barcodes',
    title: 'Códigos QR y códigos de barras: ¿en qué se diferencian?',
    summary: 'Por qué un supermercado sigue usando rayas, y qué tipo de código de barras elegir.',
    group: 'Conceptos básicos',
    body: `Un código de barras tradicional es una fila de rayas verticales. La información está en el ancho de las barras y de los espacios entre ellas, y se lee de izquierda a derecha. Como solo usa una dirección, se suele llamar código de barras unidimensional o 1D. Un código QR guarda la información en las dos direcciones a la vez, a lo ancho y a lo alto, y por eso se le llama código bidimensional.

## Qué significa en la práctica

- **Capacidad.** Un código de barras 1D suele contener un número corto o unos pocos caracteres. Un código QR puede contener una dirección web completa o un párrafo de texto.
- **Lectores.** Los códigos de barras 1D están pensados para leerse con escáneres láser sencillos y rápidos en una caja o en un almacén. Los códigos QR están diseñados para leerse con cámaras, incluida la de un teléfono.
- **Daños.** Los códigos QR incorporan corrección de errores. La mayoría de los códigos de barras 1D tienen, como mucho, un único dígito de control que puede detectar una lectura errónea, pero no corregirla.

## Los tipos de código de barras de Universal QR

Universal QR también puede crear códigos de barras 1D. Active Avanzado, cambie Tipo a Código de barras y elija el tipo en Contenido:

- **Code 128** admite cualquier texto y es la opción de uso general.
- **EAN-13** es el código de barras comercial estándar en Europa y en buena parte del mundo.
- **UPC-A** es el código de barras comercial estándar en Estados Unidos y Canadá.
- **Code 39** es un formato más antiguo que sigue siendo habitual en etiquetas de inventario y en la industria.
- **ITF-14** se usa en las cajas exteriores de envío.

## Dígitos de control

EAN-13, UPC-A e ITF-14 terminan en un dígito de control, que se calcula a partir de los demás dígitos. Si escribe el número con un dígito de menos, la aplicación calcula el dígito de control por usted. Si escribe el número completo, la aplicación comprueba que el último dígito sea correcto.

## Una nota sobre los números comerciales

Un generador de códigos de barras dibuja las rayas de cualquier número que le indique. No le da derecho a usar ese número. Para vender en la mayoría de las tiendas, los números de producto los suele asignar GS1, la organización que los gestiona. Si vende productos, compruebe lo que necesita su distribuidor antes de imprimir los envases.

## Por qué la aplicación mantiene sencillos los códigos de barras

Los códigos de barras de Universal QR no llevan logotipo, colores ni decoración. A menudo un código 1D tiene que leerlo un escáner básico, y cualquier cosa que difumine los bordes de las barras puede impedir que funcione.`,
  },
  {
    id: 'static-and-dynamic-codes',
    title: 'Códigos estáticos y dinámicos',
    summary: 'Qué cambia la pestaña Dinámico, y cuándo merece la pena usarla.',
    group: 'Cómo funciona',
    body: `Universal QR puede crear dos tipos de código QR, y funcionan de maneras distintas.

## Códigos estáticos

Un código creado en la pestaña Diseñar es estático. Su dirección web, o el texto que haya escrito, se escribe directamente en el patrón de cuadrados. Cuando alguien lo escanea, su teléfono lee la dirección del código y va directamente a ella. No hay nada en medio.

Eso tiene algunas ventajas claras:

- Funciona mientras exista el destino. No hace falta que ningún servicio siga en marcha para que el código siga funcionando.
- Nadie puede ver quién lo escaneó ni cuándo, tampoco nosotros.
- Es gratuito, no necesita cuenta y se crea por completo en su dispositivo.

El único inconveniente es que no se puede cambiar. Si la dirección cambia, tendrá que crear e imprimir un código nuevo.

## Códigos dinámicos

Un código creado en la pestaña Dinámico no contiene su destino. En su lugar, contiene un enlace corto del sitio web de UNI·SIM. Cuando alguien escanea el código, su teléfono visita ese enlace corto, nuestro servidor busca a dónde debe apuntar el código en ese momento, cuenta el escaneo y envía el teléfono a su destino.

Como el destino se guarda en nuestro servidor y no en el patrón impreso, puede cambiarlo cuando quiera y todas las copias del código que ya estén impresas lo seguirán. La pestaña Dinámico también muestra cuántas veces se ha escaneado cada código, cuándo se escaneó por última vez y un gráfico de los últimos 30 días.

Las contrapartidas:

- **Tiene que iniciar sesión** con su Universal ID. Los códigos dinámicos son gratuitos con su Universal ID, y las cuentas gratuitas tienen un límite generoso. Si alguna vez lo alcanza, elimine un código que ya no necesite para hacer sitio.
- **Depende del servicio.** Si se elimina un código dinámico, quien lo escanee verá una página que indica que el código ya no está activo, en lugar de su destino.
- **Cada escaneo queda registrado.** Consulte el artículo sobre lo que sale de su dispositivo para saber exactamente qué se guarda.

## ¿Cuál conviene elegir?

Use un código estático cuando el destino no vaya a cambiar, como su sitio web principal o una red Wi-Fi. Use un código dinámico cuando imprima algo que vaya a durar más que la página a la que apunta, como un cartel para un menú o un evento que cambia, o cuando quiera saber con qué frecuencia se escanea.`,
  },
  {
    id: 'codes-that-scan',
    title: 'Cómo crear un código que se escanee siempre',
    summary: 'Zona de silencio, contraste, tamaño y pruebas antes de imprimir.',
    group: 'Cómo funciona',
    body: `Un código QR que queda bien pero no se escanea es peor que no tener código. La mayoría de los fallos se deben a unas pocas causas evitables.

## Respete la zona de silencio

El margen vacío que rodea un código indica al escáner dónde termina el código. El estándar QR pide un margen de cuatro módulos de ancho. Si recorta mucho la imagen, o la coloca pegada a un texto o a una foto recargada, algunos escáneres tendrán problemas. Deje espacio libre alrededor del código en la página, no solo en la imagen.

## Oscuro sobre claro

Los escáneres esperan cuadrados oscuros sobre un fondo claro. Algunos teléfonos se las arreglan con un código claro sobre fondo oscuro, pero muchos lectores no. Un contraste fuerte importa más que los colores exactos: un azul marino sobre crema está bien; un gris medio sobre un gris un poco más claro, no.

Universal QR le avisa si sus colores generan un código invertido o si el contraste es demasiado escaso, también en los tres cuadrados de las esquinas, que son lo primero que el escáner tiene que encontrar.

## Hágalo lo bastante grande

Una regla práctica habitual es que un código se puede escanear desde unas diez veces su propio ancho. Un código de 2 cm de ancho funciona a la distancia de un brazo; un código en un cartel al otro lado de una sala tiene que ser mucho más grande. Un texto más largo genera un código más denso, así que una dirección web corta le permite imprimirlo más pequeño.

Para imprimir, la exportación en SVG suele ser la mejor opción. Es un archivo vectorial, así que se mantiene nítido a cualquier tamaño. Si usa PNG, exporte a un tamaño grande en lugar de ampliar después una imagen pequeña.

## Formas y decoración

Colocar un código sobre un círculo, un hexágono o una estrella, o añadirle decoración alrededor, hace que el propio código ocupe menos dentro de la imagen para que no se recorte nada. Exporte a un tamaño mayor para compensarlo y compruebe que se escanea.

## Pruebe antes de imprimir

1. Escanee el archivo terminado en pantalla con al menos dos teléfonos distintos.
2. Imprima una copia al tamaño real y en el material real, y vuelva a escanearla con la iluminación del lugar donde se vaya a usar.
3. Compruebe que la página que se abre es la que quería.

Mientras escribe, Universal QR comprueba que la dirección web tenga un formato utilizable y pregunta discretamente si algo responde en ella. Una marca verde significa que algo ha respondido, no que sea la página correcta, así que abra siempre el enlace usted también.`,
  },
  {
    id: 'scanning-safely',
    title: 'Escanear códigos con seguridad',
    summary: 'Un código QR puede ocultar a dónde lleva realmente un enlace. Qué hay que vigilar.',
    group: 'Privacidad y seguridad',
    body: `Un código QR no es más que un enlace que no se puede leer a simple vista. Esa comodidad es también su punto débil: no se sabe a dónde lleva un código hasta que se escanea. La mayoría de los códigos son exactamente lo que parecen, pero a veces los delincuentes los utilizan, por ejemplo pegando un código falso sobre uno auténtico en un parquímetro o en la mesa de un restaurante, o enviándolo en un correo electrónico o una carta.

## Buenos hábitos

- **Lea la dirección antes de abrirla.** Fíjese en la dirección web que le muestra el teléfono. ¿Coincide el nombre con quien espera? Esté atento a faltas de ortografía, palabras de más o terminaciones poco habituales.
- **Desconfíe de las pegatinas.** En cualquier elemento público, compruebe que el código esté impreso como parte del cartel y no pegado encima.
- **Deténgase si le piden pagar o iniciar sesión.** Un código que le lleva directamente a una página de pago o a una pantalla de inicio de sesión merece especial cuidado. Si tiene dudas, escriba usted mismo la dirección de la organización o use su aplicación oficial.
- **No instale aplicaciones desde un código** a menos que esté seguro de su origen. Use la tienda de aplicaciones oficial de su teléfono.
- **Los códigos en correos electrónicos y cartas** merecen la misma desconfianza que los enlaces en correos electrónicos y cartas.

## Cómo ayuda la pestaña Escanear

Cuando escanea un código con Universal QR, no se abre nada automáticamente. La aplicación le muestra el texto completo del código, qué tipo de código es y un botón Copiar. Si el texto es una dirección web, aparece un botón Abrir enlace, y no ocurre nada hasta que lo pulse. Así tiene un momento para leer la dirección antes.

El escaneo en sí se hace en su dispositivo. La imagen de la cámara se descodifica en la aplicación y nunca se sube. La cámara se detiene en cuanto se encuentra un código o cuando sale de la pestaña Escanear.

## Si cree que ha escaneado un código malicioso

Si introdujo datos en una página de la que ahora duda, cambie la contraseña que usó allí y, si se trataba de datos de una tarjeta o de su banco, póngase en contacto con su banco de inmediato. Puede denunciar los códigos y mensajes sospechosos a la policía o al servicio oficial de denuncia de fraudes de su país.`,
  },
  {
    id: 'what-leaves-your-device',
    title: 'Lo que sale de su dispositivo',
    summary: 'Qué se queda en su dispositivo, qué se envía a internet y cuándo.',
    group: 'Privacidad y seguridad',
    body: `Universal QR está diseñado para hacer su trabajo en su dispositivo. Esto es exactamente lo que se queda en él y lo que no.

## Se queda en su dispositivo

- **El diseño y la exportación de códigos.** Las imágenes de los códigos QR y de los códigos de barras se dibujan en la aplicación. Su texto, sus colores y cualquier logotipo que añada no se suben.
- **Su diseño actual** se recuerda en el almacenamiento de la aplicación en este dispositivo, para que siga ahí la próxima vez.
- **Guardar en este dispositivo** mantiene una pequeña galería de diseños en ese mismo almacenamiento local. No necesita cuenta. Si borra los datos de la aplicación, o los datos del sitio en su navegador, se elimina.
- **El escaneo.** La imagen de la cámara se descodifica en su dispositivo y nunca se sube.

## Una comprobación automática

Cuando escribe una dirección web que empieza por https, la aplicación pide a su propio dispositivo que se conecte a esa dirección para ver si algo responde. Esta conexión va directamente de su dispositivo a ese sitio web, no pasa por UNI·SIM, y nosotros no registramos nada de ella. El sitio web que ha escrito verá una solicitud normal desde su conexión, igual que si lo visitara.

## Solo cuando usted lo decide

- **Guardar un código en su cuenta.** Hacer copia de seguridad de este código QR puede guardar una copia en internet asociada a su Universal ID. Lo que se sube es la imagen del código y sus ajustes de diseño, incluido cualquier logotipo que haya añadido. Se guardan en un almacenamiento privado que solo usted, y los demás miembros de su organización si pertenece a una, pueden abrir tras iniciar sesión. Está cifrado en tránsito y en reposo, pero es un almacenamiento en la nube normal y no un cifrado de extremo a extremo, así que nosotros tenemos las claves. Al eliminar una copia de seguridad, esta se borra.
- **Códigos dinámicos.** La dirección de destino, el nombre que le dé al código y su diseño se guardan en nuestro servidor, porque así es como un código dinámico puede cambiarse después de imprimirlo.

## Qué registra un código dinámico al escanearse

Cada escaneo de un código dinámico añade un registro con:

- la fecha y la hora
- el país desde el que se hizo el escaneo, según lo indique la red
- el nombre del sitio web que enlazó al código, si lo hay, sin el resto de la dirección

No se guarda ninguna dirección IP, ningún dato del dispositivo ni ninguna información personal sobre la persona que escanea. Esa persona no necesita ninguna cuenta ni ninguna aplicación. Cuando elimina un código dinámico, sus registros de escaneo se eliminan con él.

Cuando nuestro servidor envía el teléfono a su destino, pide al navegador que no le diga a ese sitio que ha llegado a través del enlace corto.

## Lo que envían todas las aplicaciones Universal

Mientras la aplicación está abierta, envía a nuestro servidor una pequeña señal de que se está usando, para que el menú pueda mostrar cuántas personas la usan. Esa señal contiene el nombre de la aplicación, el tipo de dispositivo (web, teléfono u ordenador), un identificador aleatorio creado en este dispositivo y, si ha iniciado sesión, su cuenta. Si ha iniciado sesión, la aplicación también registra que la ha abierto, para la página de actividad de su cuenta. Ninguna de las dos incluye nada sobre los códigos que crea o escanea. No hay analítica ni publicidad de terceros.

## Los códigos estáticos son privados por naturaleza

Un código creado en la pestaña Diseñar contiene su destino directamente. Al escanearlo nunca se pasa por UNI·SIM, así que no hay nada que podamos ver ni contar.`,
  },
]

export default articles
