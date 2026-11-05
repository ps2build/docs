# Controles <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

Cada periférico del puerto de control - gamepads, multitaps, y (en lo
que respecta al hardware) también las tarjetas de memoria - comparten
un solo bus físico: **SIO2**, una interfaz serial que pertenece al
IOP. Sigue el patrón de
[EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): una biblioteca
cliente del lado EE habla a través de SIF con un driver IOP, que
es el único que accede al hardware.

## Dispositivos SIO2

`sio2man` (core) es el driver del lado IOP para el bus SIO2.
`padman`, `mtapman` (multitap), y los drivers de tarjeta de memoria
(consulta [Almacenamiento](/es/guide/architecture/storage)) son
módulos IOP separados que se apoyan en él, y cada uno
se encarga de un tipo de dispositivo en ese bus. Del lado
EE, `pad`, `mtap`, y `mc` son los clientes RPC correspondientes que llama tu
código de juego.

| Dispositivo | Cliente del lado EE | Driver del lado IOP |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Tarjeta de memoria | `mc` | `mcman`/`mcserv` (consulta [Almacenamiento](/es/guide/architecture/storage)) |
| Teclado | `kbd` | (su propio driver USB del IOP) |
| Control remoto infrarrojo | `rm` | `rmman` |

`padman`/`mtapman`/los drivers de tarjeta de memoria se cargan
automáticamente en un programa EE que use
`pad`, `mtap` o `mc`.

## Dispositivos USB

Teclados, ratones, y almacenamiento masivo USB no pasan por SIO2.
Se alcanzan a través del stack USB del IOP (`usbd`
y módulos relacionados), una ruta de hardware separada de los
puertos de control. La API del lado EE de `kbd` se parece a la de
`pad` (cliente RPC a un driver IOP), pero por debajo usa
módulos IOP USB y no módulos SIO2.

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): el patrón RPC
  que usa cada cliente
- [Almacenamiento](/es/guide/architecture/storage): la tarjeta de
  memoria como dispositivo de almacenamiento
