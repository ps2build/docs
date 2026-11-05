# PSU <Badge type="warning" text="beta" />

> New page, compiled from community documentation (ps2savetools.com's
> PSU format writeup) rather than this SDK's own source - see the note
> on [MMCE](/guide/community/mmce). Treat it as a starting point, flag
> anything that looks wrong, especially the exact byte offsets below -
> community sources don't all agree on them to the byte.

**PSU** is the community's standard single-file format for exporting
and importing memory-card content - a save, a homebrew app, or a whole
folder structure, bundled into one file instead of copying a raw
directory around. It's the format most memory-card managers
(uLaunchELF and others) actually move content in.

PSU is specifically for **standard-format memory card** content - the
same directory-entry shape a real 8MB memory card uses. It's a
different, separate thing from **PFS**, the filesystem `fs-osd`/
`hdd-osd` implement for HDD/OSD-browser saves (see
[Storage](/guide/architecture/storage)) - a PSU isn't how PFS content
gets exported.

## What it bundles

A PSU packages an entire memory-card folder as one file: the save data
or application files themselves, the folder's `icon.sys` (so it still
shows up with a proper icon when unpacked back onto a card), and
directory metadata like timestamps. That's what makes it a real export
format rather than just a zip of files - unpacking a PSU back onto a
memory card reproduces the folder exactly as the memory-card browser
expects to see it.

## Where you'll run into it

- **Save transfers** - moving a save between a real memory card, a PC,
  or an [MMCE](/guide/community/mmce) SD card, without needing the
  original hardware in the loop.
- **Homebrew distribution** - a homebrew app meant to live on a memory
  card is commonly distributed as a PSU, so installing it is "unpack
  this one file" rather than manually recreating a folder structure.

## Format specification

A PSU is a flat concatenation of **entries** - no filesystem tree
beyond that flat sequence. A typical save's PSU is: a directory entry
(carrying the file count), then required `.` and `..` entries, then one
entry per real file.

### Entry layout

Each entry, in order:

1. A 32-byte header (below)
2. 32 bytes of zero padding
3. A 448-byte name field - the entry's name, zero-padded
4. The file's actual content (0 bytes for a directory/`.`/`..` entry)
5. Filler bytes, padding the content out to a multiple of 1024 bytes

### The 32-byte header

| Bytes | Field |
|---|---|
| 0-1 | Type: `0x2784` for the directory/`.`/`..` entries, `0x9784` for a regular file, `0x27A0` for a protected/system save file |
| 5-8 | File count (on the directory entry) or file size in bytes (on a file entry), big-endian |
| 9-16 | Creation timestamp - seconds/minutes/hours/day/month/2-byte year, PS2 memory-card date format |
| 17-18 | Start sector the content would occupy on the *original* memory card - meaningless once exported, since a PSU has no card layout of its own |
| 25-31 | Last-modified timestamp, same layout as the creation timestamp |

Everything else in the header is reserved and, per community
documentation, never seen set to anything but zero in a real PSU.

### Why 1024-byte padding

Padding each entry's content to a 1024-byte boundary lines up with the
cluster size a standard-formatted PS2 memory card itself uses -
plausibly so that writing a PSU's content back onto a real card is a
straightforward cluster-aligned copy, not a reason stated outright in
the source this page draws from, so treat it as informed inference
rather than a confirmed fact.

## See also

- [MMCE](/guide/community/mmce) - a different, hardware-level community
  convention (this page is about *file format*, not storage hardware)
- [Storage](/guide/architecture/storage) - this SDK's own memory-card
  driver stack, and where PFS (the separate HDD/OSD format) is covered
