# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> Esta página está en beta. Se compiló a partir de documentación de la comunidad y del código fuente del
> paquete `mmceman`. A diferencia de la sección de [arquitectura de PS2](/es/guide/architecture/introduction),
> la mayor parte no se puede verificar contra el código de este SDK.
> Reporta cualquier cosa que parezca incorrecta.

MMCE es un protocolo comunitario y una familia de hardware que permite que una ranura de
tarjeta de memoria contenga mucho más que 8MB de guardados. No forma
parte del modelo de hardware de la PS2. Este
SDK incluye un driver funcional para él.

## Descripción general

Una tarjeta MMCE se coloca en la ranura de tarjeta de memoria y
emula el protocolo estándar de tarjeta de memoria sobre
[SIO2](/es/guide/architecture/controllers), almacenando los datos
en una tarjeta microSD. Dos implementaciones:

- **SD2PSX** - código abierto y hardware abierto (desarrollador `@xyzz`;
  `sd2psxtd` es un fork de firmware extendido popular).
- **MemCard Pro 2** - un producto comercial (8BitMods).

Como la tarjeta usa almacenamiento SD, contiene muchos más datos de guardado
que una tarjeta de memoria. Como el protocolo SIO2
se emula por completo, una PS2 estándar no necesita
soporte especial para usarla como tarjeta de memoria.

Una extensión más nueva del protocolo permite que la tarjeta también sirva
datos de juego, de modo que un loader como Open PS2 Loader puede arrancar
un juego desde la tarjeta, alternando entre una tarjeta de memoria virtual
por juego y los datos del juego según se necesite.

## Drivers de este SDK

El paquete `mmceman` de `sdk-world` compila tres módulos IOP
a partir de la misma fuente upstream
(`ps2-mmce/mmceman` v2.1.1, MIT):

| Paquete | IRX | Rol |
|---|---|---|
| `mmceman` | `mmceman.irx` | El driver completo. Registra un dispositivo de sistema de archivos IOP (basado en `iomanX_AddDrv`). |
| `mmcedrv` | `mmcedrv.irx` | Una variante mínima con exports de lectura, escritura y seek a nivel de sector y sin registro de dispositivo. Para uso dentro del juego después de que un loader haya cambiado el puerto de tarjeta de memoria a modo MMCE. |
| `mmceigr` | `mmceigr.irx` | El módulo más pequeño. Emite el **reset dentro del juego (IGR)** de MMCE, que vuelve a la tarjeta de memoria de arranque. No importa funciones del kernel y usa acceso a registros SIO2 en línea. |

| Programa | Módulo |
|---|---|
| Loader que explora y administra la tarjeta | `mmceman` |
| Juego que lee y escribe sus propios datos de guardado después de que un loader cambió el modo | `mmcedrv` |
| Programa que devuelve el control a la tarjeta de memoria original | `mmceigr` |

## Ver también

- [Controles](/es/guide/architecture/controllers) - el bus SIO2 que emula
  MMCE
- [Almacenamiento](/es/guide/architecture/storage) - el stack de driver de
  tarjeta de memoria estándar (`mc`, `mcman`, `mcserv`) que MMCE reemplaza
- [PSU](/es/guide/community/psu) - el formato de archivo del contenido
  comunitario de tarjeta de memoria, independiente del hardware y
  el protocolo de esta página
