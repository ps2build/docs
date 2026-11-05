# Graphics Synthesizer <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The Graphics Synthesizer (GS) is the PS2's graphics chip. It is a separate chip with its own
local video memory.

## Local memory

The GS has 4MB of eDRAM on-die, used for the frame buffer, the
z-buffer and the textures currently in use. The EE
**cannot read or write this memory directly**. Everything in GS memory (a texture upload, a cleared frame buffer, a triangle)
arrives as a command that the GS executes.

## GIF packets

Commands are packaged as **GIF packets** (GIF = Graphics
Interface): tagged data that the GS front end unpacks into register
writes and primitive draws. A packet is normally sent to the GS over
its own DMA channel (`DMA_CHANNEL_GIF`, channel 2; see
[DMA](/guide/architecture/dma)).

## Privileged registers

A few GS registers are memory-mapped into the EE's address space
(not through DMA) for things the CPU must access
synchronously: display timing, the current display buffer and
interrupt status. The addresses, from `ee_regs.h`:

| Register | Address | Purpose |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Output circuit config (which read circuits are active, alpha blending between them) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Video timing and sync mode |
| `GS_BGCOLOR` | `0x120000e0` | Background color when nothing else is drawn |
| `GS_CSR` | `0x12001000` | Control and status: VSync interrupt flag, current field, reset |

Everything else, including primitive type, vertex color, texture parameters,
alpha blend mode and the frame and z-buffer pointers, goes through
GIF packets.

## Drawing libraries

This SDK has two libraries for drawing.
**Do not use them together** in one project:

- **`gsKit`** - an immediate-mode-style API:
  build a primitive, then call a draw function. `gskit-toolkit` adds
  texture loading from `freetype` and `libpng`.
- **`ps2gl`** - an API similar to a small subset of OpenGL.

Both build GIF packets and
DMA them to the GS. Higher-level libraries built on one generally do not
work with the other.

## Frame buffer and z-buffer placement

Frame buffers, z-buffers and
textures must be placed at chosen offsets within
the 4MB and sized to fit. You manage this budget yourself
(`gsKit` and `ps2gl` each have an allocator for it).

## See also

- [DMA](/guide/architecture/dma) - how packets reach the GS
- [Vector Units](/guide/architecture/vector-units) - VU1 usually builds
  the GIF packets
