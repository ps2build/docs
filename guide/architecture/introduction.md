# Introduction to PS2 architecture <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The PS2 has several processors, each with its own memory, connected by a few narrow
buses. This page lists them and the SDK packages that target each.
The pages after it cover each part.

## CPUs

**The Emotion Engine (EE)** is the main processor, a MIPS-based 128-bit
CPU with two attached **Vector Units** (VU0, tightly coupled to the EE
itself, and VU1, which mostly runs on its own feeding the GS). This is
where your game's logic, most of your `main()`, and any code you write
against `ee`/`ee_lib` targets in `ps2.yaml` runs.

**The IOP (I/O Processor)** is a second, simpler MIPS CPU derived from the one in the original PlayStation,
which is how the PS2 plays PS1 discs. It does not run your
game logic. It runs a small kernel that loads relocatable modules
(**IRX** files - `.irx` is to the IOP roughly what `.elf` is to the
EE) and mediates access to almost every peripheral: the controller
ports, memory cards, the CD/DVD drive, the network adapter, sound.
This is what `iop`/`iop_lib` targets in `ps2.yaml` build for.

None of those peripherals are wired to the EE. They are all
IOP-side hardware, and the EE reaches them through the IOP.
A feature usually needs one package on each processor.

## SIF

The EE and IOP don't share memory. The **SIF** (Sub-system InterFace)
is the hardware link between them, and PS2SDK's `sifman`/`sifcmd`
packages are the software built on top of it - an RPC mechanism
(remote procedure call) that lets EE code ask an IOP module to do
something and get a result back. See
[EE, IOP, and SIF](/guide/architecture/ee-iop-sif) for how this
looks in code, and why so many packages come in matched
EE-client/IOP-driver pairs (`pad`+`padman`, `mc`+`mcman`, `netman` on
the IOP side paired with `ps2ip` on the EE side).

## GS

The **Graphics Synthesizer (GS)** is its own chip with its own local
video memory (eDRAM). The EE cannot read or write GS memory directly
as it can main RAM. Instead, the EE builds a stream of drawing
commands and register writes (a **GIF packet**) and hands it off,
almost always via **DMA** instead of copying it with the CPU.
See [Graphics Synthesizer](/guide/architecture/graphics-synthesizer).

## DMA

Because the EE, the GS, VU1, and the SIF link to the IOP are all
separate destinations, the PS2 has ten dedicated **DMA channels** to
move data between them while the CPU does other work.
`dmakit` is this SDK's wrapper around building and queuing that work.
See [DMA](/guide/architecture/dma).

## Sound and storage

**SPU2** (the sound chip) and the **CD/DVD drive** are both reached
through the IOP, like controllers and memory cards. There
is no direct path from the EE to SPU2 or the drive. See
[Audio](/guide/architecture/audio) and
[Storage](/guide/architecture/storage).

## Networking

The network adapter (DEV9/SMAP) is IOP-side hardware too, but this SDK
supports two ways of using it: the TCP/IP stack runs on the EE and the IOP forwards packets
(`netman`+`ps2ip`), or the whole stack runs on the IOP
(`ps2ip-nm`+`smap-ps2ip`). They are not interchangeable and cannot run at
the same time. See [Networking](/guide/architecture/networking).

## Where to go next

- [Graphics Synthesizer](/guide/architecture/graphics-synthesizer)
- [DMA](/guide/architecture/dma)
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif)
- [Vector Units](/guide/architecture/vector-units)
- [Audio](/guide/architecture/audio)
- [Controllers](/guide/architecture/controllers)
- [Storage](/guide/architecture/storage)
- [Networking](/guide/architecture/networking)
