# Introduction to PS2 architecture <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The PS2 isn't one processor - it's several, each with its own memory
and its own job, talking to each other over a handful of narrow
bridges. Almost every oddity in how this SDK is organized (why a
"pad" package on the EE side has a separate "padman" package on the
IOP side, why `dmakit` exists at all, why sound and networking feel
like they're happening somewhere else) comes directly from this
hardware shape. This page is the map; the pages after it go one level
deeper into each piece.

## The two CPUs

**The Emotion Engine (EE)** is the main processor - a MIPS-based 128-bit
CPU with two attached **Vector Units** (VU0, tightly coupled to the EE
itself, and VU1, which mostly runs on its own feeding the GS). This is
where your game's logic, most of your `main()`, and any code you write
against `ee`/`ee_lib` targets in `ps2.yaml` runs.

**The IOP (I/O Processor)** is a second, much simpler MIPS CPU - a
descendant of the one inside the original PlayStation, in fact,
which is also why the PS2 can play PS1 discs. It doesn't run your
game logic; it runs a small kernel that loads relocatable modules
(**IRX** files - `.irx` is to the IOP roughly what `.elf` is to the
EE) and mediates access to almost every peripheral: the controller
ports, memory cards, the CD/DVD drive, the network adapter, sound.
This is what `iop`/`iop_lib` targets in `ps2.yaml` build for.

Why split the machine this way at all? Because none of those
peripherals are wired to the EE directly - they're all IOP-side
hardware, and the EE has to go through the IOP to reach any of them.
That single fact explains most of the SDK's package shape: a real,
working feature usually needs one package's worth of code running on
each processor, cooperating.

## The bridge: SIF

The EE and IOP don't share memory. The **SIF** (Sub-system InterFace)
is the hardware link between them, and PS2SDK's `sifman`/`sifcmd`
packages are the software built on top of it - an RPC mechanism
(remote procedure call) that lets EE code ask an IOP module to do
something and get a result back. See
[EE, IOP, and SIF](/guide/architecture/ee-iop-sif) for how this
actually looks in code, and why so many packages come in matched
EE-client/IOP-driver pairs (`pad`+`padman`, `mc`+`mcman`, `netman` on
the IOP side paired with `ps2ip` on the EE side).

## The graphics chip: GS

The **Graphics Synthesizer (GS)** is its own chip with its own local
video memory (eDRAM) - the EE cannot read or write GS memory directly
the way it can main RAM. Instead, the EE builds a stream of drawing
commands and register writes (a **GIF packet**) and hands it off,
almost always via **DMA** rather than the CPU copying it byte-by-byte.
See [Graphics Synthesizer](/guide/architecture/graphics-synthesizer).

## Moving data without the CPU: DMA

Because the EE, the GS, VU1, and the SIF link to the IOP are all
separate destinations, the PS2 has ten dedicated **DMA channels** to
move data between them while the CPU does something else entirely.
`dmakit` is this SDK's wrapper around building and queuing that work.
See [DMA](/guide/architecture/dma).

## Sound and storage: also IOP-side

**SPU2** (the sound chip) and the **CD/DVD drive** are both reached
through the IOP, the same way controllers and memory cards are - there
is no direct EE-to-SPU2 or EE-to-drive path. See
[Audio](/guide/architecture/audio) and
[Storage](/guide/architecture/storage).

## Networking: two competing architectures

The network adapter (DEV9/SMAP) is IOP-side hardware too, but this SDK
carries two different ways of exposing it - one where the actual
TCP/IP stack runs on the EE and the IOP just forwards packets
(`netman`+`ps2ip`), and one where the whole stack runs IOP-side
(`ps2ip-nm`+`smap-ps2ip`). They're not interchangeable and can't run at
once. See [Networking](/guide/architecture/networking).

## Where to go next

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer)
- [DMA](/guide/architecture/dma)
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif)
- [Vector Units](/guide/architecture/vector-units)
- [Audio](/guide/architecture/audio)
- [Controllers](/guide/architecture/controllers)
- [Storage](/guide/architecture/storage)
- [Networking](/guide/architecture/networking)
