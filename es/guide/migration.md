# Migrando desde ps2sdk original

Este SDK reemplaza el sistema de build y la estructura de paquetes de upstream. Estos son los cambios para proyectos que vienen de
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) y
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports).

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
y luego invoca `ninja`. `libs:` resuelve automáticamente los flags de include y enlazado
de cada paquete. Consulta [ps2.yaml](/es/guide/ps2-yaml)
para el formato completo, y [Primeros pasos](/es/guide/getting-started)
para el resto del flujo de trabajo.

## El árbol de paquetes: plano → por paquete

El original instala todo en un único árbol compartido
(`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include`), con los
headers y archives de todos los paquetes juntos. Aquí cada
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

Ya no existe un único `$PS2SDK/ee/include`. Usa `libs:`.

## El nombre de un paquete debe coincidir con su stem de `-l`

Nombra el directorio como lo que pasarías a `-l`, y no como el nombre
del proyecto. `zlib` es `z` (`libz.a`, `-lz`). Lo
mismo para `aa` (no `aalib`), `mad` (no `libmad`), `tap` (no `libtap`),
`id3tag` (no `libid3tag`), `jpeg` (no `libjpeg-turbo`). `ps2build`
deriva el flag de enlazado del nombre literal en `libs:` y no lee el
`package.yaml` para obtener el nombre del archive.

## Niveles (tiers): `core` vs `world`

Cada paquete declara un `tier:`:

- **`core`** - ps2sdk original (`origin: ps2sdk`), licencia
  permisiva. Kernel, drivers, sistema de archivos, memoria y redes.
- **`world`** - todo lo demás: `ps2sdk-ports`, ports de terceros,
  LGPL/GPL/BSD/MIT, sin restricción.

`core` necesita `origin: ps2sdk` y una licencia permisiva.
Sin ambos, el paquete va a `world`, incluso si forma parte del ps2sdk
original (unos pocos módulos de variantes de BIOS quedan
en `world` por esta razón). `audsrv` no está en
ningún nivel: se mantiene en su propio repositorio y se instala igual.

`common` es la única excepción: sus headers siempre están en el
include path de cualquier target. `headers: [common]` no se necesita ni se acepta.

## Portear tu propia biblioteca

Consulta [Paquetes personalizados](/es/guide/custom-packages) para las
dos formas soportadas: envolver un build de CMake existente contra
`ps2dev.cmake`, o escribir un par nativo `ps2.yaml` + `package.yaml`
reflejando la lista de objetos de tu Makefile anterior. En ambos
casos, `packages/world/<nombre>/` es lo que se comprime y se publica en
un release, instalable por nombre como cualquier paquete de
`core` o `world`.

## Qué no está migrado todavía

Esta lista no es exhaustiva. Las variantes de revisión de BIOS poco comunes y las herramientas de diagnóstico solo para desarrollo se dejan
fuera a propósito. Si algo falta aquí y en
[Paquetes disponibles](/es/guide/available-packages), aún no se ha revisado.

- **Utilidades hermanas de `ee/mpeg`** - el decodificador (`mpeg`) usa
  aceleración por hardware IPU; un par de archivos auxiliares
  no están incluidos.
- **El cliente HTTP del lado IOP** (`iop/fs/http`) - su dependencia de
  lwip (`ps2ip-nm`/`ps2ips-iop`) está migrada, así que solo falta migrarlo.
- **Codecs de audio**: `vorbis`/`vorbisfile`/`ogg`, y `clearspu` (por
  debajo de `libspu2`, que sí está migrado).
- **`vmcman`** - una memory card virtual respaldada por un archivo
  en lugar de hardware, útil para emulación y desarrollo.
- **Variantes de revisión de BIOS y herramientas de diagnóstico de
  DEV9/HDD/memory card** - configuraciones alternativas de `apa`/`pfs`,
  `hdck`/`hdsk`/`fsck`/`fssk`. Presentes en el original, con poca demanda.

**Fuera de alcance**: hardware exclusivo de arcade (drivers
de dongle y chip de seguridad, keepalives del watchdog de arcade) y unas
pocas utilidades del original que son shims obsoletos de flujo de
desarrollo.
