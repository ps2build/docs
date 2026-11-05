# DMA <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

Direct Memory Access (DMA) moves blocks of data between main RAM and
the PS2's other components without the EE copying them by hand. The
GS, VU1 and the IOP (over SIF) are outside the EE's memory, so DMA is how data reaches
them.

## Channels

The channels defined in `ee/dma/include/dma.h`:

| Channel | Value | Direction |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (or VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | The Image Processing Unit, which performs the MPEG2 decoding that `core/mpeg` wraps (see the [cheat sheet](/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (see [EE, IOP, and SIF](/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | A second EE↔IOP path, used less often than SIF0 and SIF1 |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM, a small, fast memory local to the EE |

## dmakit

A DMA transfer is described by a **DMA tag**: a small header with the source, the size, the
completion action and the next tag in the chain. `dmakit` (world) builds
tag chains, waits on completion and provides common transfer patterns.

## Concurrency

DMA transfers run **concurrently with the CPU**. A source buffer must not be modified or reused
until its transfer completes. The GS or VU receives the memory contents at the time the DMA engine
reads them, which can differ from the contents at the time of the call.

## See also

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer) -
  the GIF channel's destination
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the SIF
  channels' destination
- [Vector Units](/guide/architecture/vector-units) - the VIF0/VIF1
  channels' destination
