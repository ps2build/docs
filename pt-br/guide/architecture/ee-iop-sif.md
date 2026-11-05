# EE, IOP e SIF <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

Essa é a divisão que molda todo o SDK: a lógica do seu jogo roda em
uma CPU (a EE), quase todo periférico só é alcançável a partir de uma
segunda CPU separada (o IOP), e as duas não compartilham memória.
Esta página é sobre a ponte entre elas e o que isso significa para
como os pacotes são organizados.

## Dois programas independentes, não um

Um módulo IOP (`.irx`) é um programa genuinamente separado com seu
próprio ponto de entrada (`_start`), carregado na própria memória do
IOP pelo pequeno kernel próprio do IOP - não é uma biblioteca
linkada dentro do seu executável EE. Um target `iop`/`iop_lib` do
`ps2.yaml` compila um desses. Seu executável EE e os módulos IOP que
ele precisar são dois (ou mais) binários separados que acabam
cooperando em tempo de execução, e é por isso que:

- `embed_irx` existe - é como um target `ee` empacota os bytes de um
  `.irx` companheiro dentro de si mesmo, então um único
  `ps2build build` produz um `.elf` autocontido em vez de você ter
  que distribuir múltiplos arquivos.
- tantos pacotes vêm em **pares** - uma metade é uma biblioteca do
  lado EE que dá ao seu código de jogo uma função de aparência normal
  para chamar, a outra metade é o driver residente no IOP com o qual
  essa função de fato conversa via SIF. `pad`+`padman`,
  `mc`+`mcman`/`mcserv`, `netman` (lado IOP) combinado com `ps2ip`
  (lado EE) têm todos essa mesma forma.

## SIF: o único caminho entre eles

**SIF** (Sub-system InterFace) é o elo de hardware real que conecta
os dois processadores - um canal estreito, não uma janela de memória
compartilhada. Os pacotes `sifman`/`sifcmd` deste SDK são a camada de
software RPC construída em cima dele: `sifman` cuida da mecânica de
baixo nível de inicialização/transferência DMA, `sifcmd` adiciona uma
camada de protocolo RPC de requisição/resposta sobre isso para que
código EE possa chamar funções com cara de `sceSifCallRpc()` que
bloqueiam até o módulo IOP do outro lado responder.

Dois dos dez canais DMA são dedicados a esse elo
(`DMA_CHANNEL_fromSIF0`/`DMA_CHANNEL_toSIF1` - veja
[DMA](/pt-br/guide/architecture/dma)), mais um terceiro menos comum
(`DMA_CHANNEL_SIF2`).

## O que isso custa a você

Uma chamada RPC para o IOP não é grátis como uma chamada de função
normal é - é uma mensagem real cruzando para outra CPU e voltando,
então o código tende a agrupar requisições em lote em vez de chamar
através do SIF em um loop apertado. É também por isso que um módulo
IOP novo realmente precisa ser **carregado**
(`SifLoadModule`/`SifExecModuleBuffer`, ou `embed_irx` embutindo ele
no binário EE para o mesmo efeito) antes que qualquer coisa possa
fazer RPC para dentro dele - diferente de uma biblioteca do lado EE,
não existe o "só linka e já está lá."

## `patches`/`sbv`: corrigindo suposições antigas

O pacote `patches` (diretório-fonte chamado `sbv`, veja a
[folha de referência](/pt-br/guide/architecture/cheat-sheet)) existe
porque algumas syscalls do IOP das quais o SDK depende (como carregar
um módulo a partir de um buffer em memória em vez de um caminho de
arquivo) não faziam parte do kernel IOP original da BIOS de varejo.
`sbv_patch_enable_lmb()` é a que quase todo programa não trivial
chama antes de fazer qualquer outra coisa relacionada ao IOP - ela
corrige o kernel IOP em execução para suportar `LoadModuleBuffer`.

## Veja também

- [DMA](/pt-br/guide/architecture/dma)
- [Introdução à arquitetura do PS2](/pt-br/guide/architecture/introduction)
