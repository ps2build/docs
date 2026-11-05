# Migrating from upstream ps2sdk

This SDK replaces the upstream build system and package layout. These are the changes for projects coming from
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) and
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports).

## Build system: Makefile → `ps2.yaml`

`Makefile.pref`, `Makefile.eeglobal`, `Makefile.iopglobal` and
hand-written `EE_CFLAGS`/`EE_LIBS`/`IOP_IMPORT_INCS` are replaced by a
single `ps2.yaml` describing a project's targets and the packages each
one needs by name.

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

`ps2build build` generates `build.ninja` and
`build/compile_commands.json`, then runs `ninja`. `libs:` resolves
each package's include and link flags. See
[ps2.yaml](/guide/ps2-yaml) for the full format and
[Getting started](/guide/getting-started) for the workflow.

## Package tree: flat → per-package

Upstream installs everything into one shared tree
(`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include`).
Here, each package has its own directory:

```
$PS2DEV/packages/core/<name>/
$PS2DEV/packages/world/<name>/
```

Each one carries its own `package.yaml`, and `libs:` resolves a
package by that directory name. See [Packages](/guide/packages) for
header and link resolution and [Available packages](/guide/available-packages)
for the package list.

There is no single `$PS2SDK/ee/include`. Use `libs:` instead.

## Package names must match the `-l` stem

Name the directory after the value passed to `-l`. For example, `zlib` is
`z` (`libz.a`, `-lz`), `aalib` is `aa`, `libmad` is `mad`, `libtap` is `tap`,
`libid3tag` is `id3tag` and `libjpeg-turbo` is `jpeg`. `ps2build` derives the link
flag from the name in `libs:` and does not read `package.yaml`
for the archive name.

## Tiers: `core` vs `world`

Every package declares a `tier:`:

- **`core`** - ps2sdk code (`origin: ps2sdk`) under a permissive
  license: kernel, drivers, filesystem, memory and networking.
- **`world`** - everything else: `ps2sdk-ports`, third-party ports,
  LGPL/GPL/BSD/MIT, no restriction.

`core` requires both `origin: ps2sdk` and a permissive license. A package missing either goes to `world`, including some
upstream ps2sdk modules such as a few BIOS-variant modules.
`audsrv` (GPL) is in neither tier. It has its own repository and is
installed the same way.

`common` is an exception. Its headers are on the include
path for every target, and `headers: [common]` is not accepted.

## Porting your own library

See [Custom packages](/guide/custom-packages) for the two supported
shapes: wrap an existing CMake build against `ps2dev.cmake`, or write a
native `ps2.yaml` and `package.yaml` that mirror your Makefile's object
list. In both cases `packages/world/<name>/` is zipped and
released, and installs by name like any `core` or `world` package.

## What's not migrated yet

This list is not exhaustive. Niche BIOS-revision variants and development-only
diagnostic tools are omitted. A package missing from both this list and
[Available packages](/guide/available-packages) has not been migrated.

- **`ee/mpeg` helper utilities** - the IPU-accelerated decoder (`mpeg`) is migrated; a few helper files are not.
- **IOP-side HTTP client** (`iop/fs/http`) - its lwip dependency
  (`ps2ip-nm`/`ps2ips-iop`) is migrated.
- **Audio codecs**: `vorbis`/`vorbisfile`/`ogg`, and `clearspu` (below
  `libspu2`, which is migrated).
- **`vmcman`** - a virtual memory card backed by a file, for emulation and development.
- **DEV9/HDD/memory-card BIOS-revision variants and diagnostic tools** -
  alternate `apa`/`pfs` configs, `hdck`/`hdsk`/`fsck`/`fssk`. Low demand.

**Out of scope:** arcade-only hardware (dongle and security-chip
drivers, arcade watchdog keepalives) and upstream utilities that
are legacy development-workflow shims.
