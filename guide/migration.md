# Migrating from upstream ps2sdk

This SDK is a from-scratch rewrite, not a fork you patch in place.
Here's what changes if you're coming from
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) and
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports).

## Build system: Makefile → `ps2.yaml`

`Makefile.pref`, `Makefile.eeglobal`, `Makefile.iopglobal`, and
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
`build/compile_commands.json`, then runs `ninja` - `libs:` resolves
each package's include/link flags automatically. See
[ps2.yaml](/guide/ps2-yaml) for the full format, and
[Getting started](/guide/getting-started) for the rest of the
workflow.

## Package tree: flat → per-package

Upstream installs everything into one shared tree -
`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include` - with
every package's headers and archives alongside each other. Here, each
package gets its own directory:

```
$PS2DEV/packages/core/<name>/
$PS2DEV/packages/world/<name>/
```

Each one carries its own `package.yaml`, and `libs:` resolves a
package by that directory name. See [Packages](/guide/packages) for
header/link resolution, and [Available packages](/guide/available-packages)
for what's installed.

There's no single `$PS2SDK/ee/include` to look in anymore - reach for
`libs:` instead.

## Package names must match the real `-l` stem

Name the directory whatever you'd pass to `-l`, not the project's own
name. `zlib` is `z` (`libz.a`, `-lz`), not `zlib`. Same for `aa` (not
`aalib`), `mad` (not `libmad`), `tap` (not `libtap`), `id3tag` (not
`libid3tag`), `jpeg` (not `libjpeg-turbo`). `ps2build` derives the link
flag from the literal name in `libs:` - it doesn't read `package.yaml`
to figure out the real archive name. Get the directory name right.

## Tiers: `core` vs `world`

Every package declares a `tier:`:

- **`core`** - real upstream ps2sdk (`origin: ps2sdk`), permissive
  license. Kernel, drivers, filesystem, memory, networking - the base
  every project builds on.
- **`world`** - everything else: `ps2sdk-ports`, third-party ports,
  LGPL/GPL/BSD/MIT, no restriction.

`core` needs both `origin: ps2sdk` and a permissive license - without
both, it goes to `world`, even when it's technically upstream ps2sdk (a
few BIOS-variant modules land in `world` for exactly this reason).
`audsrv` (GPL) isn't in either tier - it's kept in its own repo,
installed the same way, never committed alongside the rest.

`common` is the one exception: its headers are always on the include
path, for every target, unconditionally. You'll never write
`headers: [common]` - it isn't needed, and it isn't accepted.

## Porting your own library

See [Custom packages](/guide/custom-packages) for the two supported
shapes: wrap an existing CMake build against `ps2dev.cmake`, or write a
native `ps2.yaml` + `package.yaml` mirroring your old Makefile's object
list. Either way, `packages/world/<name>/` is what gets zipped and
released - installable by name like anything else in `core`/`world`.

## What's not migrated yet

This isn't exhaustive - niche BIOS-revision variants and dev-only
diagnostic tools are left out on purpose. If something's missing both
here and from [Available packages](/guide/available-packages), it just
hasn't been looked at yet.

- **`ee/mpeg`'s sibling utilities** - the decoder (`mpeg`) is real and
  IPU-hardware-accelerated; a couple of adjacent helper files aren't in.
- **IOP-side HTTP client** (`iop/fs/http`) - its lwip dependency
  (`ps2ip-nm`/`ps2ips-iop`) is migrated, so this is unblocked, just not
  done yet.
- **Audio codecs**: `vorbis`/`vorbisfile`/`ogg`, and `clearspu` (below
  `libspu2`, which is migrated).
- **`vmcman`** - a virtual memory card backed by a file instead of real
  hardware, useful for emulation/dev.
- **DEV9/HDD/memory-card BIOS-revision variants and diagnostic tools** -
  alternate `apa`/`pfs` configs, `hdck`/`hdsk`/`fsck`/`fssk`. Real
  upstream, low demand in practice.

**Out of scope**, not gaps: arcade-only hardware (dongle/security-chip
drivers, arcade watchdog keepalives), and a few upstream utilities that
turned out to be legacy dev-workflow shims with no modern use case.
