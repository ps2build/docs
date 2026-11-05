# DMA <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

Direct Memory Access (DMA) moves blocks of data between main RAM and
the PS2's other components without the EE copying them by hand. Since
the GS, VU1, and the IOP (over SIF) are all separate destinations
outside the EE's own memory, DMA is how data actually gets to any of
them in a real program - not an optimization you bolt on later.

## Ten channels, one job each

This SDK's real, vendored channel list (`ee/dma/include/dma.h`):

| Channel | Value | Direction |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (or VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | The Image Processing Unit - the IPU is what actually does the MPEG2 decode work `core/mpeg` wraps (see the [cheat sheet](/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (see [EE, IOP, and SIF](/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | A second, separate EE↔IOP path (used less often than SIF0/1) |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM (a small, fast EE-local memory) |

The channel you use follows directly from where the data is going -
sending vertex/texture data to the GS means the GIF channel, sending an
RPC request to the IOP means a SIF channel, and so on. There's no
generic "DMA to anywhere" call.

## Why `dmakit` exists

Queuing a DMA transfer for real means building a **DMA tag** (a small
header describing the transfer - source, size, and what to do when
it's done or when to chain into the next tag) and writing it to the
right channel's registers. `dmakit` (world tier) wraps this: building
tag chains, waiting on completion, and the common patterns (send this
buffer, then this one, then interrupt me) instead of hand-rolling tag
bytes for every call site.

## Why this matters for how you structure code

Because DMA transfers run **concurrently with the CPU**, a real
program built around it looks different from one that just calls a
blocking "draw now" function: you queue work, do something else
(build the next frame's data, run game logic), and only synchronize
when you actually need the result or need to reuse a buffer the DMA
engine hasn't finished reading from yet. Reusing a source buffer before
its DMA transfer has actually completed is a classic PS2 bug - the
data the GS/VU ends up seeing is whatever was in memory at the moment
the DMA engine got to it, not at the moment you called the function.

## See also

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer) -
  the GIF channel's destination
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the SIF
  channels' destination
- [Vector Units](/guide/architecture/vector-units) - the VIF0/VIF1
  channels' destination
