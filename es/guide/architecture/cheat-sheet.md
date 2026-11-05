# Hoja de referencia <Badge type="warning" text="beta" />

> Toda esta sección de arquitectura es nueva y escrita a mano contra
> el código fuente real, pero todavía no ha tenido muchos ojos
> encima - si algo aquí parece incorrecto, puede que lo sea. Consulta
> [Introducción a la arquitectura de PS2](/es/guide/architecture/introduction)
> para la versión de esto que explica *por qué*, no solo *qué*.

Ve directo al paquete que necesitas para una tarea. Los paquetes
`core/` siempre están instalados; los paquetes `world/` y los repos
independientes necesitan `libs:`/agregarse como dependencia - consulta
[Paquetes](/es/guide/packages).

| Quiero... | Usa | Notas |
|---|---|---|
| Dibujar primitivas 2D/3D | `gsKit` (tier: standalone) o `ps2gl` (standalone) | Dos APIs con forma distinta sobre el mismo GS - consulta [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer). No ambas a la vez. |
| Mover buffers al GS/VU sin bloquear la CPU | `dmakit` (world) | Envuelve tags/cadenas DMA - consulta [DMA](/es/guide/architecture/dma). |
| Hacer matemática de vectores/matrices | `math3d` (core), `ps2stuff` (standalone) | `math3d` es la biblioteca base del lado EE; `ps2stuff` agrega helpers de más alto nivel. |
| Correr código en VU1 | Los microprogramas VU1 propios de `gsKit`/`ps2gl`, o asm VCL/VU escrito a mano | No existe un "paquete VU" de propósito general - consulta [Vector Units](/es/guide/architecture/vector-units). |
| Reproducir un efecto de sonido / transmitir música | `libsd`, `libspu2` (core, bajo nivel); `audsrv` (standalone, LGPL, el camino fácil); `libsnd2`, `rspu2drv`, `sdr` (world, específicos de formato) | Consulta [Audio](/es/guide/architecture/audio) para saber qué capa elegir. |
| Decodificar MP3 | `libmad` (world) | Combínalo con `audsrv` para la reproducción. |
| Leer un control | `pad` (core, cliente RPC del lado EE) + `padman` (core, driver IOP, cargado automáticamente) | Consulta [Controles](/es/guide/architecture/controllers). |
| Leer/escribir una tarjeta de memoria | `mc` (core, cliente EE) + `mcman`/`mcserv` (core, drivers IOP) | `mmceman` (world) si quieres un target de emulador de tarjeta de memoria en vez de hardware real. |
| Leer una tarjeta de memoria con formato de guardado (PFS) | `fs-osd`/`hdd-osd` (core) | El sistema de archivos real de guardado de la PS2, también usado en el HDD. |
| Leer archivos del disco | `cdvd`, `cdvdfsv`, `cdfs` (core) | Consulta [Almacenamiento](/es/guide/architecture/storage). |
| Hablar con la red | `netman` + `smap` (core, IOP) + `ps2ip` (core, lwIP del lado EE) | Consulta [Redes](/es/guide/architecture/networking) - y la alternativa residente en el IOP `ps2ip-nm`/`smap-ps2ip`, una arquitectura separada. |
| Llamar desde código EE a un módulo IOP | `sifman`/`sifcmd` (core) | El puente SIF/RPC - consulta [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif). |
| Parchar una syscall no soportada (p. ej. `LoadModuleBuffer`) | `patches` (core, el directorio fuente se llama `sbv`) | `sbv_patch_enable_lmb()` es la que llama casi cualquier programa no trivial. |
| Cargar fuentes | `freetype` (standalone) + `gskit-toolkit` (world, la conecta al sistema de texturas de `gsKit`) | |
| Cargar imágenes PNG/JPEG | `libpng` (standalone), `libjpeg_ps2_addons`/`libjpeg-turbo` (world/standalone) | |
| Comprimir/descomprimir datos | `zlib` (standalone), `unzip` (world) | |
| Hashear datos (MD5/SHA/CRC32) | `hash` (world) | Genérico, no específico de PS2. |
| Renderizar gráficos ASCII-art | `aalib` (world) | |
| Decodificar video MPEG2 | `mpeg` (core) | Acelerado por IPU/DMAC/MMI - consulta [DMA](/es/guide/architecture/dma) para los dos canales propios del IPU (`fromIPU`/`toIPU`). |
