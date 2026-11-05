# Cheat sheet <Badge type="warning" text="beta" />

> This whole architecture section is new and hand-written against real
> source, but hasn't had many eyes on it yet - if something here looks
> wrong, it might be. See [Introduction to PS2 architecture](/guide/architecture/introduction) for
> the version of this that explains *why*, not just *what*.

Jump straight to the package for a task. `core/` packages are always
installed; `world/` packages and standalone repos need `libs:`/adding
as a dependency - see [Packages](/guide/packages).

| I want to... | Reach for | Notes |
|---|---|---|
| Draw 2D/3D primitives | `gsKit` (tier: standalone) or `ps2gl` (standalone) | Two different-shaped APIs over the same GS - see [Graphics Synthesizer](/guide/architecture/graphics-synthesizer). Not both at once. |
| Move buffers to the GS/VU without stalling the CPU | `dmakit` (world) | Wraps DMA tags/chains - see [DMA](/guide/architecture/dma). |
| Do vector/matrix math | `math3d` (core), `ps2stuff` (standalone) | `math3d` is the base EE-side library; `ps2stuff` adds higher-level helpers. |
| Run code on VU1 | `gsKit`/`ps2gl`'s own VU microprograms, or hand-written VCL/VU asm | No general-purpose "VU package" - see [Vector Units](/guide/architecture/vector-units). |
| Play a sound effect / stream music | `libsd`, `libspu2` (core, low-level); `audio` (world, the easy path); `libsnd2`, `rspu2drv`, `sdr` (world, format-specific) | See [Audio](/guide/architecture/audio) for which layer to pick. |
| Decode MP3 | `libmad` (world) | Pair with `audio` for playback. |
| Read a gamepad | `pad` (core, EE-side RPC client) + `padman` (core, IOP driver, loaded automatically) | See [Controllers](/guide/architecture/controllers). |
| Read/write a memory card | `mc` (core, EE client) + `mcman`/`mcserv` (core, IOP drivers) | `mmceman` (world) if you want a memory-card-emulator target instead of real hardware. |
| Read a save-data-formatted memory card (PFS) | `fs-osd`/`hdd-osd` (core) | PS2's real save-game filesystem, also used on HDD. |
| Read files off the disc | `cdvd`, `cdvdfsv`, `cdfs` (core) | See [Storage](/guide/architecture/storage). |
| Talk to the network | `netman` + `smap` (core, IOP) + `ps2ip` (core, EE-side lwIP) | See [Networking](/guide/architecture/networking) - and the IOP-resident `ps2ip-nm`/`smap-ps2ip` alternative, a separate architecture. |
| Call from EE code into an IOP module | `sifman`/`sifcmd` (core) | The SIF/RPC bridge - see [EE, IOP, and SIF](/guide/architecture/ee-iop-sif). |
| Patch in an unsupported syscall (e.g. `LoadModuleBuffer`) | `patches` (core, source dir is named `sbv`) | `sbv_patch_enable_lmb()` is the one nearly every non-trivial program calls. |
| Load fonts | `freetype` (standalone) + `gskit-toolkit` (world, wires it into `gsKit`'s texture system) | |
| Load PNG/JPEG images | `libpng` (standalone), `libjpeg_ps2_addons`/`libjpeg-turbo` (world/standalone) | |
| Compress/decompress data | `zlib` (standalone), `unzip` (world) | |
| Hash data (MD5/SHA/CRC32) | `hash` (world) | Generic, not PS2-specific. |
| Render ASCII-art graphics | `aalib` (world) | |
| Decode MPEG2 video | `mpeg` (core) | IPU/DMAC/MMI-accelerated - see [DMA](/guide/architecture/dma) for the IPU's own two channels (`fromIPU`/`toIPU`). |
