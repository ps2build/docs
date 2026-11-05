# Graphics Synthesizer <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The Graphics Synthesizer (GS) is the PS2's graphics chip - its own
silicon, with its own local video memory, sitting beside the EE rather
than inside it. Understanding that separation explains most of what
graphics code on the PS2 actually looks like.

## Local memory, not shared memory

The GS has 4MB of eDRAM on-die, used for the frame buffer, the
z-buffer, and every texture currently resident on the GPU. The EE
**cannot read or write this memory directly** - there's no pointer you
can dereference to poke a pixel. Everything that ends up in GS memory
(a texture upload, a cleared frame buffer, a triangle) arrives as a
command the GS itself executes.

## GIF packets: how commands reach the GS

Those commands are packaged as **GIF packets** (GIF = Graphics
Interface) - tagged data the GS's front end unpacks into register
writes and primitive draws. A packet is normally handed to the GS via
its own DMA channel (`DMA_CHANNEL_GIF`, channel 2 - see
[DMA](/guide/architecture/dma)) rather than written by the CPU one
word at a time, since that would stall the EE waiting on the GS to
keep up.

## Privileged registers

A handful of GS registers are memory-mapped directly into the EE's own
address space (not through DMA) for things the CPU needs to touch
synchronously - display timing, the current display buffer, and
interrupt status. Real addresses, from this SDK's own `ee_regs.h`:

| Register | Address | Purpose |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Output circuit config (which read circuit(s) are active, alpha blending between them) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Video timing/sync mode |
| `GS_BGCOLOR` | `0x120000e0` | Background color when nothing else is drawn |
| `GS_CSR` | `0x12001000` | Control/status - VSync interrupt flag, current field, reset |

Everything else - primitive type, vertex color, texture parameters,
alpha blend mode, the frame/z-buffer pointers themselves - goes through
GIF packets, not this direct-mapped set.

## Two APIs over the same chip

This SDK carries two different libraries for actually drawing things,
and they are **not meant to be used together** in one project:

- **`gsKit`** - the more traditional, immediate-mode-flavored API:
  build a primitive, call a draw function. `gskit-toolkit` extends it
  with texture loading from `freetype`/`libpng`.
- **`ps2gl`** - a different-shaped API, closer to a small OpenGL-alike.

Both ultimately do the same thing underneath - build GIF packets and
DMA them to the GS - they just disagree on what your code should look
like while doing it. Picking one over the other early matters, since
higher-level libraries built on top of either generally aren't
portable to the other.

## Where the frame/z-buffer actually live

Since GS memory isn't just "more RAM," frame buffers, z-buffers, and
textures all have to be explicitly placed at chosen offsets within
that 4MB, sized to fit - a real, finite budget you manage yourself
(`gsKit`/`ps2gl` both have their own allocator concept for this),
unlike main RAM where `malloc` hides the bookkeeping.

## See also

- [DMA](/guide/architecture/dma) - how packets actually get there
- [Vector Units](/guide/architecture/vector-units) - VU1 usually builds
  the GIF packets in the first place
