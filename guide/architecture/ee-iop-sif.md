# EE, IOP, and SIF <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

This is the split that shapes the whole SDK: your game logic runs on
one CPU (the EE), almost every peripheral is only reachable from a
second, separate CPU (the IOP), and the two don't share memory. This
page is about the bridge between them and what it means for how
packages are organized.

## Two independent programs, not one

An IOP module (`.irx`) is a genuinely separate program with its own
entry point (`_start`), loaded into the IOP's own memory by the IOP's
own tiny kernel - not a library linked into your EE executable. A
`ps2.yaml` `iop`/`iop_lib` target builds one of these. Your EE
executable and whatever IOP modules it needs are two (or more) separate
binaries that end up cooperating at runtime, which is why:

- `embed_irx` exists at all - it's how an `ee` target bundles a
  companion `.irx`'s bytes into itself, so a single `ps2build build`
  produces one self-contained `.elf` instead of you having to ship
  multiple files.
- so many packages come in **pairs** - one half is an EE-side library
  giving your game code a normal-looking function to call, the other
  half is the actual IOP-resident driver that function talks to over
  SIF. `pad`+`padman`, `mc`+`mcman`/`mcserv`, `netman` (IOP side) paired
  with `ps2ip` (EE side) are all this same shape.

## SIF: the only path between them

**SIF** (Sub-system InterFace) is the real hardware link connecting the
two processors - a narrow channel, not a shared-memory window. This
SDK's `sifman`/`sifcmd` packages are the software RPC layer built on
top of it: `sifman` handles the low-level init/DMA-transfer mechanics,
`sifcmd` layers a request/response RPC protocol over that so EE code
can call `sceSifCallRpc()`-style functions that block until the IOP
module on the other end replies.

Two of the ten DMA channels are dedicated to this link
(`DMA_CHANNEL_fromSIF0`/`DMA_CHANNEL_toSIF1` - see
[DMA](/guide/architecture/dma)), plus a less-common third
(`DMA_CHANNEL_SIF2`).

## What this costs you

An RPC call to the IOP is not free the way a normal function call is -
it's a real message crossing to a different CPU and back, so code
tends to batch requests rather than call across SIF in a tight loop.
This is also why a fresh IOP module has to actually be **loaded**
(`SifLoadModule`/`SifExecModuleBuffer`, or `embed_irx` baking it into
the EE binary for the same effect) before anything can RPC into it -
unlike an EE-side library, there's no "just link it and it's there."

## `patches`/`sbv`: patching around old assumptions

The `patches` package (source directory named `sbv`, see the
[cheat sheet](/guide/architecture/cheat-sheet)) exists because some IOP
syscalls the SDK relies on (like loading a module from an in-memory
buffer rather than a file path) weren't part of the original retail
BIOS's IOP kernel. `sbv_patch_enable_lmb()` is the one almost every
non-trivial program calls before doing anything else IOP-related - it
patches the running IOP kernel to support `LoadModuleBuffer`.

## See also

- [DMA](/guide/architecture/dma)
- [Introduction to PS2 architecture](/guide/architecture/introduction)
