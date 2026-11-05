# Introducción a la arquitectura de PS2 <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La PS2 tiene varios procesadores, cada uno con su propia memoria, conectados por unos pocos
buses angostos. Esta página los enumera junto con los paquetes del SDK que apuntan a cada uno.
Las páginas siguientes tratan cada pieza.

## CPU

**La Emotion Engine (EE)** es el procesador principal - una CPU de
128 bits basada en MIPS con dos **Vector Units** conectadas (VU0,
fuertemente acoplada a la propia EE, y VU1, que corre principalmente
por su cuenta alimentando al GS). Aquí es donde corre la lógica de tu
juego, la mayor parte de tu `main()`, y cualquier código que escribas
contra los targets `ee`/`ee_lib` en `ps2.yaml`.

**El IOP (I/O Processor)** es una segunda CPU MIPS mucho más simple -
de hecho, descendiente de la que traía la PlayStation original, razón
por la cual la PS2 también puede leer discos de PS1. No corre la
lógica de tu juego; corre un pequeño kernel que carga módulos
reubicables (archivos **IRX** - `.irx` es al IOP más o menos lo que
`.elf` es a la EE) y media el acceso a casi todos los periféricos: los
puertos de control, las tarjetas de memoria, la unidad de CD/DVD, el
adaptador de red, el sonido. Esto es para lo que compilan los targets
`iop`/`iop_lib` en `ps2.yaml`.

Ninguno de esos periféricos
está conectado directamente a la EE. Todos son hardware del lado IOP,
y la EE pasa por el IOP para alcanzarlos.
Una funcionalidad normalmente necesita un paquete en cada procesador.

## SIF

La EE y el IOP no comparten memoria. El **SIF** (Sub-system InterFace)
es el enlace de hardware entre ambos, y los paquetes `sifman`/`sifcmd`
de PS2SDK son el software construido sobre él - un mecanismo RPC
(remote procedure call) que permite que código de la EE le pida a un
módulo del IOP que haga algo y le devuelva un resultado. Consulta
[EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) para ver el código
y por qué tantos paquetes vienen en pares
EE-cliente/IOP-driver (`pad`+`padman`, `mc`+`mcman`,
`netman` del lado IOP emparejado con `ps2ip` del lado EE).

## GS

El **Graphics Synthesizer (GS)** es su propio chip con su propia
memoria de video local (eDRAM) - la EE no puede leer ni escribir la
memoria del GS directamente como puede hacerlo con la RAM principal.
En cambio, la EE construye un flujo de comandos de dibujo y escrituras
de registros (un **paquete GIF**) y lo entrega, casi siempre vía
**DMA** en lugar de que la CPU lo copie byte por byte. Consulta
[Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer).

## DMA

La EE, el GS, VU1 y el enlace SIF hacia el IOP son
destinos separados. La PS2 tiene diez **canales DMA** dedicados para
mover datos entre ellos mientras la CPU hace otro trabajo.
`dmakit` es el envoltorio de este SDK para construir y encolar ese
trabajo. Consulta [DMA](/es/guide/architecture/dma).

## Sonido y almacenamiento

**SPU2** (el chip de sonido) y la unidad de **CD/DVD** se alcanzan
ambos a través del IOP, de la misma manera que los controles y las
tarjetas de memoria - no hay una ruta directa EE-a-SPU2 ni
EE-a-unidad. Consulta [Audio](/es/guide/architecture/audio) y
[Almacenamiento](/es/guide/architecture/storage).

## Redes

El adaptador de red (DEV9/SMAP) también es hardware del lado IOP,
pero este SDK ofrece dos formas de exponerlo: una donde la
pila TCP/IP corre en la EE y el IOP solo reenvía paquetes
(`netman`+`ps2ip`), y otra donde toda la pila corre del lado IOP
(`ps2ip-nm`+`smap-ps2ip`). No son intercambiables y no pueden correr
al mismo tiempo. Consulta [Redes](/es/guide/architecture/networking).

## Siguientes páginas

- [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer)
- [DMA](/es/guide/architecture/dma)
- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif)
- [Vector Units](/es/guide/architecture/vector-units)
- [Audio](/es/guide/architecture/audio)
- [Controles](/es/guide/architecture/controllers)
- [Almacenamiento](/es/guide/architecture/storage)
- [Redes](/es/guide/architecture/networking)
