# Vector Units <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The EE has two attached **Vector Units** - VU0 and VU1 - small,
specialized processors built for exactly the kind of math a 3D game
needs a lot of: vector/matrix arithmetic, run in a tight loop, many
times per frame.

## Two units, two different relationships to the EE

**VU0** sits close to the EE and can run in one of two modes: as a
tightly-coupled macro/micro coprocessor the EE can issue instructions
to almost like an extension of its own pipeline, or running its own
independent microprogram. It's commonly used for per-vertex math the
main CPU would otherwise have to do itself - skinning, lighting terms,
that kind of per-object work - interleaved with regular EE code.

**VU1** is more independent - it typically runs its own microprogram
continuously, fed a stream of vertex/matrix data over
`DMA_CHANNEL_VIF1`, and its most common job is exactly the one
described in [Graphics Synthesizer](/guide/architecture/graphics-synthesizer):
transforming vertices and building the GIF packet that goes to the GS,
so the EE doesn't have to do that packet-building work itself and can
move on to the next frame's logic while VU1 keeps working.

## No general-purpose "VU package"

Unlike, say, audio or networking, there's no single library in this
SDK that wraps "the VUs" as a general facility - `math3d` (core) is
EE-side vector/matrix math, not VU microcode. Real VU programs in this
ecosystem show up as:

- Hand-written VU assembly or VCL (a VU-targeting compiler) source,
  compiled separately and embedded/loaded like any other binary blob.
- Pre-built microprograms bundled inside a higher-level library -
  `gsKit`/`ps2gl` each carry their own VU1 transform-and-build-packet
  microprogram as an implementation detail of "draw this," not
  something you write yourself unless you're replacing their pipeline.

If a project needs custom VU code (a bespoke particle system, a
non-standard vertex pipeline), that's genuinely lower-level work than
reaching for an existing package - closer to writing your own small
piece of `gsKit`/`ps2gl`'s job than consuming a library.

## See also

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer)
- [DMA](/guide/architecture/dma) - `VIF0`/`VIF1` are how data reaches
  VU0/VU1 in the first place
