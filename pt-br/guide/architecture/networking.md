# Rede <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O adaptador de rede (hardware DEV9/SMAP) é do lado IOP, assim como
tudo mais até agora - mas rede é a única área deste SDK onde
genuinamente existem **duas arquiteturas diferentes e mutuamente
exclusivas** para alcançá-lo, não uma camada única e clara. Escolher
a errada para o que você está fazendo é a forma mais comum de ficar
travado aqui.

## Arquitetura A: TCP/IP do lado EE, o IOP só encaminha

- **`dev9`** (core) - o driver de baixo nível para o hardware da
  baía de expansão DEV9 na qual o adaptador de rede se conecta.
- **`smap`** (core, compilado em "modo NETMAN") - o driver PHY/MAC
  Ethernet de fato, do lado IOP.
- **`netman`** (core) - um módulo gerenciador de *interface de rede*
  do lado IOP através do qual o `smap` reporta o status do link, com
  um cliente RPC do lado EE de mesmo nome.
- **`ps2ip`** (core) - a pilha TCP/IP de fato (um lwIP embutido),
  rodando **na EE**. Sockets, DHCP, DNS - tudo código do lado EE;
  `netman`/`smap` só colocam e tiram frames brutos do cabo para ela.

Essa é a arquitetura que o próprio teste de fumaça `scratch/nettest`
deste SDK usa (embute `dev9`+`netman`+`smap`, linka
`ps2ip`+`netman` do lado EE): carrega os módulos IOP, sobe o DHCP
através do próprio `ps2ip_setconfig()` do `ps2ip`, depois usa
chamadas `socket()`/`connect()`/`send()`/`recv()` de aparência normal
a partir de código EE.

::: warning Uma pegadinha real e não óbvia
O próprio `lwipopts.h` do `ps2ip` desabilita deliberadamente os
aliases POSIX `close`/`read`/`write`
(`LWIP_POSIX_SOCKETS_IO_NAMES` está desligado), então a função real de
fechar um socket é `lwip_close()`, não `close()` - um `close()` puro
não vai compilar. Isso é intencional: esses nomes genéricos, de outra
forma, sobrepairiam a E/S de arquivo real em outra parte do mesmo
programa.
:::

## Arquitetura B: a pilha inteira roda no IOP

- **`smap-ps2ip`** (core) - o *mesmo* código-fonte do driver SMAP que
  o `smap` acima, compilado em um modo diferente (`SMAP_PS2IP=1` em
  vez de `SMAP_NETMAN`) - ele conversa diretamente com uma pilha
  lwIP residente no IOP em vez de passar pelo `netman`.
- **`ps2ip-nm`** (core) - um pacote genuinamente separado do `ps2ip`
  do lado EE: a compilação *residente no IOP* do mesmo código-fonte
  lwIP. Nada roda na EE aqui - sockets, DHCP, a pilha inteira vive no
  IOP.
- Módulos IOP que querem seu próprio acesso de rede sem envolver a
  EE se constroem diretamente sobre isso - **`http`** (um driver de
  sistema de arquivos cliente HTTP somente leitura que registra um
  dispositivo `http:`) é o exemplo real neste SDK.

**Essas duas arquiteturas não podem rodar ao mesmo tempo** - `smap` e
`smap-ps2ip` ambas reivindicam a mesma placa de rede física, então é
uma ou outra para um dado programa em execução.

Subir o DHCP para essa arquitetura não tem um caminho estabelecido e
exposto por RPC a partir do lado EE do jeito que o `netman` fornece
para a arquitetura A - o que quer que chame o equivalente de
`ps2ip_setconfig()` aqui precisa rodar diretamente no IOP junto com a
própria pilha. Esse é um terreno genuinamente menos percorrido neste
SDK do que a arquitetura A.

## Qual usar

Se o seu próprio jogo precisa de sockets (um cliente de lobby,
telemetria, uma chamada HTTP a partir de código de jogo) -
arquitetura A. Se você está escrevendo (ou reusando) um módulo IOP
autocontido que quer acesso de rede sem expor nada à EE -
arquitetura B, e espere fazer mais do trabalho de DHCP/inicialização
você mesmo.

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão
  RPC que a divisão EE/IOP do `netman` segue
- [Controles](/pt-br/guide/architecture/controllers)/[Armazenamento](/pt-br/guide/architecture/storage) -
  outros pares cliente-EE/driver-IOP, para comparação
