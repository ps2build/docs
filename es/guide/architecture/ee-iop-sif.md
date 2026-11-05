# EE, IOP y SIF <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La EE y el IOP no comparten memoria. La lógica del juego corre en la EE, y casi todos los periféricos solo son
alcanzables desde el IOP. Esta página documenta el enlace entre ambos.

## Módulos IOP

Un módulo IOP (`.irx`) es un programa separado con su
propio punto de entrada (`_start`), cargado en la memoria del
IOP por el kernel del IOP. No es una biblioteca
enlazada dentro del ejecutable EE. Un target `iop`/`iop_lib` de
`ps2.yaml` compila uno de estos. El ejecutable EE y los módulos IOP
que necesita son dos o más binarios separados que cooperan
en tiempo de ejecución. Consecuencias:

- existe `embed_irx`: un target `ee` empaqueta los bytes de
  un `.irx` dentro de sí mismo, así un solo
  `ps2build build` produce un `.elf` autocontenido.
- muchos paquetes vienen en **pares**: una mitad es una biblioteca
  del lado EE con funciones normales para llamar, y la otra mitad es el driver residente
  en el IOP con el que esa función habla a través de SIF.
  `pad`+`padman`, `mc`+`mcman`/`mcserv`, `netman` (lado IOP)
  emparejado con `ps2ip` (lado EE) tienen la misma forma.

## SIF

**SIF** (Sub-system InterFace) es el enlace de hardware que
conecta a los dos procesadores. Es un canal angosto y no una ventana de
memoria compartida. Los paquetes `sifman`/`sifcmd` de este SDK son la
capa de software RPC construida sobre él: `sifman` maneja la
inicialización y las transferencias DMA de bajo nivel, y `sifcmd`
agrega encima un protocolo RPC de solicitud y respuesta
para que el código EE llame funciones como
`sceSifCallRpc()`, que bloquean hasta que el módulo IOP
responde.

Dos de los diez canales DMA están dedicados a este enlace
(`DMA_CHANNEL_fromSIF0` y `DMA_CHANNEL_toSIF1`; consulta
[DMA](/es/guide/architecture/dma)), más un tercero menos común
(`DMA_CHANNEL_SIF2`).

## Llamadas RPC y carga

Una llamada RPC envía un mensaje al IOP y de vuelta, y cuesta más que una llamada de función local.
Un módulo IOP tiene que **cargarse**
(`SifLoadModule` o `SifExecModuleBuffer`, o `embed_irx` para empaquetarlo
dentro del binario EE) antes de hacer RPC hacia él.
Enlazarlo no basta.

## `patches`/`sbv`

El paquete `patches` (directorio fuente llamado `sbv`, consulta la
[hoja de referencia](/es/guide/architecture/cheat-sheet)) existe
porque algunas syscalls del IOP de las que depende el SDK (como
cargar un módulo desde un buffer en memoria en vez de una ruta de
archivo) no estaban en el kernel IOP del BIOS comercial original.
`sbv_patch_enable_lmb()` la llama casi cualquier
programa no trivial antes de otras operaciones del IOP;
parcha el kernel IOP en ejecución para soportar
`LoadModuleBuffer`.

## Ver también

- [DMA](/es/guide/architecture/dma)
- [Introducción a la arquitectura de PS2](/es/guide/architecture/introduction)
