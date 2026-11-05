---
layout: home

hero:
  name: PS2BUILD
  text: SDK Homebrew
  tagline: Sistema de build e SDK para homebrew de PlayStation 2
  image:
    src: /logo.svg
    alt: PS2BUILD
  actions:
    - theme: brand
      text: Comece a compilar
      link: /pt-br/guide/getting-started
    - theme: alt
      text: Leia a documentaÃ§Ã£o
      link: /pt-br/guide/architecture/introduction
---

<script setup>
import HomeShowcase from '../.vitepress/components/HomeShowcase.vue'
import FeatureSection from '../.vitepress/components/FeatureSection.vue'
import OsTiles from '../.vitepress/components/OsTiles.vue'
import EditorTiles from '../.vitepress/components/EditorTiles.vue'

const before = {
  title: 'ps2sdk Makefile',
  code: `EE_BIN = my-game.elf
EE_OBJS = main.o
EE_INCS += -I$(PS2SDK)/ports/include
EE_LDFLAGS += -L$(PS2SDK)/ports/lib
EE_LIBS += -lpng -lz -lfreetype -lgskit -ldmakit

all: $(EE_BIN)

clean:
	rm -f $(EE_BIN) $(EE_OBJS)

include $(PS2SDK)/samples/Makefile.pref
include $(PS2SDK)/samples/Makefile.eeglobal`,
}

const after = {
  title: 'ps2.yaml',
  code: `project: my-game

targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]`,
}

const platformsLabel = 'Works on'
const platforms = [
  { id: 'windows', name: 'Windows' },
  { id: 'linux', name: 'Linux' },
  { id: 'macos', name: 'macOS' },
]

const actions = [
  { text: 'Comece a compilar', link: '/pt-br/guide/getting-started', primary: true },
  { text: 'Migrando do ps2sdk', link: '/pt-br/guide/migration' },
]

const links = [
  { text: 'Referência do ps2.yaml', link: '/pt-br/guide/ps2-yaml' },
  { text: 'Pacotes', link: '/pt-br/guide/packages' },
  { text: 'Toolchain LLVM', link: '/guide/llvm' },
  { text: 'Arquitetura do PS2', link: '/pt-br/guide/architecture/introduction' },
]
</script>

## Instalação

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

<FeatureSection index="01" title="Multiplataforma" text="Roda nativamente no Windows, Linux e macOS.">
<OsTiles />
</FeatureSection>

<FeatureSection index="02" title="Autocontido" text="Instala em seu próprio diretório e roda no seu sistema operacional.">

- Sem Docker
- Sem configuração manual do ambiente
- Toolchain e pacotes instalados e atualizados pelo `ps2build`

</FeatureSection>

<FeatureSection index="03" title="Definições de build simples" wide text="Um Makefile que inclui regras compartilhadas e lista caminhos de include, caminhos de bibliotecas e flags -l vira um único ps2.yaml. Os pacotes listados em libs: fornecem seus headers e flags de linkagem.">
<HomeShowcase :before="before" :after="after" />
</FeatureSection>

<FeatureSection index="04" title="Suporte a editores" text="compile_commands.json já vem incluído. Funciona na maioria dos editores.">
<EditorTiles />
</FeatureSection>

<div class="home-end">
<HomeShowcase :actions="actions" :links="links" />
</div>

<style>
.home-end { margin-top: 56px; padding-top: 56px; border-top: 1px solid var(--vp-c-divider); }
</style>
