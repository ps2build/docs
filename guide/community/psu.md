# PSU <Badge type="warning" text="beta" />

> This page is in beta. It is compiled from community documentation
> (the ps2savetools.com PSU format writeup), not this SDK's source. See the note
> on [MMCE](/guide/community/mmce). Please report anything that looks wrong,
> especially the byte offsets below, because community sources do not all agree on them.

**PSU** is the community's standard single-file format for exporting
and importing memory card content: a save, a homebrew app or a whole
folder structure bundled into one file. Most memory card managers
(uLaunchELF and others) move content in this format.

PSU is for **standard-format memory card** content, which uses the
same directory entry layout as an 8MB memory card. It is
separate from **PFS**, the filesystem that `fs-osd` and
`hdd-osd` implement for HDD and OSD-browser saves (see
[Storage](/guide/architecture/storage)). PSU is not used to export PFS content.

## What it bundles

A PSU packages a memory card folder as one file: the save data
or application files, the folder's `icon.sys` (so it keeps its
icon when unpacked onto a card) and
directory metadata such as timestamps. Unpacking a PSU onto a
memory card reproduces the folder as the memory card browser
expects it.

## Where it is used

- **Save transfers** - moving a save between a memory card, a PC
  and an [MMCE](/guide/community/mmce) SD card without the
  original hardware.
- **Homebrew distribution** - a homebrew app that lives on a memory
  card is commonly distributed as a PSU, so installing it means unpacking
  one file instead of recreating a folder structure.

## Format specification

A PSU is a flat concatenation of **entries**. A typical save's PSU is a directory entry
(carrying the file count), then required `.` and `..` entries, then one
entry per file.

### Entry layout

Each entry contains, in order:

1. A 32-byte header (below)
2. 32 bytes of zero padding
3. A 448-byte name field containing the entry's name, zero-padded
4. The file content (0 bytes for a directory, `.` or `..` entry)
5. Filler bytes that pad the content to a multiple of 1024 bytes

### The 32-byte header

| Bytes | Field |
|---|---|
| 0-1 | Type: `0x2784` for the directory, `.` and `..` entries, `0x9784` for a regular file, `0x27A0` for a protected or system save file |
| 5-8 | File count (directory entry) or file size in bytes (file entry), big-endian |
| 9-16 | Creation timestamp: seconds, minutes, hours, day, month and 2-byte year, in the PS2 memory card date format |
| 17-18 | Start sector of the content on the original memory card. Meaningless after export, because a PSU has no card layout |
| 25-31 | Last-modified timestamp, same layout as the creation timestamp |

All other header bytes are reserved. Community
documentation reports them as zero in every PSU observed.

### 1024-byte padding

Each entry's content is padded to a 1024-byte boundary, which matches the
cluster size of a standard-formatted PS2 memory card. This probably
makes writing a PSU back to a card a cluster-aligned copy. The source
for this page does not state the reason, so this is an inference.

## See also

- [MMCE](/guide/community/mmce) - a hardware-level community
  convention (this page covers a file format)
- [Storage](/guide/architecture/storage) - the SDK's memory card
  driver stack, and PFS, the separate HDD and OSD format
