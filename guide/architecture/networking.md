# Networking <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The network adapter (DEV9/SMAP hardware) is IOP-side, like the
other peripherals. The SDK has **two mutually exclusive
architectures** for using it.

## Architecture A: TCP/IP on the EE

- **`dev9`** (core) - the driver for the DEV9 expansion bay
  hardware the network adapter plugs into.
- **`smap`** (core, built in NETMAN mode) - the Ethernet
  PHY/MAC driver, IOP-side.
- **`netman`** (core) - an IOP-side network interface manager module
  that `smap` reports link status through, with an EE-side RPC client
  of the same name.
- **`ps2ip`** (core) - the TCP/IP stack (lwIP), running
  **on the EE**. Sockets, DHCP and DNS are EE-side code. `netman` and `smap`
  move raw frames on and off the wire.

To use it, embed `dev9`, `netman` and `smap`, and link `ps2ip` and `netman` on the EE.
Load the IOP modules, bring up DHCP with `ps2ip_setconfig()`, then use
`socket()`, `connect()`, `send()` and `recv()` from EE code.

::: warning POSIX aliases
`ps2ip`'s `lwipopts.h` disables the `close`, `read` and
`write` POSIX aliases (`LWIP_POSIX_SOCKETS_IO_NAMES` is off). Close a
socket with `lwip_close()`. A bare
`close()` does not compile. The aliases are disabled because those generic names would
otherwise shadow file I/O elsewhere in the program.
:::

## Architecture B: the whole stack on the IOP

- **`smap-ps2ip`** (core) - the same SMAP driver source as `smap`,
  built in a different mode (`SMAP_PS2IP=1` instead of
  `SMAP_NETMAN`). It talks to an IOP-resident lwIP stack directly
  instead of going through `netman`.
- **`ps2ip-nm`** (core) - a package separate from the EE-side
  `ps2ip`: the IOP-resident build of the same lwIP source. Nothing
  runs on the EE. Sockets, DHCP and the whole stack live on the IOP.
- IOP modules that need network access without the EE
  build on this. **`http`** (a read-only HTTP
  client filesystem driver that registers an `http:` device) is the
  example in this SDK.

**The two architectures cannot run at the same time.** `smap` and
`smap-ps2ip` both use the same NIC, so a program uses one or the
other.

The EE has no RPC path for bringing up DHCP in this architecture, as `netman` provides for architecture A.
The equivalent of `ps2ip_setconfig()` must run
on the IOP alongside the stack.

## Selection

| Requirement | Architecture |
|---|---|
| Sockets from EE code | A |
| Self-contained IOP module with network access and no EE involvement | B |

## See also

- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  that `netman`'s EE/IOP split follows
- [Controllers](/guide/architecture/controllers) and [Storage](/guide/architecture/storage) -
  other EE-client and IOP-driver pairs
