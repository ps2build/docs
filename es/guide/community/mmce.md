# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> Página nueva, compilada a partir de documentación de la comunidad y
> del propio código fuente de este SDK. A diferencia de la sección de
> [arquitectura de PS2](/es/guide/architecture/introduction), la mayor
> parte no se puede verificar contra el código fuente propio de este
> SDK - trátala como un punto de partida, no como palabra santa, y
> señala cualquier cosa que parezca incorrecta.

MMCE es un protocolo comunitario (y una familia de hardware) que hace
que una ranura de tarjeta de memoria sea capaz de mucho más que 8MB
de guardados. No es parte del propio modelo de hardware de este SDK -
es una convención de ecosistema para la que este SDK tiene un driver
real y funcional.

## Qué es realmente

Una tarjeta de memoria "inteligente" - hardware real que se sienta en
la ranura de tarjeta de memoria - que emula el protocolo estándar de
tarjeta de memoria sobre [SIO2](/es/guide/architecture/controllers)
mientras respalda el almacenamiento con una tarjeta microSD. Dos
implementaciones reales:

- **SD2PSX** - código abierto y hardware abierto (desarrollador
  `@xyzz`; `sd2psxtd` es un popular fork de firmware extendido).
- **MemCard Pro 2** - un producto comercial (8BitMods).

Como está respaldada por tarjeta SD, tiene datos de guardado
efectivamente ilimitados en vez de lo que cabe en una sola tarjeta de
memoria - y como el propio protocolo SIO2 está emulado (no solo el
almacenamiento), una PS2 estándar no necesita ningún soporte especial
para usarla como una tarjeta de memoria común.

Una extensión más nueva del protocolo va más allá: la tarjeta también
puede servir datos de *juego*, no solo guardados, permitiendo que un
loader como Open PS2 Loader arranque un juego completo directamente
desde la tarjeta, cambiando entre una tarjeta de memoria "virtual"
por-juego y los datos reales del juego según sea necesario.

## La familia de drivers de este SDK

El paquete `mmceman` de `sdk-world` en realidad son tres módulos IOP
separados construidos a partir de la misma fuente upstream real
(`ps2-mmce/mmceman` v2.1.1, MIT), cada uno con un trabajo distinto:

| Paquete | IRX | Rol |
|---|---|---|
| `mmceman` | `mmceman.irx` | El driver completo - registra un dispositivo real de sistema de archivos IOP (basado en `iomanX_AddDrv`). |
| `mmcedrv` | `mmcedrv.irx` | Una variante mínima - solo exporta lectura/escritura/seek a nivel de sector, sin registro de dispositivo. Pensada para uso dentro del juego, una vez que un loader ya haya cambiado el puerto de tarjeta de memoria a modo MMCE. |
| `mmceigr` | `mmceigr.irx` | El más pequeño de los tres - un módulo de un solo disparo que emite el **reset dentro del juego (IGR)** de MMCE, volviendo a la tarjeta de memoria de arranque. No tiene ninguna función de kernel importada - solo acceso directo a registros SIO2. |

Cuál necesitas depende de qué esté haciendo tu programa: un loader
que necesita explorar/administrar la tarjeta quiere el `mmceman`
completo; un juego que solo necesita leer/escribir sus propios datos
de guardado después de que un loader ya haya hecho el cambio quiere
el `mmcedrv` más liviano; algo que necesita devolver el control a la
tarjeta de memoria original (volver a un menú, por ejemplo) quiere
`mmceigr`.

## Ver también

- [Controles](/es/guide/architecture/controllers) - el bus SIO2 sobre
  el que MMCE se emula
- [Almacenamiento](/es/guide/architecture/storage) - el stack de
  driver de tarjeta de memoria estándar (`mc`/`mcman`/`mcserv`) al que
  MMCE es una alternativa directa
- [PSU](/es/guide/community/psu) - el formato de archivo en el que se
  empaqueta el contenido comunitario de tarjeta de memoria, un asunto
  separado del hardware/protocolo de esta página
