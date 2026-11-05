# Networking <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

The network adapter (DEV9/SMAP hardware) is IOP-side, same as
everything else so far - but networking is the one area of this SDK
where there are genuinely **two different, mutually-exclusive
architectures** for reaching it, not one clear layering. Picking the
wrong one for what you're doing is the most common way to get stuck
here.

## Architecture A: EE-side TCP/IP, IOP just forwards

- **`dev9`** (core) - the low-level driver for the DEV9 expansion bay
  hardware the network adapter plugs into.
- **`smap`** (core, built in "NETMAN mode") - the actual Ethernet
  PHY/MAC driver, IOP-side.
- **`netman`** (core) - an IOP-side network-*interface-manager* module
  that `smap` reports link status through, with an EE-side RPC client
  of the same name.
- **`ps2ip`** (core) - the real TCP/IP stack (a vendored lwIP), running
  **on the EE**. Sockets, DHCP, DNS - all EE-side code; `netman`/`smap`
  just get raw frames on and off the wire for it.

This is the architecture this SDK's own `scratch/nettest` smoke test
uses (embed `dev9`+`netman`+`smap`, link `ps2ip`+`netman` EE-side): load
the IOP modules, bring up DHCP through `ps2ip`'s own
`ps2ip_setconfig()`, then use normal-looking `socket()`/`connect()`/
`send()`/`recv()` calls from EE code.

::: warning One real, non-obvious catch
`ps2ip`'s own `lwipopts.h` deliberately disables the `close`/`read`/
`write` POSIX aliases (`LWIP_POSIX_SOCKETS_IO_NAMES` is off), so a
socket's real close function is `lwip_close()`, not `close()` - bare
`close()` won't compile. This is intentional: those generic names would
otherwise shadow real file I/O elsewhere in the same program.
:::

## Architecture B: the whole stack runs on the IOP

- **`smap-ps2ip`** (core) - the *same* SMAP driver source as `smap`
  above, built in a different mode (`SMAP_PS2IP=1` instead of
  `SMAP_NETMAN`) - it talks to an IOP-resident lwIP stack directly
  instead of going through `netman`.
- **`ps2ip-nm`** (core) - a genuinely separate package from EE-side
  `ps2ip`: the *IOP-resident* build of the same lwIP source. Nothing
  runs on the EE here - sockets, DHCP, the whole stack live on the IOP.
- IOP modules that want their own network access without EE
  involvement build directly on this - **`http`** (a read-only HTTP
  client filesystem driver that registers an `http:` device) is the
  real example in this SDK.

**These two architectures can't run at once** - `smap` and
`smap-ps2ip` both claim the same physical NIC, so it's one or the
other for a given running program.

Bringing up DHCP for this architecture has no established, RPC-exposed
path from the EE side the way `netman` provides for architecture A -
whatever calls `ps2ip_setconfig()`-equivalent config here has to run
directly on the IOP alongside the stack itself. This is genuinely less
traveled ground in this SDK than architecture A.

## Which one to use

If your game itself needs sockets (a lobby client, telemetry, an HTTP
call from game code) - architecture A. If you're writing (or reusing) a
self-contained IOP module that wants network access without exposing
anything to the EE - architecture B, and expect to do more of the
DHCP/bring-up work yourself.

## See also

- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  `netman`'s EE/IOP split follows
- [Controllers](/guide/architecture/controllers)/[Storage](/guide/architecture/storage) -
  other EE-client/IOP-driver pairs, for comparison
