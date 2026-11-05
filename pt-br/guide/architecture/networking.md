# Rede <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O adaptador de rede (hardware DEV9/SMAP) fica no lado do IOP, como os
demais periféricos. O SDK tem **duas arquiteturas
mutuamente exclusivas** para usá-lo.

## Arquitetura A: TCP/IP no EE

- **`dev9`** (core) - o driver do hardware da baia de expansão
  DEV9 na qual o adaptador de rede se conecta.
- **`smap`** (core, compilado no modo NETMAN) - o driver Ethernet
  PHY/MAC, do lado IOP.
- **`netman`** (core) - um módulo gerenciador de interface de rede do lado IOP
  por meio do qual o `smap` reporta o estado do enlace, com um cliente RPC do lado EE
  de mesmo nome.
- **`ps2ip`** (core) - a pilha TCP/IP (lwIP), rodando
  **no EE**. Sockets, DHCP e DNS são código do lado EE. `netman` e `smap`
  movem frames brutos de e para a rede.

Para usá-la, embuta `dev9`, `netman` e `smap`, e linke `ps2ip` e `netman` no EE.
Carregue os módulos IOP, suba o DHCP com `ps2ip_setconfig()` e então use
`socket()`, `connect()`, `send()` e `recv()` a partir do código EE.

::: warning Aliases POSIX
O `lwipopts.h` do `ps2ip` desabilita os aliases POSIX `close`, `read` e
`write` (`LWIP_POSIX_SOCKETS_IO_NAMES` está desligado). Feche um
socket com `lwip_close()`. Um `close()` simples
não compila. Os aliases são desabilitados porque esses nomes genéricos
ofuscariam a E/S de arquivos em outras partes do programa.
:::

## Arquitetura B: a pilha inteira no IOP

- **`smap-ps2ip`** (core) - o mesmo código-fonte do driver SMAP que o `smap`,
  compilado em outro modo (`SMAP_PS2IP=1` em vez de
  `SMAP_NETMAN`). Ele conversa diretamente com uma pilha lwIP residente no IOP,
  em vez de passar pelo `netman`.
- **`ps2ip-nm`** (core) - um pacote separado do `ps2ip`
  do lado EE: o build residente no IOP do mesmo código-fonte do lwIP. Nada
  roda no EE. Sockets, DHCP e a pilha inteira ficam no IOP.
- Módulos IOP que precisam de acesso à rede sem o EE
  são construídos sobre isto. O **`http`** (um driver de sistema de arquivos cliente
  HTTP somente leitura que registra um dispositivo `http:`) é o
  exemplo neste SDK.

**As duas arquiteturas não podem rodar ao mesmo tempo.** `smap` e
`smap-ps2ip` usam a mesma NIC, então um programa usa uma ou a
outra.

O EE não tem um caminho RPC para subir o DHCP nesta arquitetura, como o `netman` oferece na arquitetura A.
O equivalente de `ps2ip_setconfig()` precisa rodar
no IOP junto com a pilha.

## Seleção

| Requisito | Arquitetura |
|---|---|
| Sockets a partir de código EE | A |
| Módulo IOP autônomo com acesso à rede e sem envolvimento do EE | B |

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o padrão de RPC
  que a divisão EE/IOP do `netman` segue
- [Controles](/pt-br/guide/architecture/controllers) e [Armazenamento](/pt-br/guide/architecture/storage) -
  outros pares de cliente EE e driver IOP
