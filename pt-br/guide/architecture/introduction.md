# Introdução à arquitetura do PS2 <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O PS2 não é um único processador - são vários, cada um com sua própria
memória e seu próprio trabalho, conversando entre si através de
alguns poucos elos estreitos. Quase toda estranheza em como este SDK
está organizado (por que um pacote "pad" do lado EE tem um pacote
"padman" separado do lado IOP, por que `dmakit` existe, por que som e
rede parecem acontecer em outro lugar) vem diretamente dessa forma de
hardware. Esta página é o mapa; as páginas seguintes vão um nível mais
fundo em cada peça.

## As duas CPUs

**A Emotion Engine (EE)** é o processador principal - uma CPU de
128 bits baseada em MIPS com duas **Vector Units** acopladas (VU0,
fortemente acoplada à própria EE, e VU1, que roda principalmente por
conta própria alimentando o GS). É aqui que roda a lógica do seu
jogo, a maior parte da sua `main()`, e qualquer código que você
escrever contra os targets `ee`/`ee_lib` no `ps2.yaml`.

**O IOP (I/O Processor)** é uma segunda CPU MIPS bem mais simples -
descendente da que vinha no PlayStation original, aliás, e é por isso
que o PS2 também consegue rodar discos de PS1. Ele não roda a lógica
do seu jogo; roda um pequeno kernel que carrega módulos realocáveis
(arquivos **IRX** - `.irx` está para o IOP mais ou menos como `.elf`
está para a EE) e faz a mediação do acesso a quase todo periférico:
as portas de controle, os cartões de memória, o drive de CD/DVD, o
adaptador de rede, o som. É para isso que compilam os targets
`iop`/`iop_lib` no `ps2.yaml`.

Por que dividir a máquina assim? Porque nenhum desses periféricos está
ligado diretamente à EE - todos são hardware do lado IOP, e a EE tem
que passar pelo IOP para alcançar qualquer um deles. Esse único fato
explica a maior parte da forma dos pacotes do SDK: uma funcionalidade
real e funcional normalmente precisa do equivalente a um pacote de
código rodando em cada processador, cooperando entre si.

## A ponte: SIF

A EE e o IOP não compartilham memória. O **SIF** (Sub-system
InterFace) é o elo de hardware entre eles, e os pacotes
`sifman`/`sifcmd` do PS2SDK são o software construído em cima dele -
um mecanismo RPC (remote procedure call) que permite que código da EE
peça a um módulo do IOP para fazer algo e receber um resultado de
volta. Veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) para
como isso realmente aparece em código, e por que tantos pacotes vêm em
pares EE-cliente/IOP-driver combinados (`pad`+`padman`,
`mc`+`mcman`, `netman` do lado IOP combinado com `ps2ip` do lado EE).

## O chip gráfico: GS

O **Graphics Synthesizer (GS)** é seu próprio chip com sua própria
memória de vídeo local (eDRAM) - a EE não consegue ler ou escrever a
memória do GS diretamente do jeito que consegue com a RAM principal.
Em vez disso, a EE monta um fluxo de comandos de desenho e escritas
de registrador (um **pacote GIF**) e o entrega, quase sempre via
**DMA** em vez da CPU copiá-lo byte a byte. Veja
[Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer).

## Movendo dados sem a CPU: DMA

Como a EE, o GS, a VU1, e o elo SIF com o IOP são todos destinos
separados, o PS2 tem dez **canais DMA** dedicados para mover dados
entre eles enquanto a CPU faz outra coisa completamente diferente.
`dmakit` é o wrapper deste SDK para construir e enfileirar esse
trabalho. Veja [DMA](/pt-br/guide/architecture/dma).

## Som e armazenamento: também do lado IOP

**SPU2** (o chip de som) e o drive de **CD/DVD** são ambos alcançados
através do IOP, do mesmo jeito que controles e cartões de memória -
não existe um caminho direto EE-para-SPU2 nem EE-para-drive. Veja
[Áudio](/pt-br/guide/architecture/audio) e
[Armazenamento](/pt-br/guide/architecture/storage).

## Rede: duas arquiteturas concorrentes

O adaptador de rede (DEV9/SMAP) também é hardware do lado IOP, mas
este SDK traz duas formas diferentes de expô-lo - uma onde a pilha
TCP/IP de verdade roda na EE e o IOP só encaminha pacotes
(`netman`+`ps2ip`), e outra onde a pilha inteira roda do lado IOP
(`ps2ip-nm`+`smap-ps2ip`). Elas não são intercambiáveis e não podem
rodar ao mesmo tempo. Veja [Rede](/pt-br/guide/architecture/networking).

## Para onde ir depois

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer)
- [DMA](/pt-br/guide/architecture/dma)
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)
- [Vector Units](/pt-br/guide/architecture/vector-units)
- [Áudio](/pt-br/guide/architecture/audio)
- [Controles](/pt-br/guide/architecture/controllers)
- [Armazenamento](/pt-br/guide/architecture/storage)
- [Rede](/pt-br/guide/architecture/networking)
