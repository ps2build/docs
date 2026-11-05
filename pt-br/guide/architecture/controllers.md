# Controles <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

Todo periférico de porta de controle - gamepads, multitaps, e (no
que diz respeito ao hardware) cartões de memória também -
compartilham um único barramento físico: **SIO2**, uma interface
serial que pertence ao IOP. Essa é mais uma instância do padrão de
[EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif): uma biblioteca
cliente do lado EE, conversando via SIF com um driver IOP, que é a
única coisa que de fato toca o hardware.

## Um barramento, vários drivers em cima

`sio2man` (core) é o driver do lado IOP para o próprio barramento
SIO2 - "não existe caminho mais primitivo," nas próprias palavras
deste SDK. `padman`, `mtapman` (multitap), e os drivers de cartão de
memória (veja [Armazenamento](/pt-br/guide/architecture/storage)) são
todos módulos IOP separados que ficam em cima dele, cada um dono de
um tipo de dispositivo nesse barramento compartilhado. Do lado EE,
`pad`, `mtap`, e `mc` são os clientes RPC correspondentes que seu
código de jogo de fato chama.

| Dispositivo | Cliente do lado EE | Driver do lado IOP |
|---|---|---|
| Gamepad (DualShock2) | `pad` | `padman` |
| Multitap | `mtap` | `mtapman` |
| Cartão de memória | `mc` | `mcman`/`mcserv` (veja [Armazenamento](/pt-br/guide/architecture/storage)) |
| Teclado | `kbd` | (seu próprio driver USB do IOP) |
| Controle remoto infravermelho | `rm` | `rmman` |

`padman`/`mtapman`/os drivers de cartão de memória são carregados
automaticamente como parte de um programa EE normal usando
`pad`/`mtap`/`mc` - você normalmente não carrega o lado IOP à mão do
jeito que poderia fazer para um driver menos comum.

## Dispositivos USB são um caminho separado

Teclados, mouses, e armazenamento em massa USB não passam pelo SIO2
de forma alguma - são alcançados através da própria pilha USB do IOP
(`usbd` e companhia), um caminho de hardware completamente separado
das portas de controle. A API do lado EE do `kbd` parece com a do
`pad` (cliente RPC para um driver IOP), mas por baixo ela está
conversando com módulos IOP USB, não com módulos SIO2.

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão
  RPC que todo um desses clientes usa
- [Armazenamento](/pt-br/guide/architecture/storage) - o cartão de
  memória como dispositivo de armazenamento, não só como periférico
  SIO2
