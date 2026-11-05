# EE, IOP y SIF <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

Esta es la división que le da forma a todo el SDK: la lógica de tu
juego corre en una CPU (la EE), casi todos los periféricos solo son
alcanzables desde una segunda CPU separada (el IOP), y las dos no
comparten memoria. Esta página trata sobre el puente entre ambas y lo
que eso significa para cómo están organizados los paquetes.

## Dos programas independientes, no uno

Un módulo IOP (`.irx`) es un programa genuinamente separado con su
propio punto de entrada (`_start`), cargado en la propia memoria del
IOP por el pequeño kernel propio del IOP - no es una biblioteca
enlazada dentro de tu ejecutable EE. Un target `iop`/`iop_lib` de
`ps2.yaml` compila uno de estos. Tu ejecutable EE y los módulos IOP
que necesite son dos (o más) binarios separados que terminan
cooperando en tiempo de ejecución, razón por la cual:

- `embed_irx` existe - es cómo un target `ee` empaqueta los bytes de
  un `.irx` acompañante dentro de sí mismo, así un solo
  `ps2build build` produce un `.elf` autocontenido en vez de que
  tengas que distribuir múltiples archivos.
- tantos paquetes vienen en **pares** - una mitad es una biblioteca
  del lado EE que le da a tu código de juego una función de
  apariencia normal para llamar, la otra mitad es el driver residente
  en el IOP con el que esa función realmente habla a través de SIF.
  `pad`+`padman`, `mc`+`mcman`/`mcserv`, `netman` (lado IOP)
  emparejado con `ps2ip` (lado EE) tienen todos esta misma forma.

## SIF: el único camino entre ambos

**SIF** (Sub-system InterFace) es el enlace de hardware real que
conecta a los dos procesadores - un canal angosto, no una ventana de
memoria compartida. Los paquetes `sifman`/`sifcmd` de este SDK son la
capa de software RPC construida sobre él: `sifman` maneja la
mecánica de bajo nivel de inicialización/transferencia DMA, `sifcmd`
agrega una capa de protocolo RPC de solicitud/respuesta sobre eso
para que el código EE pueda llamar funciones con apariencia de
`sceSifCallRpc()` que bloquean hasta que el módulo IOP del otro lado
responde.

Dos de los diez canales DMA están dedicados a este enlace
(`DMA_CHANNEL_fromSIF0`/`DMA_CHANNEL_toSIF1` - consulta
[DMA](/es/guide/architecture/dma)), más un tercero menos común
(`DMA_CHANNEL_SIF2`).

## Lo que esto te cuesta

Una llamada RPC al IOP no es gratis como sí lo es una llamada de
función normal - es un mensaje real que cruza a otra CPU y regresa,
así que el código tiende a agrupar solicitudes en lote en vez de
llamar a través de SIF en un ciclo ajustado. Esto también es por qué
un módulo IOP nuevo realmente tiene que **cargarse**
(`SifLoadModule`/`SifExecModuleBuffer`, o `embed_irx` empaquetándolo
dentro del binario EE para el mismo efecto) antes de que se pueda
hacer RPC hacia él - a diferencia de una biblioteca del lado EE, no
existe el "simplemente enlázala y ya está ahí."

## `patches`/`sbv`: parchando alrededor de suposiciones viejas

El paquete `patches` (directorio fuente llamado `sbv`, consulta la
[hoja de referencia](/es/guide/architecture/cheat-sheet)) existe
porque algunas syscalls del IOP de las que depende el SDK (como
cargar un módulo desde un buffer en memoria en vez de una ruta de
archivo) no formaban parte del kernel IOP original del BIOS de venta
al público. `sbv_patch_enable_lmb()` es la que llama casi cualquier
programa no trivial antes de hacer cualquier otra cosa relacionada
con el IOP - parcha el kernel IOP en ejecución para soportar
`LoadModuleBuffer`.

## Ver también

- [DMA](/es/guide/architecture/dma)
- [Introducción a la arquitectura de PS2](/es/guide/architecture/introduction)
