# Graphics Synthesizer <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El Graphics Synthesizer (GS) es el chip gráfico de la PS2 - su propio
silicio, con su propia memoria de video local, situado al lado de la
EE en vez de dentro de ella. Entender esa separación explica la mayor
parte de cómo se ve realmente el código gráfico en PS2.

## Memoria local, no memoria compartida

El GS tiene 4MB de eDRAM en el propio chip, usados para el frame
buffer, el z-buffer, y cada textura actualmente residente en la GPU.
La EE **no puede leer ni escribir esta memoria directamente** - no
hay un puntero que puedas desreferenciar para tocar un píxel. Todo lo
que termina en la memoria del GS (una carga de textura, un frame
buffer limpiado, un triángulo) llega como un comando que el propio GS
ejecuta.

## Paquetes GIF: cómo llegan los comandos al GS

Esos comandos se empaquetan como **paquetes GIF** (GIF = Graphics
Interface) - datos etiquetados que el front end del GS desempaqueta
en escrituras de registros y dibujos de primitivas. Un paquete
normalmente se le entrega al GS a través de su propio canal DMA
(`DMA_CHANNEL_GIF`, canal 2 - consulta [DMA](/es/guide/architecture/dma))
en lugar de que la CPU lo escriba palabra por palabra, ya que eso
bloquearía a la EE esperando que el GS le siga el ritmo.

## Registros privilegiados

Un puñado de registros del GS están mapeados en memoria directamente
en el propio espacio de direcciones de la EE (no a través de DMA) para
cosas que la CPU necesita tocar de forma síncrona - el timing de
pantalla, el buffer de despliegue actual, y el estado de
interrupciones. Direcciones reales, del propio `ee_regs.h` de este
SDK:

| Registro | Dirección | Propósito |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Configuración del circuito de salida (qué circuito(s) de lectura están activos, mezcla alfa entre ellos) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Modo de timing/sincronización de video |
| `GS_BGCOLOR` | `0x120000e0` | Color de fondo cuando no se dibuja nada más |
| `GS_CSR` | `0x12001000` | Control/estado - bandera de interrupción VSync, campo actual, reset |

Todo lo demás - tipo de primitiva, color de vértice, parámetros de
textura, modo de mezcla alfa, los propios punteros del frame/z-buffer -
pasa por paquetes GIF, no por este conjunto mapeado directamente.

## Dos APIs sobre el mismo chip

Este SDK trae dos bibliotecas distintas para dibujar cosas realmente,
y **no están pensadas para usarse juntas** en un mismo proyecto:

- **`gsKit`** - la API más tradicional, con sabor a modo inmediato:
  construye una primitiva, llama a una función de dibujo.
  `gskit-toolkit` la extiende con carga de texturas desde
  `freetype`/`libpng`.
- **`ps2gl`** - una API con forma distinta, más cercana a un pequeño
  parecido a OpenGL.

Ambas al final hacen lo mismo por debajo - construir paquetes GIF y
enviarlos por DMA al GS - solo difieren en cómo debería verse tu
código mientras lo hace. Elegir una sobre la otra temprano importa,
ya que las bibliotecas de más alto nivel construidas sobre cualquiera
de las dos generalmente no son portables a la otra.

## Dónde viven realmente el frame/z-buffer

Como la memoria del GS no es simplemente "más RAM," los frame
buffers, z-buffers, y texturas deben colocarse explícitamente en
offsets elegidos dentro de esos 4MB, dimensionados para caber - un
presupuesto real y finito que administras tú mismo (`gsKit`/`ps2gl`
tienen cada uno su propio concepto de asignador para esto), a
diferencia de la RAM principal donde `malloc` oculta la contabilidad.

## Ver también

- [DMA](/es/guide/architecture/dma) - cómo llegan realmente los paquetes
- [Vector Units](/es/guide/architecture/vector-units) - VU1
  normalmente construye los paquetes GIF en primer lugar
