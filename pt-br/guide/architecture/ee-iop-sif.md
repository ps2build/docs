# EE, IOP e SIF <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O EE e o IOP não compartilham memória. A lógica do jogo roda no EE, e quase todos os periféricos só são
alcançáveis a partir do IOP. Esta página documenta o enlace entre eles.

## Módulos IOP

Um módulo IOP (`.irx`) é um programa separado com seu próprio
ponto de entrada (`_start`), carregado na memória do IOP pelo
kernel do IOP. Ele não é linkado no seu executável EE. Um target
`iop`/`iop_lib` do `ps2.yaml` compila um destes. O seu executável EE
e seus módulos IOP são binários separados que cooperam em tempo
de execução. Consequências:

- `embed_irx` existe. Ele embute um
  `.irx` auxiliar em um target `ee`, de modo que `ps2build build`
  produz um único `.elf` e você não distribui
  vários arquivos.
- muitos pacotes vêm em **pares**. Uma metade é uma biblioteca do lado EE
  que dá ao código do jogo uma função comum para chamar. A outra
  metade é o driver IOP com o qual essa função conversa por
  SIF. `pad`+`padman`, `mc`+`mcman`/`mcserv`, `netman` (lado IOP) emparelhado
  com `ps2ip` (lado EE) seguem esse padrão.

## SIF

O **SIF** (Sub-system InterFace) é o enlace de hardware entre os
dois processadores. É um canal estreito, sem memória compartilhada. Os pacotes
`sifman`/`sifcmd` deste SDK são a camada de software de RPC construída sobre
ele: `sifman` cuida da mecânica de baixo nível de init e transferência por DMA,
e `sifcmd` coloca por cima um protocolo de requisição/resposta para que o código EE
chame funções no estilo `sceSifCallRpc()` que bloqueiam até o módulo IOP
do outro lado responder.

Dois dos dez canais de DMA são dedicados a este enlace
(`DMA_CHANNEL_fromSIF0`/`DMA_CHANNEL_toSIF1` - veja
[DMA](/pt-br/guide/architecture/dma)), mais um terceiro menos comum
(`DMA_CHANNEL_SIF2`).

## Chamadas RPC e carregamento

Uma chamada RPC envia uma mensagem ao IOP e de volta e custa mais que uma chamada de função local.
Um módulo IOP precisa ser **carregado**
(`SifLoadModule` ou `SifExecModuleBuffer`, ou `embed_irx`, que o embute no
binário EE) antes que qualquer coisa possa chamá-lo. Linkar não basta.

## `patches` (`sbv`)

O pacote `patches` (diretório-fonte `sbv`, veja a
[folha de referência](/pt-br/guide/architecture/cheat-sheet)) existe porque alguns
recursos do IOP dos quais o SDK depende, como carregar um módulo a partir de um buffer
em memória em vez de um arquivo, não existem no kernel do IOP da BIOS
retail original. A maioria dos programas chama `sbv_patch_enable_lmb()` antes de qualquer outro trabalho com o IOP.
Ela corrige o kernel do IOP em execução para suportar `LoadModuleBuffer`.

## Veja também

- [DMA](/pt-br/guide/architecture/dma)
- [Introdução à arquitetura do PS2](/pt-br/guide/architecture/introduction)
