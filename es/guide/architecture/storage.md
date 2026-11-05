# Almacenamiento <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La PS2 tiene tres dispositivos de almacenamiento reales que un
proyecto homebrew podría tocar - el disco, la tarjeta de memoria, y
(mucho menos común hoy en día) un disco duro - y, como con cada
periférico visto hasta ahora, los tres se alcanzan a través del IOP,
nunca directamente desde la EE. Cada uno tiene su propio driver de
bajo nivel más una capa de sistema de archivos construida sobre él.

## El disco: CD/DVD

- **`cdvd`** (core) es la interfaz de bajo nivel del lado EE hacia la
  unidad - leer sectores en bruto, estado de bandeja/disco.
- **`cdvdfsv`** (core) es el servidor de **sistema de archivos** de
  CD/DVD del lado IOP - la pieza a nivel ISO9660 que convierte
  sectores en bruto en archivos y directorios.
- **`cdfs`** (core) registra el dispositivo real `cdfs:` (construido
  sobre `cdvdman`, el driver IOP de bajo nivel subyacente) a través
  del cual tu programa abre archivos.

En la práctica: tu código lee archivos vía `cdfs:`/`cdvdfsv`, no
parseando sectores ISO9660 él mismo.

## La tarjeta de memoria

Físicamente es un periférico SIO2 (consulta
[Controles](/es/guide/architecture/controllers)), pero su trabajo es
almacenamiento, así que también tiene su propia capa de sistema de
archivos:

- **`mc`** (core) es el cliente RPC del lado EE; **`mcman`** (core) es
  el driver IOP con el que habla - la misma forma cliente/driver que
  `pad`/`padman`.
- **`mcserv`** (core) es un servidor de **sistema de archivos** del
  lado IOP de más alto nivel encima de `mcman` - la pieza que entiende
  la estructura real de directorios/archivos de la tarjeta de memoria,
  no solo el acceso a sectores en bruto.
- **`fs-osd`**/**`hdd-osd`** (core) implementan **PFS** - el formato
  de sistema de archivos real que usa el propio navegador de partidas
  guardadas del BIOS de la PS2. Este es el formato que quieres si los
  datos guardados necesitan aparecer correctamente en la propia
  pantalla de administración de tarjetas de memoria del sistema, tanto
  en una tarjeta de memoria real como (ver abajo) en el HDD.
- **`mmceman`** (world) es un target de *emulador* de tarjeta de
  memoria - útil cuando quieres que los datos guardados estén
  respaldados por algo distinto de una tarjeta física real (por
  ejemplo durante el desarrollo), sin cambiar cómo tu código de juego
  habla con `mc`.

## Disco duro / dispositivos de bloque genéricos

El HDD de la PS2 (una unidad real pero de nicho en hardware de venta
al público, más común en entornos de desarrollo) y el almacenamiento
masivo USB genérico comparten una capa distinta, ya que ninguno de los
dos es un periférico SIO2:

- **`apa`** (core) es el administrador de particiones **APA** - el
  esquema propio de particionado de disco de la PS2, que registra
  `hdd0:` como dispositivo.
- **`bdm`** (core) es un administrador de dispositivos de bloque más
  genérico - parseo de tablas de particiones MBR/GPT para cosas que no
  están formateadas en APA (una unidad USB, por ejemplo).
- **`bdmfs_fatfs`** (core) es un driver de sistema de archivos
  FAT12/16/32 que se sienta encima de `bdm` - la pieza que hace que
  una unidad USB formateada en FAT plano sea realmente legible como
  archivos.
- **`fs-osd`**/**`hdd-osd`** (los mismos paquetes PFS de arriba)
  también son lo que usarías para datos guardados compatibles con el
  navegador del BIOS que vivan en el HDD en vez de en una tarjeta de
  memoria.

## Ver también

- [Controles](/es/guide/architecture/controllers) - la tarjeta de
  memoria como dispositivo SIO2, no como sistema de archivos
- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - el patrón RPC
  detrás de `mc`/`cdvd`
