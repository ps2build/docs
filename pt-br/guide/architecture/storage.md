# Armazenamento <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O PS2 tem três dispositivos de armazenamento que um projeto homebrew pode usar:
o disco, o cartão de memória e o disco rígido
(raramente usado hoje). Os três são alcançados
pelo IOP. Cada um tem um
driver de baixo nível e uma camada de sistema de arquivos por cima.

## Disco

- **`cdvd`** (core) é a interface de baixo nível do lado EE com a unidade:
  leituras brutas de setor e status da bandeja e do disco.
- **`cdvdfsv`** (core) é o servidor de **sistema de arquivos** de CD/DVD do lado IOP,
  a camada ISO9660 que transforma setores brutos em arquivos e
  diretórios.
- **`cdfs`** (core) registra o dispositivo `cdfs:` (construído sobre
  `cdvdman`, o driver IOP de baixo nível) por meio do qual o seu programa
  abre arquivos.

## Cartão de memória

O cartão de memória é fisicamente um periférico SIO2 (veja
[Controles](/pt-br/guide/architecture/controllers)), mas é usado para
armazenamento e tem sua própria camada de sistema de arquivos:

- **`mc`** (core) é o cliente RPC do lado EE e **`mcman`** (core) é o
  driver IOP com o qual ele conversa, o mesmo padrão de cliente e driver de `pad` e
  `padman`.
- **`mcserv`** (core) é um servidor de **sistema de arquivos** do lado IOP, de nível mais alto,
  sobre o `mcman`. Ele entende a estrutura de
  diretórios e arquivos do cartão de memória, não apenas o acesso bruto a setores.
- **`fs-osd`** e **`hdd-osd`** (core) implementam o **PFS**, o formato de
  sistema de arquivos usado pelo navegador de saves da BIOS do PS2. Necessário
  para que os dados de save apareçam na
  tela de gerenciamento de cartões de memória do sistema, em um cartão de memória
  ou no HDD (veja abaixo).
- **`mmceman`** (world) visa um emulador de cartão de memória. Ele sustenta os dados de save com algo diferente de um cartão
  físico sem mudar a API do `mc`.

## Disco rígido e dispositivos de bloco

O HDD (raro em hardware retail, mais comum
em ambientes de desenvolvimento) e o armazenamento em massa USB compartilham uma
camada diferente, porque nenhum dos dois é um periférico SIO2:

- **`apa`** (core) é o gerenciador de partições **APA**, o esquema de
  particionamento de disco do PS2. Ele registra `hdd0:` como dispositivo.
- **`bdm`** (core) é um **gerenciador de dispositivos de bloco**. Ele
  interpreta tabelas de partição MBR e GPT para dispositivos que não são formatados em APA,
  como um pen drive USB.
- **`bdmfs_fatfs`** (core) é um driver de sistema de arquivos FAT12/16/32 sobre o
  `bdm`. Ele torna um pen drive USB formatado em FAT legível
  como arquivos.
- **`fs-osd`** e **`hdd-osd`** (os mesmos pacotes PFS acima) também
  fornecem dados de save compatíveis com o navegador da BIOS no
  HDD.

## Veja também

- [Controles](/pt-br/guide/architecture/controllers) - o cartão de memória como
  dispositivo SIO2
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão de RPC
  por trás de `mc` e `cdvd`
