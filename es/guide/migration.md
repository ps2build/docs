# Migrando desde ps2sdk original

Este SDK es una reescritura desde cero, no un fork que parcheas en su
lugar. Esto es lo que cambia si vienes del
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) y
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports)
originales.

## El sistema de build: Makefile → `ps2.yaml`

`Makefile.pref`, `Makefile.eeglobal`, `Makefile.iopglobal`, y los
`EE_CFLAGS`/`EE_LIBS`/`IOP_IMPORT_INCS` escritos a mano se reemplazan
por un único `ps2.yaml` que describe los targets de un proyecto y los
paquetes que cada uno necesita por nombre.

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

`ps2build build` genera `build.ninja` y `build/compile_commands.json`,
y luego invoca `ninja` - `libs:` resuelve los flags de include/enlace
de cada paquete automáticamente. Consulta [ps2.yaml](/es/guide/ps2-yaml)
para el formato completo, y [Primeros pasos](/es/guide/getting-started)
para el resto del flujo de trabajo.

## El árbol de paquetes: plano → por paquete

El original instala todo en un único árbol compartido -
`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include` - con los
headers y archives de todos los paquetes uno junto al otro. Aquí, cada
paquete tiene su propio directorio:

```
$PS2DEV/packages/core/<nombre>/
$PS2DEV/packages/world/<nombre>/
```

Cada uno lleva su propio `package.yaml`, y `libs:` resuelve un paquete
por ese nombre de directorio. Consulta [Paquetes](/es/guide/packages)
para cómo se resuelven headers y orden de enlazado, y
[Paquetes disponibles](/es/guide/available-packages) para lo que está
instalado.

Ya no hay un único `$PS2SDK/ee/include` donde buscar - usa `libs:` en
su lugar.

## El nombre de un paquete debe coincidir con su verdadero stem de `-l`

Nombra el directorio como lo que pasarías a `-l`, no como el nombre
propio del proyecto. `zlib` es `z` (`libz.a`, `-lz`), no `zlib`. Lo
mismo para `aa` (no `aalib`), `mad` (no `libmad`), `tap` (no `libtap`),
`id3tag` (no `libid3tag`), `jpeg` (no `libjpeg-turbo`). `ps2build`
deriva el flag de enlazado del nombre literal en `libs:` - no lee el
`package.yaml` para averiguar el nombre real del archive. Asegúrate de
que el nombre del directorio sea correcto.

## Niveles (tiers): `core` vs `world`

Cada paquete declara un `tier:`:

- **`core`** - ps2sdk original real (`origin: ps2sdk`), licencia
  permisiva. Kernel, drivers, sistema de archivos, memoria, redes - la
  base sobre la que se construye cualquier proyecto.
- **`world`** - todo lo demás: `ps2sdk-ports`, ports de terceros,
  LGPL/GPL/BSD/MIT, sin restricción.

`core` necesita tanto `origin: ps2sdk` como una licencia permisiva -
sin ambos, va a `world`, incluso si técnicamente es parte del ps2sdk
original (una pequeña cantidad de módulos de variantes de BIOS quedan
en `world` exactamente por esta razón). `audsrv` (GPL) no está en
ningún nivel - se mantiene en su propio repo, se instala de la misma
forma, pero nunca se incluye junto al resto.

`common` es la única excepción: sus headers siempre están en el
include path, para cualquier target, incondicionalmente. Nunca
escribirás `headers: [common]` - no lo necesita, y no se acepta.

## Portear tu propia biblioteca

Consulta [Paquetes personalizados](/es/guide/custom-packages) para las
dos formas soportadas: envolver un build de CMake existente contra
`ps2dev.cmake`, o escribir un par nativo `ps2.yaml` + `package.yaml`
reflejando la lista de objetos de tu Makefile anterior. En cualquier
caso, `packages/world/<nombre>/` es lo que se comprime y se publica en
un release - instalable por nombre igual que cualquier cosa en
`core`/`world`.

## Qué no está migrado todavía

Esta lista no es exhaustiva - las variantes de revisión de BIOS de
nicho y las herramientas de diagnóstico solo para desarrollo se dejan
fuera a propósito. Si algo falta tanto aquí como en
[Paquetes disponibles](/es/guide/available-packages), simplemente
todavía no se ha revisado.

- **Utilidades hermanas de `ee/mpeg`** - el decodificador (`mpeg`) es
  real y está acelerado por hardware IPU; un par de archivos auxiliares
  adyacentes no están incluidos.
- **El cliente HTTP del lado IOP** (`iop/fs/http`) - su dependencia de
  lwip (`ps2ip-nm`/`ps2ips-iop`) está migrada, así que esto ya no está
  bloqueado, solo falta hacerlo.
- **Codecs de audio**: `vorbis`/`vorbisfile`/`ogg`, y `clearspu` (por
  debajo de `libspu2`, que sí está migrado).
- **`vmcman`** - una memory card virtual respaldada por un archivo en
  lugar de hardware real, útil para emulación/desarrollo.
- **Variantes de revisión de BIOS y herramientas de diagnóstico de
  DEV9/HDD/memory card** - configuraciones alternativas de `apa`/`pfs`,
  `hdck`/`hdsk`/`fsck`/`fssk`. Reales en el original, poca demanda en
  la práctica.

**Fuera de alcance**, no huecos: hardware exclusivo de arcade (drivers
de dongle/chip de seguridad, keepalives del watchdog de arcade), y un
puñado de utilidades del original que resultaron ser shims de flujo de
trabajo de desarrollo obsoletos, sin un caso de uso moderno.
