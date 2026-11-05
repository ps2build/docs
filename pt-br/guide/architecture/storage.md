# Armazenamento <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O PS2 tem três dispositivos de armazenamento reais que um projeto
homebrew pode tocar - o disco, o cartão de memória, e (bem menos
comum hoje em dia) um disco rígido - e, como todo periférico até
agora, os três são alcançados através do IOP, nunca diretamente pela
EE. Cada um tem seu próprio driver de baixo nível mais uma camada de
sistema de arquivos construída em cima dele.

## O disco: CD/DVD

- **`cdvd`** (core) é a interface de baixo nível do lado EE para o
  drive - lendo setores brutos, status de bandeja/disco.
- **`cdvdfsv`** (core) é o servidor de **sistema de arquivos** de
  CD/DVD do lado IOP - a peça a nível ISO9660 que transforma setores
  brutos em arquivos e diretórios.
- **`cdfs`** (core) registra o dispositivo real `cdfs:` (construído
  sobre `cdvdman`, o driver IOP de baixo nível subjacente) através
  do qual seu programa abre arquivos.

Na prática: seu código lê arquivos via `cdfs:`/`cdvdfsv`, não
analisando setores ISO9660 ele mesmo.

## O cartão de memória

Fisicamente é um periférico SIO2 (veja
[Controles](/pt-br/guide/architecture/controllers)), mas seu trabalho
é armazenamento, então ele também tem sua própria camada de sistema
de arquivos:

- **`mc`** (core) é o cliente RPC do lado EE; **`mcman`** (core) é o
  driver IOP com o qual ele conversa - a mesma forma cliente/driver
  que `pad`/`padman`.
- **`mcserv`** (core) é um servidor de **sistema de arquivos** do
  lado IOP de nível mais alto em cima do `mcman` - a peça que entende
  a estrutura real de diretório/arquivo do cartão de memória, não só
  o acesso a setores brutos.
- **`fs-osd`**/**`hdd-osd`** (core) implementam **PFS** - o formato
  de sistema de arquivos real que o próprio navegador de saves da
  BIOS do PS2 usa. Esse é o formato que você quer se os dados de save
  precisam aparecer corretamente na própria tela de gerenciamento de
  cartão de memória do sistema, tanto em um cartão de memória real
  quanto (veja abaixo) no HDD.
- **`mmceman`** (world) é um target *emulador* de cartão de memória -
  útil quando você quer que os dados de save sejam mantidos por algo
  diferente de um cartão físico real (por exemplo durante o
  desenvolvimento), sem mudar como seu código de jogo conversa com
  `mc`.

## Disco rígido / dispositivos de bloco genéricos

O HDD do PS2 (uma unidade real mas de nicho no hardware de varejo,
mais comum em ambientes de desenvolvimento) e o armazenamento em
massa USB genérico compartilham uma camada diferente, já que nenhum
dos dois é um periférico SIO2:

- **`apa`** (core) é o gerenciador de partições **APA** - o esquema
  próprio de particionamento de disco do PS2, registrando `hdd0:`
  como dispositivo.
- **`bdm`** (core) é um gerenciador de dispositivo de bloco mais
  genérico - análise de tabela de partição MBR/GPT para coisas que
  não são formatadas em APA (um pendrive USB, por exemplo).
- **`bdmfs_fatfs`** (core) é um driver de sistema de arquivos
  FAT12/16/32 que fica em cima do `bdm` - a peça que faz um pendrive
  USB formatado em FAT simples ser de fato legível como arquivos.
- **`fs-osd`**/**`hdd-osd`** (os mesmos pacotes PFS de cima) também
  são o que você usaria para dados de save compatíveis com o
  navegador da BIOS vivendo no HDD em vez de em um cartão de memória.

## Veja também

- [Controles](/pt-br/guide/architecture/controllers) - o cartão de
  memória como dispositivo SIO2, não como sistema de arquivos
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão
  RPC por trás de `mc`/`cdvd`
