# Controles <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

Cada periférico del puerto de control - gamepads, multitaps, y (en lo
que respecta al hardware) también las tarjetas de memoria - comparten
un solo bus físico: **SIO2**, una interfaz serial que pertenece al
IOP. Esta es otra instancia del patrón de
[EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): una biblioteca
cliente del lado EE, hablando a través de SIF con un driver IOP, que
es lo único que realmente toca el hardware.

## Un bus, varios drivers encima

`sio2man` (core) es el driver del lado IOP para el propio bus SIO2 -
"no existe una ruta más primitiva," en palabras de este mismo SDK.
`padman`, `mtapman` (multitap), y los drivers de tarjeta de memoria
(consulta [Almacenamiento](/es/guide/architecture/storage)) son todos
módulos IOP separados que se sientan encima de él, cada uno
propietario de un tipo de dispositivo en ese bus compartido. Del lado
EE, `pad`, `mtap`, y `mc` son los clientes RPC correspondientes que tu
código de juego realmente llama.

| Dispositivo | Cliente del lado EE | Driver del lado IOP |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Tarjeta de memoria | `mc` | `mcman`/`mcserv` (consulta [Almacenamiento](/es/guide/architecture/storage)) |
| Teclado | `kbd` | (su propio driver USB del IOP) |
| Control remoto infrarrojo | `rm` | `rmman` |

`padman`/`mtapman`/los drivers de tarjeta de memoria se cargan
automáticamente como parte de un programa EE normal que use
`pad`/`mtap`/`mc` - normalmente no cargas el lado IOP a mano como sí
podrías hacer para un driver menos común.

## Los dispositivos USB son una ruta separada

Teclados, ratones, y almacenamiento masivo USB no pasan por SIO2 en
absoluto - se alcanzan a través del propio stack USB del IOP (`usbd`
y compañía), una ruta de hardware completamente separada de los
puertos de control. La API del lado EE de `kbd` se parece a la de
`pad` (cliente RPC a un driver IOP), pero por debajo está hablando
con módulos IOP USB, no con módulos SIO2.

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - el patrón RPC
  que usa cada uno de estos clientes
- [Almacenamiento](/es/guide/architecture/storage) - la tarjeta de
  memoria como dispositivo de almacenamiento, no solo como periférico
  SIO2
