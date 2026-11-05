# Storage <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The PS2 has three storage devices a homebrew project might use:
the disc, the memory card and the hard
disk (rarely used today). All three are reached
through the IOP. Each has a
low-level driver and a filesystem layer on top of it.

## Disc

- **`cdvd`** (core) is the low-level EE-side interface to the drive:
  raw sector reads and tray and disc status.
- **`cdvdfsv`** (core) is the IOP-side CD/DVD **filesystem** server,
  the ISO9660 layer that turns raw sectors into files and
  directories.
- **`cdfs`** (core) registers the `cdfs:` device (built on
  `cdvdman`, the low-level IOP driver) that your program
  opens files through.

## Memory card

The memory card is physically a SIO2 peripheral (see
[Controllers](/guide/architecture/controllers)), but it is used for
storage and has its own filesystem layer:

- **`mc`** (core) is the EE-side RPC client and **`mcman`** (core) is the
  IOP driver it talks to, the same client and driver pattern as `pad` and
  `padman`.
- **`mcserv`** (core) is a higher-level IOP-side **filesystem** server
  on top of `mcman`. It understands the memory card's
  directory and file structure, not only raw sector access.
- **`fs-osd`** and **`hdd-osd`** (core) implement **PFS**, the
  filesystem format used by the PS2 BIOS save-game browser. Required
  for save data to appear in the
  system's memory-card management screen, on a memory
  card or the HDD (see below).
- **`mmceman`** (world) targets a memory card emulator. It backs save data with something other than a physical
  card without changing the `mc` API.

## Hard disk and block devices

The HDD (rare on retail hardware, more common
in development setups) and USB mass storage share a different
layer, because neither is a SIO2 peripheral:

- **`apa`** (core) is the **APA** partition manager, the PS2's
  disk-partitioning scheme. It registers `hdd0:` as a device.
- **`bdm`** (core) is a **block-device manager**. It
  parses MBR and GPT partition tables for devices that are not APA-formatted,
  such as a USB drive.
- **`bdmfs_fatfs`** (core) is a FAT12/16/32 filesystem driver on top of
  `bdm`. It makes a FAT-formatted USB
  drive readable as files.
- **`fs-osd`** and **`hdd-osd`** (the same PFS packages as above) also
  provide BIOS-browser-compatible save data on the
  HDD.

## See also

- [Controllers](/guide/architecture/controllers) - the memory card as
  a SIO2 device
- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  behind `mc` and `cdvd`
