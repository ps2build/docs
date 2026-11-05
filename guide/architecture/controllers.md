# Controllers <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

Controller port peripherals (gamepads, multitaps and memory cards) share one physical bus:
**SIO2**, a serial interface the IOP owns. They follow the pattern in
[EE, IOP, and SIF](/guide/architecture/ee-iop-sif): an
EE-side client library talks over SIF to an IOP driver, which is the
only code that accesses the hardware.

## SIO2 devices

`sio2man` (core) is the IOP-side driver for the SIO2 bus. `padman`,
`mtapman` (multitap), and the memory-card drivers (see
[Storage](/guide/architecture/storage)) are separate IOP modules
that sit on top of it, each owning one kind of device on the bus. On the EE side, `pad`, `mtap` and `mc` are the matching RPC
clients your game code calls.

| Device | EE-side client | IOP-side driver |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Memory card | `mc` | `mcman`/`mcserv` (see [Storage](/guide/architecture/storage)) |
| Keyboard | `kbd` | (its own IOP USB driver) |
| Infrared remote | `rm` | `rmman` |

`padman`/`mtapman`/the memory-card drivers are loaded automatically when an EE program uses `pad`, `mtap` or `mc`.

## USB devices

Keyboards, mice and USB storage do not use SIO2. They are
reached through the IOP's USB stack (`usbd` and related modules), a
separate hardware path from the controller ports. `kbd`'s
EE-side API resembles `pad`'s (an RPC client to an IOP driver), but
it talks to USB IOP modules.

## See also

- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - the RPC pattern
  every one of these clients uses
- [Storage](/guide/architecture/storage) - memory cards as storage
  devices
