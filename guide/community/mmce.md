# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> This page is in beta. It is compiled from community documentation and
> the `mmceman` package source. Unlike the [PS2 architecture](/guide/architecture/introduction)
> section, most of it cannot be checked against this SDK's source.
> Please report anything that looks wrong.

MMCE is a community protocol and family of hardware that lets a
memory card slot hold far more than 8MB of saves. It is not
part of the PS2 hardware model. This
SDK includes a working driver for it.

## Overview

An MMCE card sits in the memory card slot and
emulates the standard memory card protocol over
[SIO2](/guide/architecture/controllers), storing data
on a microSD card. Two implementations:

- **SD2PSX** - open source and open hardware (developer `@xyzz`;
  `sd2psxtd` is a popular extended firmware fork).
- **MemCard Pro 2** - a commercial product (8BitMods).

Because the card is backed by SD storage, it holds far more save data
than one memory card. Because the SIO2 protocol
itself is emulated, a standard PS2 needs
no special support to use one as a memory card.

A newer protocol extension lets the card also serve
game data, so a loader such as Open PS2 Loader can boot
a game from the card, switching between a
per-game virtual memory card and the game data as needed.

## Drivers in this SDK

`sdk-world`'s `mmceman` package builds three IOP modules
from the same upstream source
(`ps2-mmce/mmceman` v2.1.1, MIT):

| Package | IRX | Role |
|---|---|---|
| `mmceman` | `mmceman.irx` | The full driver. Registers an IOP filesystem device (`iomanX_AddDrv`-based). |
| `mmcedrv` | `mmcedrv.irx` | A minimal variant with sector-level read, write and seek exports and no device registration. For in-game use after a loader has switched the memory card port into MMCE mode. |
| `mmceigr` | `mmceigr.irx` | The smallest module. It issues MMCE's **in-game reset (IGR)**, which switches back to the boot memory card. It imports no kernel functions and uses inline SIO2 register access. |

| Program | Module |
|---|---|
| Loader that browses and manages the card | `mmceman` |
| Game that reads and writes its own save data after a loader has switched modes | `mmcedrv` |
| Program that returns control to the original memory card | `mmceigr` |

## See also

- [Controllers](/guide/architecture/controllers) - the SIO2 bus that MMCE
  emulates
- [Storage](/guide/architecture/storage) - the standard memory card
  driver stack (`mc`, `mcman`, `mcserv`) that MMCE replaces
- [PSU](/guide/community/psu) - the file format for community memory card
  content, separate from the hardware and
  protocol on this page
