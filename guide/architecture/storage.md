# Storage <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The PS2 has three real storage devices a homebrew project might touch
- the disc, the memory card, and (much less commonly today) a hard
disk - and, as with every peripheral so far, all three are reached
through the IOP, never directly from the EE. Each has its own
low-level driver plus a filesystem layer built on top of it.

## The disc: CD/DVD

- **`cdvd`** (core) is the low-level EE-side interface to the drive -
  reading raw sectors, tray/disc status.
- **`cdvdfsv`** (core) is the IOP-side CD/DVD **filesystem** server -
  the ISO9660-level piece that turns raw sectors into files and
  directories.
- **`cdfs`** (core) registers the actual `cdfs:` device (built on top
  of `cdvdman`, the underlying low-level IOP driver) that your program
  opens files through.

In practice: your code reads files via `cdfs:`/`cdvdfsv`, not by
parsing ISO9660 sectors itself.

## The memory card

Physically a SIO2 peripheral (see
[Controllers](/guide/architecture/controllers)), but its job is
storage, so it gets its own filesystem layer too:

- **`mc`** (core) is the EE-side RPC client; **`mcman`** (core) is the
  IOP driver it talks to - the same client/driver shape as `pad`/
  `padman`.
- **`mcserv`** (core) is a higher-level IOP-side **filesystem** server
  on top of `mcman` - the piece that understands the memory card's
  actual directory/file structure, not just raw sector access.
- **`fs-osd`**/**`hdd-osd`** (core) implement **PFS** - the real
  filesystem format the PS2 BIOS's own save-game browser uses. This is
  the format you want if save data needs to show up correctly in the
  system's own memory-card management screen, on both a real memory
  card and (see below) the HDD.
- **`mmceman`** (world) is a memory-card-*emulator* target - useful
  when you want save data backed by something other than a real
  physical card (e.g. during development), without changing how your
  game code talks to `mc`.

## Hard disk / generic block devices

The PS2's HDD (a real but niche unit for retail hardware, more common
in development setups) and generic USB mass storage share a different
layer, since neither is a SIO2 peripheral:

- **`apa`** (core) is the **APA** partition manager - the PS2's own
  disk-partitioning scheme, registering `hdd0:` as a device.
- **`bdm`** (core) is a more generic **block-device manager** -
  MBR/GPT partition table parsing for things that aren't APA-formatted
  (a USB drive, for instance).
- **`bdmfs_fatfs`** (core) is a FAT12/16/32 filesystem driver sitting
  on top of `bdm` - the piece that makes a plain FAT-formatted USB
  drive actually readable as files.
- **`fs-osd`**/**`hdd-osd`** (the same PFS packages as above) are also
  what you'd use for BIOS-browser-compatible save data living on the
  HDD instead of a memory card.

## See also

- [Controllers](/guide/architecture/controllers) - the memory card as
  a SIO2 device, not a filesystem
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  behind `mc`/`cdvd`
