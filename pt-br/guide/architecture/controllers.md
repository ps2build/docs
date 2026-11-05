# Controles <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

Os periféricos das portas de controle (gamepads, multitaps e cartões de memória) compartilham um barramento físico:
o **SIO2**, uma interface serial controlada pelo IOP. Eles seguem o padrão de
[EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif): uma
biblioteca cliente do lado EE conversa por SIF com um driver IOP, que é o
único código que acessa o hardware.

## Dispositivos SIO2

`sio2man` (core) é o driver do lado IOP para o barramento SIO2. `padman`,
`mtapman` (multitap) e os drivers de cartão de memória (veja
[Armazenamento](/pt-br/guide/architecture/storage)) são módulos IOP separados
que ficam sobre ele, cada um responsável por um tipo de dispositivo no barramento. No lado EE, `pad`, `mtap` e `mc` são os clientes
RPC correspondentes que o código do seu jogo chama.

| Dispositivo | Cliente do lado EE | Driver do lado IOP |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Cartão de memória | `mc` | `mcman`/`mcserv` (veja [Armazenamento](/pt-br/guide/architecture/storage)) |
| Teclado | `kbd` | (seu próprio driver USB do IOP) |
| Controle remoto infravermelho | `rm` | `rmman` |

`padman`/`mtapman`/os drivers de cartão de memória são carregados automaticamente quando um programa EE usa `pad`, `mtap` ou `mc`.

## Dispositivos USB

Teclados, mouses e armazenamento USB não usam o SIO2. Eles são
alcançados pela pilha USB do IOP (`usbd` e módulos relacionados), um
caminho de hardware separado das portas de controle. A API do lado EE do `kbd`
lembra a do `pad` (um cliente RPC para um driver IOP), mas
conversa com módulos IOP de USB.

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão de RPC
  usado por todos esses clientes
- [Armazenamento](/pt-br/guide/architecture/storage) - cartões de memória como
  dispositivos de armazenamento
