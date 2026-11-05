# Cheat sheet <Badge type="warning" text="beta" />

> This section is in beta and has had limited review. If something looks wrong, please open an issue.
> [Introduction to PS2 architecture](/guide/architecture/introduction) describes the hardware each package targets.

Find the package for a task. `core/` packages are always
installed. `world/` packages and standalone repositories must be added to `libs:`. See [Packages](/guide/packages).

| I want to... | Reach for | Notes |
|---|---|---|
| Draw 2D/3D primitives | `gsKit` (tier: standalone) or `ps2gl` (standalone) | Two different APIs for the same GS. Do not use both at once. See [Graphics Synthesizer](/guide/architecture/graphics-synthesizer). |
| Move buffers to the GS/VU without stalling the CPU | `dmakit` (world) | Wraps DMA tags and chains. See [DMA](/guide/architecture/dma). |
| Do vector/matrix math | `math3d` (core), `ps2stuff` (standalone) | `math3d` is the base EE-side library; `ps2stuff` adds higher-level helpers. |
| Run code on VU1 | `gsKit`/`ps2gl`'s own VU microprograms, or hand-written VCL/VU asm | There is no general-purpose VU package. See [Vector Units](/guide/architecture/vector-units). |
| Play a sound effect / stream music | `libsd`, `libspu2` (core, low-level); `audio` (world, the high-level API); `libsnd2`, `rspu2drv`, `sdr` (world, format-specific) | See [Audio](/guide/architecture/audio). |
| Decode MP3 | `libmad` (world) | Pair with `audio` for playback. |
| Read a gamepad | `pad` (core, EE-side RPC client) + `padman` (core, IOP driver, loaded automatically) | See [Controllers](/guide/architecture/controllers). |
| Read/write a memory card | `mc` (core, EE client) + `mcman`/`mcserv` (core, IOP drivers) | Use `mmceman` (world) to target a memory card emulator. |
| Read a save-data-formatted memory card (PFS) | `fs-osd`/`hdd-osd` (core) | The PS2 save-game filesystem, also used on the HDD. |
| Read files off the disc | `cdvd`, `cdvdfsv`, `cdfs` (core) | See [Storage](/guide/architecture/storage). |
| Talk to the network | `netman` + `smap` (core, IOP) + `ps2ip` (core, EE-side lwIP) | See [Networking](/guide/architecture/networking), which also covers the IOP-resident `ps2ip-nm`/`smap-ps2ip` alternative. |
| Call from EE code into an IOP module | `sifman`/`sifcmd` (core) | The SIF/RPC bridge. See [EE, IOP, and SIF](/guide/architecture/ee-iop-sif). |
| Patch in an unsupported syscall (e.g. `LoadModuleBuffer`) | `patches` (core, source dir is named `sbv`) | `sbv_patch_enable_lmb()` is the one nearly every non-trivial program calls. |
| Load fonts | `freetype` (standalone) + `gskit-toolkit` (world, wires it into `gsKit`'s texture system) | |
| Load PNG/JPEG images | `libpng` (standalone), `libjpeg_ps2_addons`/`libjpeg-turbo` (world/standalone) | |
| Compress/decompress data | `zlib` (standalone), `unzip` (world) | |
| Hash data (MD5/SHA/CRC32) | `hash` (world) | Not PS2-specific. |
| Render ASCII-art graphics | `aalib` (world) | |
| Decode MPEG2 video | `mpeg` (core) | Accelerated by the IPU, DMAC and MMI. See [DMA](/guide/architecture/dma) for the IPU's two channels (`fromIPU`, `toIPU`). |
