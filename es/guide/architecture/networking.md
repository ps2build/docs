# Redes <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El adaptador de red (hardware DEV9/SMAP) es del lado IOP, igual que
todo lo demás hasta ahora - pero las redes son la única área de este
SDK donde genuinamente hay **dos arquitecturas distintas y
mutuamente excluyentes** para alcanzarlo, no una sola capa clara.
Elegir la incorrecta para lo que estás haciendo es la forma más común
de quedarte atascado aquí.

## Arquitectura A: TCP/IP del lado EE, el IOP solo reenvía

- **`dev9`** (core) - el driver de bajo nivel para el hardware de la
  bahía de expansión DEV9 al que se conecta el adaptador de red.
- **`smap`** (core, compilado en "modo NETMAN") - el driver PHY/MAC
  de Ethernet real, del lado IOP.
- **`netman`** (core) - un módulo administrador de *interfaz de red*
  del lado IOP a través del cual `smap` reporta el estado del enlace,
  con un cliente RPC del lado EE del mismo nombre.
- **`ps2ip`** (core) - la pila TCP/IP real (un lwIP empaquetado),
  corriendo **en la EE**. Sockets, DHCP, DNS - todo código del lado
  EE; `netman`/`smap` solo ponen y sacan frames en bruto del cable
  para ella.

Esta es la arquitectura que usa la propia prueba de humo
`scratch/nettest` de este SDK (empaqueta `dev9`+`netman`+`smap`,
enlaza `ps2ip`+`netman` del lado EE): carga los módulos IOP, levanta
DHCP a través del propio `ps2ip_setconfig()` de `ps2ip`, y luego usa
llamadas `socket()`/`connect()`/`send()`/`recv()` de apariencia normal
desde código EE.

::: warning Una trampa real y no obvia
El propio `lwipopts.h` de `ps2ip` deliberadamente deshabilita los
alias POSIX `close`/`read`/`write` (`LWIP_POSIX_SOCKETS_IO_NAMES`
está desactivado), así que la función real de cierre de un socket es
`lwip_close()`, no `close()` - un `close()` a secas no va a compilar.
Esto es intencional: esos nombres genéricos de otra forma opacarían
la E/S de archivos real en otra parte del mismo programa.
:::

## Arquitectura B: toda la pila corre en el IOP

- **`smap-ps2ip`** (core) - el *mismo* código fuente del driver SMAP
  que `smap` arriba, compilado en un modo distinto
  (`SMAP_PS2IP=1` en vez de `SMAP_NETMAN`) - habla directamente con
  una pila lwIP residente en el IOP en vez de pasar por `netman`.
- **`ps2ip-nm`** (core) - un paquete genuinamente separado del
  `ps2ip` del lado EE: la compilación *residente en el IOP* del mismo
  código fuente lwIP. Nada corre en la EE aquí - sockets, DHCP, toda
  la pila vive en el IOP.
- Los módulos IOP que quieren su propio acceso de red sin
  involucrar a la EE se construyen directamente sobre esto -
  **`http`** (un driver de sistema de archivos cliente HTTP de solo
  lectura que registra un dispositivo `http:`) es el ejemplo real en
  este SDK.

**Estas dos arquitecturas no pueden correr a la vez** - `smap` y
`smap-ps2ip` ambas reclaman la misma NIC física, así que es una u
otra para un programa dado en ejecución.

Levantar DHCP para esta arquitectura no tiene una ruta establecida y
expuesta por RPC desde el lado EE como sí la provee `netman` para la
arquitectura A - lo que sea que llame al equivalente de
`ps2ip_setconfig()` aquí tiene que correr directamente en el IOP junto
a la propia pila. Este es un terreno genuinamente menos transitado en
este SDK que la arquitectura A.

## Cuál usar

Si tu propio juego necesita sockets (un cliente de lobby, telemetría,
una llamada HTTP desde código de juego) - arquitectura A. Si estás
escribiendo (o reusando) un módulo IOP autocontenido que quiere acceso
de red sin exponer nada a la EE - arquitectura B, y espera hacer tú
mismo más del trabajo de DHCP/arranque.

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - el patrón RPC
  que sigue la división EE/IOP de `netman`
- [Controles](/es/guide/architecture/controllers)/[Almacenamiento](/es/guide/architecture/storage) -
  otros pares cliente-EE/driver-IOP, para comparar
