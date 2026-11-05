# Redes <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El adaptador de red (hardware DEV9/SMAP) es del lado IOP, como el resto de periféricos. El SDK tiene **dos arquitecturas
mutuamente excluyentes** para usarlo.

## Arquitectura A: TCP/IP en la EE

- **`dev9`** (core) - el driver de bajo nivel para el hardware de la
  bahía de expansión DEV9 al que se conecta el adaptador de red.
- **`smap`** (core, compilado en "modo NETMAN") - el driver PHY/MAC
  de Ethernet, del lado IOP.
- **`netman`** (core) - un módulo administrador de interfaz de red
  del lado IOP a través del cual `smap` reporta el estado del enlace,
  con un cliente RPC del lado EE del mismo nombre.
- **`ps2ip`** (core) - la pila TCP/IP (un lwIP empaquetado),
  corriendo **en la EE**. Sockets, DHCP y DNS son código del lado
  EE; `netman` y `smap` solo envían y reciben frames en bruto.

Para usarla, empaqueta `dev9`, `netman` y `smap`
y enlaza `ps2ip` y `netman` del lado EE. Carga los módulos IOP, levanta
DHCP con `ps2ip_setconfig()` y luego usa
`socket()`, `connect()`, `send()` y `recv()` desde código EE.

::: warning Alias POSIX
`lwipopts.h` de `ps2ip` deshabilita los
alias POSIX `close`, `read` y `write` (`LWIP_POSIX_SOCKETS_IO_NAMES`
está desactivado), así que un socket se cierra con
`lwip_close()` y un `close()` a secas no compila.
Los alias están deshabilitados porque esos nombres genéricos opacarían
la E/S de archivos en otra parte del programa.
:::

## Arquitectura B: toda la pila en el IOP

- **`smap-ps2ip`** (core): el mismo código fuente del driver SMAP
  que `smap`, compilado en otro modo
  (`SMAP_PS2IP=1` en vez de `SMAP_NETMAN`). Habla directamente con
  una pila lwIP residente en el IOP en vez de pasar por `netman`.
- **`ps2ip-nm`** (core): un paquete separado del
  `ps2ip` del lado EE. Es la compilación residente en el IOP del mismo
  código fuente lwIP. Nada corre en la EE: sockets, DHCP y toda
  la pila viven en el IOP.
- Los módulos IOP que quieren acceso de red sin
  involucrar a la EE se construyen sobre esto.
  **`http`** (un driver de sistema de archivos cliente HTTP de solo
  lectura que registra un dispositivo `http:`) es el ejemplo en
  este SDK.

**Estas dos arquitecturas no pueden correr a la vez.** `smap` y
`smap-ps2ip` reclaman la misma NIC física, así que un programa usa una u
otra.

La EE no tiene una ruta RPC para levantar DHCP en esta arquitectura, como la que `netman` ofrece en la A.
El equivalente de `ps2ip_setconfig()` debe correr
en el IOP junto a la pila.

## Selección

| Requisito | Arquitectura |
|---|---|
| Sockets desde código EE | A |
| Módulo IOP autocontenido con acceso de red y sin participación de la EE | B |

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): el patrón RPC
  que sigue la división EE/IOP de `netman`
- [Controles](/es/guide/architecture/controllers)/[Almacenamiento](/es/guide/architecture/storage):
  otros pares cliente EE y driver IOP
