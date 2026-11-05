# Vector Units <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The EE has two attached **Vector Units**, VU0 and VU1. They are small
processors for vector and matrix arithmetic.

## VU0 and VU1

**VU0** sits close to the EE and runs in one of two modes: as a
tightly coupled coprocessor that the EE issues instructions
to like an extension of its own pipeline, or running its own
microprogram. It is commonly used for per-vertex and per-object math
such as skinning and lighting terms, interleaved with regular EE code.

**VU1** is more independent. It typically runs its own microprogram
continuously, fed vertex and matrix data over
`DMA_CHANNEL_VIF1`. Its usual job is described in
[Graphics Synthesizer](/guide/architecture/graphics-synthesizer):
it transforms vertices and builds the GIF packet for the GS,
so the EE can move on to the next frame's logic while VU1 works.

## VU programs

`math3d` (core) is EE-side vector and matrix math, not VU microcode.
VU programs in this SDK are:

- Hand-written VU assembly or VCL (a VU-targeting compiler) source,
  compiled separately and embedded or loaded like any other binary.
- Pre-built microprograms bundled in a higher-level library.
  `gsKit` and `ps2gl` each include a VU1 microprogram that transforms vertices and builds packets.

## See also

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer)
- [DMA](/guide/architecture/dma) - `VIF0` and `VIF1` carry data to
  VU0 and VU1
