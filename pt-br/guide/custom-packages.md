<script setup>
import customPkgs from '../../.vitepress/data/custom-packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Pacotes personalizados

`core` e `world` (veja [Pacotes disponíveis](/pt-br/guide/available-packages))
cobrem os pacotes que o `ps2build update` instala para você. Qualquer
outra coisa - uma biblioteca que você escreveu, ou um projeto de
terceiros que outra pessoa mantém - se instala como pacote `world` da
mesma forma.

## Instalando um

Baixe o zip da release do pacote e extraia em
`$PS2DEV/packages/world/<nome>/`, correspondendo ao `name:` que seu
`package.yaml` declara. Por exemplo, o zip de release do
[`ps2gl`](https://github.com/ps2build/ps2gl) extrai em
`$PS2DEV/packages/world/ps2gl/`. A partir daí ele é utilizável em
`libs:` igual a qualquer coisa de `core`/`world`.

## Empacotando uma biblioteca

Um pacote é um diretório no formato `packages/world/<nome>/`, com um
`package.yaml` descrevendo seu conteúdo ao lado do resultado
construído - veja [Pacotes](/pt-br/guide/packages) para o esquema
completo. Como esse diretório é produzido depende do sistema de build
em uso.

**Projetos CMake** são construídos contra `$PS2DEV/cmake/ps2dev.cmake`
como arquivo de toolchain (instalado automaticamente pelo `ps2build
update`), com `CMAKE_INSTALL_PREFIX` definido como
`packages/world/<nome>`. Um `package.yaml` é então escrito à mão
descrevendo o que `cmake --install` produz.
[`ps2gl`](https://github.com/ps2build/ps2gl) e
[`ps2stuff`](https://github.com/ps2build/ps2stuff) seguem
ambos esse padrão - seus arquivos `package.yaml` servem como exemplos
reais.

**Projetos nativos do `ps2build`** (um `ps2.yaml` simples) mantêm um
`package.yaml` ao lado, nomeando quais resultados da build devem ser
publicados. `ps2build install` constrói em um diretório temporário e
copia apenas o que o `package.yaml` nomeia para
`packages/world/<nome>`. [`audsrv`](https://github.com/ps2build/audsrv)
é um exemplo desse padrão.

**Publicando uma release**: o diretório `packages/world/<nome>/`
resultante é compactado e anexado a uma release. O próprio
[`.github/workflows`](https://github.com/ps2build/ps2gl/tree/master/.github/workflows)
do `ps2gl` faz isso a cada tag - um bom ponto de partida para o CI de
um novo pacote.

## Pacotes personalizados existentes

<PackageList :items="customPkgs" />
