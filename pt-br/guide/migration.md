# Migrando do ps2sdk original

Este SDK é uma reescrita do zero, não um fork que você aplica patches
por cima. Aqui está o que muda se você vem do
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) e
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports)
originais.

## O sistema de build: Makefile → `ps2.yaml`

`Makefile.pref`, `Makefile.eeglobal`, `Makefile.iopglobal`, e os
`EE_CFLAGS`/`EE_LIBS`/`IOP_IMPORT_INCS` escritos à mão são substituídos
por um único `ps2.yaml` descrevendo os targets de um projeto e os
pacotes que cada um precisa por nome.

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

`ps2build build` gera `build.ninja` e `build/compile_commands.json`, e
então invoca o `ninja` - `libs:` resolve as flags de include/linkagem
de cada pacote automaticamente. Veja [ps2.yaml](/pt-br/guide/ps2-yaml)
para o formato completo, e
[Primeiros passos](/pt-br/guide/getting-started) para o resto do
workflow.

## A árvore de pacotes: plana → por pacote

O original instala tudo em uma única árvore compartilhada -
`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include` - com os
headers e archives de todo pacote lado a lado. Aqui, cada pacote ganha
seu próprio diretório:

```
$PS2DEV/packages/core/<nome>/
$PS2DEV/packages/world/<nome>/
```

Cada um carrega seu próprio `package.yaml`, e `libs:` resolve um
pacote por esse nome de diretório. Veja [Pacotes](/pt-br/guide/packages)
para como headers e ordem de linkagem são resolvidos, e
[Pacotes disponíveis](/pt-br/guide/available-packages) para o que está
instalado.

Não existe mais um único `$PS2SDK/ee/include` para procurar - use
`libs:` em vez disso.

## O nome de um pacote precisa bater com seu stem real de `-l`

Nomeie o diretório com o que você passaria para `-l`, não com o nome
do próprio projeto. `zlib` é `z` (`libz.a`, `-lz`), não `zlib`. O mesmo
para `aa` (não `aalib`), `mad` (não `libmad`), `tap` (não `libtap`),
`id3tag` (não `libid3tag`), `jpeg` (não `libjpeg-turbo`). O `ps2build`
deriva a flag de linkagem a partir do nome literal em `libs:` - ele não
lê o `package.yaml` para descobrir o nome real do archive. Garanta que
o nome do diretório esteja correto.

## Camadas (tiers): `core` vs `world`

Todo pacote declara um `tier:`:

- **`core`** - ps2sdk original real (`origin: ps2sdk`), licença
  permissiva. Kernel, drivers, sistema de arquivos, memória, rede - a
  base sobre a qual todo projeto é construído.
- **`world`** - todo o resto: `ps2sdk-ports`, ports de terceiros,
  LGPL/GPL/BSD/MIT, sem restrição.

`core` precisa tanto de `origin: ps2sdk` quanto de uma licença
permissiva - sem os dois, vai para `world`, mesmo que tecnicamente seja
parte do ps2sdk original (uma pequena quantidade de módulos de
variantes de BIOS ficam em `world` exatamente por essa razão).
`audsrv` (GPL) não está em nenhuma das camadas - ele é mantido em seu
próprio repositório, instalado da mesma forma, mas nunca commitado
junto com o resto.

`common` é a única exceção: seus headers estão sempre no include path,
para qualquer target, incondicionalmente. Você nunca vai escrever
`headers: [common]` - ele não precisa disso, e não é aceito.

## Portando sua própria biblioteca

Veja [Pacotes personalizados](/pt-br/guide/custom-packages) para as
duas formas suportadas: envolver um build CMake já existente contra o
`ps2dev.cmake`, ou escrever um par nativo `ps2.yaml` + `package.yaml`
espelhando a lista de objetos do seu Makefile antigo. De qualquer
forma, `packages/world/<nome>/` é o que é compactado e publicado em
uma release - instalável por nome igual a qualquer coisa em
`core`/`world`.

## O que ainda não foi migrado

Esta lista não é exaustiva - variantes de revisão de BIOS de nicho e
ferramentas de diagnóstico apenas para desenvolvimento ficam de fora de
propósito. Se algo está faltando tanto aqui quanto em
[Pacotes disponíveis](/pt-br/guide/available-packages), simplesmente
ainda não foi olhado.

- **Utilitários irmãos do `ee/mpeg`** - o decodificador (`mpeg`) é real
  e acelerado por hardware IPU; alguns arquivos auxiliares adjacentes
  não estão incluídos.
- **O cliente HTTP do lado IOP** (`iop/fs/http`) - sua dependência de
  lwip (`ps2ip-nm`/`ps2ips-iop`) está migrada, então isso já não está
  bloqueado, só falta ser feito.
- **Codecs de áudio**: `vorbis`/`vorbisfile`/`ogg`, e `clearspu`
  (abaixo do `libspu2`, que está migrado).
- **`vmcman`** - um memory card virtual apoiado por um arquivo em vez
  de hardware real, útil para emulação/desenvolvimento.
- **Variantes de revisão de BIOS e ferramentas de diagnóstico de
  DEV9/HDD/memory card** - configurações alternativas de `apa`/`pfs`,
  `hdck`/`hdsk`/`fsck`/`fssk`. Reais no original, baixa demanda na
  prática.

**Fora de escopo**, não lacunas: hardware exclusivo de arcade (drivers
de dongle/chip de segurança, keepalives do watchdog de arcade), e um
punhado de utilitários do original que se mostraram shims de workflow
de desenvolvimento legados, sem um caso de uso moderno.
