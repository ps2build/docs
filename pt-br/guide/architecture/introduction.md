# Introdução à arquitetura do PS2 <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O PS2 tem vários processadores, cada um com sua própria memória, conectados por alguns
barramentos estreitos. Esta página os lista junto com os pacotes do SDK que visam cada um.
As páginas seguintes tratam de cada parte.

## CPUs

**O Emotion Engine (EE)** é o processador principal, uma CPU de 128 bits
baseada em MIPS com duas **Vector Units** conectadas (VU0, fortemente acoplada
ao próprio EE, e VU1, que roda quase sempre por conta própria alimentando o GS). É
aqui que roda a lógica do seu jogo, a maior parte do seu `main()` e qualquer código que você escreva
para os targets `ee`/`ee_lib` do `ps2.yaml`.

**O IOP (I/O Processor)** é uma segunda CPU MIPS, mais simples, derivada da do PlayStation original,
e é por isso que o PS2 lê discos de PS1. Ele não roda a
lógica do jogo. Roda um kernel pequeno que carrega módulos relocáveis
(arquivos **IRX** - `.irx` é para o IOP mais ou menos o que `.elf` é para o
EE) e intermedia o acesso a quase todos os periféricos: as portas de
controle, os cartões de memória, a unidade de CD/DVD, o adaptador de rede e o som.
É para isto que compilam os targets `iop`/`iop_lib` do `ps2.yaml`.

Nenhum desses periféricos está ligado ao EE. Todos são
hardware do lado do IOP, e o EE os alcança através do IOP.
Um recurso normalmente precisa de um pacote em cada processador.

## SIF

O EE e o IOP não compartilham memória. O **SIF** (Sub-system InterFace)
é o enlace de hardware entre eles, e os pacotes `sifman`/`sifcmd` do PS2SDK
são o software construído sobre ele - um mecanismo de RPC
(remote procedure call) que permite ao código EE pedir a um módulo IOP que
faça algo e receber um resultado. Veja
[EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) para ver como isso
aparece no código, e por que tantos pacotes vêm em pares
cliente EE/driver IOP (`pad`+`padman`, `mc`+`mcman`, `netman` no
lado IOP emparelhado com `ps2ip` no lado EE).

## GS

O **Graphics Synthesizer (GS)** é um chip próprio com sua própria
memória de vídeo local (eDRAM). O EE não pode ler nem escrever na memória do GS diretamente
como faz com a RAM principal. Em vez disso, o EE monta um fluxo de comandos de desenho
e escritas de registradores (um **pacote GIF**) e o entrega,
quase sempre por **DMA** em vez de copiá-lo com a CPU.
Veja [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer).

## DMA

Como o EE, o GS, a VU1 e o enlace SIF com o IOP são
destinos separados, o PS2 tem dez **canais de DMA** dedicados para
mover dados entre eles enquanto a CPU faz outro trabalho.
`dmakit` é o wrapper deste SDK para montar e enfileirar esse trabalho.
Veja [DMA](/pt-br/guide/architecture/dma).

## Som e armazenamento

O **SPU2** (o chip de som) e a **unidade de CD/DVD** são alcançados
através do IOP, como controles e cartões de memória. Não há
caminho direto do EE para o SPU2 nem para a unidade. Veja
[Áudio](/pt-br/guide/architecture/audio) e
[Armazenamento](/pt-br/guide/architecture/storage).

## Rede

O adaptador de rede (DEV9/SMAP) também é hardware do lado do IOP, mas este SDK
oferece duas formas de usá-lo: a pilha TCP/IP roda no EE e o IOP encaminha pacotes
(`netman`+`ps2ip`), ou a pilha inteira roda no IOP
(`ps2ip-nm`+`smap-ps2ip`). Elas não são intercambiáveis e não podem rodar ao
mesmo tempo. Veja [Rede](/pt-br/guide/architecture/networking).

## Próximas páginas

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer)
- [DMA](/pt-br/guide/architecture/dma)
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)
- [Vector Units](/pt-br/guide/architecture/vector-units)
- [Áudio](/pt-br/guide/architecture/audio)
- [Controles](/pt-br/guide/architecture/controllers)
- [Armazenamento](/pt-br/guide/architecture/storage)
- [Rede](/pt-br/guide/architecture/networking)
