# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> New page, compiled from community documentation and this SDK's own
> package source. Unlike the [PS2 architecture](/guide/architecture/introduction)
> section, most of it isn't checkable against this SDK's own source -
> treat it as a starting point, not gospel, and flag anything that
> looks wrong.

MMCE is a community protocol (and family of hardware) that makes a
memory card slot capable of far more than 8MB of saves. It's not part
of this SDK's own hardware model - it's an ecosystem convention this
SDK has a real, working driver for.

## What it actually is

A "smart" memory card - real hardware sitting in the memory card slot -
that emulates the standard memory card protocol over
[SIO2](/guide/architecture/controllers) while actually backing storage
with a microSD card. Two real implementations:

- **SD2PSX** - open source and open hardware (developer `@xyzz`;
  `sd2psxtd` is a popular extended firmware fork).
- **MemCard Pro 2** - a commercial product (8BitMods).

Because it's SD-card-backed, it holds effectively unlimited save data
instead of one memory card's worth - and because the SIO2 protocol
itself is emulated (not just the storage), a standard PS2 doesn't need
any special support to use one as a plain memory card.

A newer extension to the protocol goes further: the card can also serve
*game* data, not just saves, letting a loader like Open PS2 Loader boot
a full game directly off the card, switching between a
per-game "virtual" memory card and the actual game data as needed.

## This SDK's driver family

`sdk-world`'s `mmceman` package is really three separate IOP modules
built from the same real upstream source
(`ps2-mmce/mmceman` v2.1.1, MIT), each doing a different job:

| Package | IRX | Role |
|---|---|---|
| `mmceman` | `mmceman.irx` | The full driver - registers a real IOP filesystem device (`iomanX_AddDrv`-based). |
| `mmcedrv` | `mmcedrv.irx` | A minimal variant - just sector-level read/write/seek exports, no device registration. Meant for in-game use, once a loader has already switched the memory-card port into MMCE mode. |
| `mmceigr` | `mmceigr.irx` | The smallest of the three - a single-shot module that issues MMCE's **in-game reset (IGR)**, switching back to the boot memory card. No imported kernel functions at all - just inline SIO2 register access. |

Which one(s) you need depends on what your program is doing: a loader
that needs to browse/manage the card wants the full `mmceman`; a game
that just needs to read/write its own save data after a loader has
already done the switching wants the lighter `mmcedrv`; something that
needs to hand control back to the original memory card (returning to a
menu, for instance) wants `mmceigr`.

## See also

- [Controllers](/guide/architecture/controllers) - the SIO2 bus MMCE
  emulates on top of
- [Storage](/guide/architecture/storage) - the standard memory-card
  driver stack (`mc`/`mcman`/`mcserv`) MMCE is a drop-in alternative to
- [PSU](/guide/community/psu) - the file format community memory-card
  content gets packaged in, a separate concern from the hardware/
  protocol on this page
