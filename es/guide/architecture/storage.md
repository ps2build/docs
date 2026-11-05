# Almacenamiento <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La PS2 tiene tres dispositivos de almacenamiento que un
proyecto homebrew puede usar: el disco, la tarjeta de memoria y,
mucho menos común, un disco duro. Como los demás
periféricos, los tres se alcanzan a través del IOP.
Cada uno tiene un driver de
bajo nivel y una capa de sistema de archivos encima.

## Disco

- **`cdvd`** (core) es la interfaz de bajo nivel del lado EE hacia la
  unidad: lectura de sectores en bruto y estado de bandeja y disco.
- **`cdvdfsv`** (core) es el servidor de **sistema de archivos** de
  CD/DVD del lado IOP. Es la capa ISO9660 que convierte
  sectores en bruto en archivos y directorios.
- **`cdfs`** (core) registra el dispositivo `cdfs:` (construido
  sobre `cdvdman`, el driver IOP de bajo nivel) a través
  del cual tu programa abre archivos.

## Tarjeta de memoria

Físicamente es un periférico SIO2 (consulta
[Controles](/es/guide/architecture/controllers)), pero su trabajo es
almacenamiento, así que también tiene su propia capa de sistema de
archivos:

- **`mc`** (core) es el cliente RPC del lado EE; **`mcman`** (core) es
  el driver IOP con el que habla, con la misma forma que
  `pad` y `padman`.
- **`mcserv`** (core) es un servidor de **sistema de archivos** del
  lado IOP de más alto nivel sobre `mcman`. Entiende
  la estructura de directorios y archivos de la tarjeta de memoria,
  y no solo el acceso a sectores en bruto.
- **`fs-osd`**/**`hdd-osd`** (core) implementan **PFS**, el formato
  de sistema de archivos que usa el navegador de partidas
  guardadas del BIOS de la PS2. Necesario para que los
  datos guardados aparezcan en la
  pantalla de administración de tarjetas de memoria del sistema, tanto
  en una tarjeta de memoria como (ver abajo) en el HDD.
- **`mmceman`** (world) apunta a un emulador de tarjeta de
  memoria. Respalda los datos guardados con algo distinto de una tarjeta física
  sin cambiar la API de `mc`.

## Disco duro / dispositivos de bloque genéricos

El HDD de la PS2 (poco común en hardware comercial,
más común en entornos de desarrollo) y el almacenamiento
masivo USB genérico comparten otra capa, ya que ninguno es un periférico SIO2:

- **`apa`** (core) es el administrador de particiones **APA**, el
  esquema de particionado de disco de la PS2, que registra
  `hdd0:` como dispositivo.
- **`bdm`** (core) es un administrador de dispositivos de bloque más
  genérico. Parsea tablas de particiones MBR y GPT para lo que no
  está formateado en APA (una unidad USB, por ejemplo).
- **`bdmfs_fatfs`** (core) es un driver de sistema de archivos
  FAT12/16/32 sobre `bdm`. Hace que
  una unidad USB formateada en FAT sea legible como
  archivos.
- **`fs-osd`**/**`hdd-osd`** (los mismos paquetes PFS de arriba)
  también sirven para datos guardados compatibles con el
  navegador del BIOS que vivan en el HDD en vez de en una tarjeta de
  memoria.

## Ver también

- [Controles](/es/guide/architecture/controllers): la tarjeta de
  memoria como dispositivo SIO2
- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): el patrón RPC
  detrás de `mc` y `cdvd`
