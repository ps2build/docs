# Controllers <Badge type="warning" text="beta" />

> New, hand-written section - see the note on the [cheat sheet](/guide/architecture/cheat-sheet).

Every controller port peripheral - gamepads, multitaps, and (as far as
the hardware is concerned) memory cards too - shares one physical bus:
**SIO2**, a serial interface the IOP owns. This is another instance of
the pattern from [EE, IOP, and SIF](/guide/architecture/ee-iop-sif): an
EE-side client library, talking over SIF to an IOP driver, which is the
only thing actually touching hardware.

## One bus, several drivers on top

`sio2man` (core) is the IOP-side driver for the SIO2 bus itself - "no
more primitive path exists," in this SDK's own words. `padman`,
`mtapman` (multitap), and the memory-card drivers (see
[Storage](/guide/architecture/storage)) are all separate IOP modules
that sit on top of it, each owning one kind of device on that shared
bus. On the EE side, `pad`, `mtap`, and `mc` are the matching RPC
clients your game code actually calls.

| Device | EE-side client | IOP-side driver |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Memory card | `mc` | `mcman`/`mcserv` (see [Storage](/guide/architecture/storage)) |
| Keyboard | `kbd` | (its own IOP USB driver) |
| Infrared remote | `rm` | `rmman` |

`padman`/`mtapman`/the memory-card drivers get loaded automatically as
part of a normal EE program using `pad`/`mtap`/`mc` - you don't usually
load the IOP side by hand the way you might for a less common driver.

## USB devices are a separate path

Keyboards, mice, and USB storage don't go through SIO2 at all - they're
reached through the IOP's own USB stack (`usbd` and friends), a
completely separate hardware path from the controller ports. `kbd`'s
EE-side API looks similar to `pad`'s (RPC client to an IOP driver), but
underneath it's talking to USB IOP modules, not SIO2 ones.

## See also

- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  every one of these clients uses
- [Storage](/guide/architecture/storage) - memory cards as a storage
  device, not just a SIO2 peripheral
