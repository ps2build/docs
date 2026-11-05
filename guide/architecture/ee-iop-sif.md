# EE, IOP, and SIF <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The EE and the IOP do not share memory. Game logic runs on the EE, and almost every peripheral is
reachable only from the IOP. This page documents the link between them.

## IOP modules

An IOP module (`.irx`) is a separate program with its own
entry point (`_start`), loaded into the IOP's memory by the IOP's
kernel. It is not linked into your EE executable. A
`ps2.yaml` `iop`/`iop_lib` target builds one of these. Your EE
executable and its IOP modules are separate
binaries that cooperate at runtime. Consequences:

- `embed_irx` exists. It bundles a
  companion `.irx` into an `ee` target, so `ps2build build`
  produces one `.elf` and you do not ship
  multiple files.
- many packages come in **pairs**. One half is an EE-side library
  that gives your game code an ordinary function to call. The other
  half is the IOP driver that function talks to over
  SIF. `pad`+`padman`, `mc`+`mcman`/`mcserv`, `netman` (IOP side) paired
  with `ps2ip` (EE side) all follow this pattern.

## SIF

**SIF** (Sub-system InterFace) is the hardware link between the
two processors. It is a narrow channel with no shared memory. This
SDK's `sifman`/`sifcmd` packages are the software RPC layer built on
top of it: `sifman` handles the low-level init/DMA-transfer mechanics,
`sifcmd` layers a request/response RPC protocol over that so EE code
can call `sceSifCallRpc()`-style functions that block until the IOP
module on the other end replies.

Two of the ten DMA channels are dedicated to this link
(`DMA_CHANNEL_fromSIF0`/`DMA_CHANNEL_toSIF1` - see
[DMA](/guide/architecture/dma)), plus a less-common third
(`DMA_CHANNEL_SIF2`).

## RPC calls and loading

An RPC call sends a message to the IOP and back and costs more than a local function call.
An IOP module must be **loaded**
(`SifLoadModule` or `SifExecModuleBuffer`, or `embed_irx`, which bundles it into
the EE binary) before anything can call into it. Linking is not enough.

## `patches` (`sbv`)

The `patches` package (source directory `sbv`, see the
[cheat sheet](/guide/architecture/cheat-sheet)) exists because some IOP
features the SDK relies on, such as loading a module from an in-memory
buffer instead of a file, are missing from the original retail
BIOS's IOP kernel. Most programs call `sbv_patch_enable_lmb()` before any other IOP work.
It patches the running IOP kernel to support `LoadModuleBuffer`.

## See also

- [DMA](/guide/architecture/dma)
- [Introduction to PS2 architecture](/guide/architecture/introduction)
