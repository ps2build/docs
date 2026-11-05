# Migrando do ps2sdk original

Este SDK substitui o sistema de build e o layout de pacotes do original. Estas são as mudanças para projetos vindos do
[ps2dev/ps2sdk](https://github.com/ps2dev/ps2sdk) e
[ps2dev/ps2sdk-ports](https://github.com/ps2dev/ps2sdk-ports).

## Sistema de build: Makefile → `ps2.yaml`

`Makefile.pref`, `Makefile.eeglobal`, `Makefile.iopglobal` e os
`EE_CFLAGS`/`EE_LIBS`/`IOP_IMPORT_INCS` escritos à mão são substituídos por um
único `ps2.yaml` que descreve os targets de um projeto e os pacotes que cada
um precisa por nome.

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

`ps2build build` gera `build.ninja` e
`build/compile_commands.json`, e então executa o `ninja`. `libs:` resolve
as flags de include e de linkagem de cada pacote. Veja
[ps2.yaml](/pt-br/guide/ps2-yaml) para o formato completo e
[Primeiros passos](/pt-br/guide/getting-started) para o fluxo de trabalho.

## Árvore de pacotes: plana → por pacote

O original instala tudo em uma única árvore compartilhada
(`$PS2SDK/ee/include`, `$PS2SDK/ee/lib`, `$PS2SDK/iop/include`).
Aqui, cada pacote tem seu próprio diretório:

```
$PS2DEV/packages/core/<nome>/
$PS2DEV/packages/world/<nome>/
```

Cada um carrega seu próprio `package.yaml`, e `libs:` resolve um
pacote por esse nome de diretório. Veja [Pacotes](/pt-br/guide/packages) para a
resolução de headers e de linkagem e [Pacotes disponíveis](/pt-br/guide/available-packages)
para a lista de pacotes.

Não existe um único `$PS2SDK/ee/include`. Use `libs:`.

## O nome do pacote deve coincidir com o stem de `-l`

Nomeie o diretório com o valor passado para `-l`. Por exemplo, `zlib` é
`z` (`libz.a`, `-lz`), `aalib` é `aa`, `libmad` é `mad`, `libtap` é `tap`,
`libid3tag` é `id3tag` e `libjpeg-turbo` é `jpeg`. O `ps2build` deriva a flag de
linkagem a partir do nome em `libs:` e não lê o `package.yaml`
para obter o nome do archive.

## Camadas: `core` vs `world`

Todo pacote declara um `tier:`:

- **`core`** - código do ps2sdk (`origin: ps2sdk`) sob licença
  permissiva: kernel, drivers, sistema de arquivos, memória e rede.
- **`world`** - todo o resto: `ps2sdk-ports`, ports de terceiros,
  LGPL/GPL/BSD/MIT, sem restrição.

`core` exige `origin: ps2sdk` e licença permissiva. Um pacote que não cumpre uma das duas vai para `world`, incluindo alguns
módulos do ps2sdk original, como alguns módulos de variantes de BIOS.
`audsrv` (GPL) não está em nenhuma das camadas. Ele tem seu próprio repositório e é
instalado da mesma forma.

`common` é uma exceção. Seus headers estão no include
path de todo target, e `headers: [common]` não é aceito.

## Portando sua própria biblioteca

Veja [Pacotes personalizados](/pt-br/guide/custom-packages) para as duas formas
suportadas: envolver um build CMake existente contra o `ps2dev.cmake`, ou escrever um
`ps2.yaml` e um `package.yaml` nativos que espelhem a lista de objetos do seu
Makefile. Nos dois casos, `packages/world/<nome>/` é compactado e
publicado, e é instalado por nome como qualquer pacote `core` ou `world`.

## O que ainda não foi migrado

Esta lista não é exaustiva. Variantes de revisão de BIOS de nicho e ferramentas de
diagnóstico apenas para desenvolvimento ficam de fora. Um pacote ausente desta lista e de
[Pacotes disponíveis](/pt-br/guide/available-packages) ainda não foi migrado.

- **Utilitários auxiliares de `ee/mpeg`** - o decodificador acelerado por IPU (`mpeg`) está migrado; alguns arquivos auxiliares não.
- **Cliente HTTP do lado IOP** (`iop/fs/http`) - sua dependência de lwip
  (`ps2ip-nm`/`ps2ips-iop`) está migrada.
- **Codecs de áudio**: `vorbis`/`vorbisfile`/`ogg`, e `clearspu` (abaixo do
  `libspu2`, que está migrado).
- **`vmcman`** - um memory card virtual apoiado por um arquivo, para emulação e desenvolvimento.
- **Variantes de revisão de BIOS de DEV9/HDD/memory card e ferramentas de diagnóstico** -
  configurações alternativas de `apa`/`pfs`, `hdck`/`hdsk`/`fsck`/`fssk`. Baixa demanda.

**Fora de escopo:** hardware exclusivo de arcade (drivers de dongle e de chip de segurança,
keepalives do watchdog de arcade) e utilitários do original que são
shims legados de fluxo de desenvolvimento.
