---
layout: home

hero:
  name: PS2BUILD
  text: SDK Homebrew
  tagline: Sistema de compilaciÃ³n y SDK para homebrew de PlayStation 2
  image:
    src: /logo.svg
    alt: PS2BUILD
  actions:
    - theme: brand
      text: Empieza a compilar
      link: /es/guide/getting-started
    - theme: alt
      text: Lee la documentaciÃ³n
      link: /es/guide/architecture/introduction
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
  { text: 'Empieza a compilar', link: '/es/guide/getting-started', primary: true },
  { text: 'Migrando desde ps2sdk', link: '/es/guide/migration' },
]

const links = [
  { text: 'Referencia de ps2.yaml', link: '/es/guide/ps2-yaml' },
  { text: 'Paquetes', link: '/es/guide/packages' },
  { text: 'Toolchain LLVM', link: '/guide/llvm' },
  { text: 'Arquitectura de PS2', link: '/es/guide/architecture/introduction' },
]
</script>

## Instalación

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

<FeatureSection index="01" title="Multiplataforma" text="Funciona de forma nativa en Windows, Linux y macOS.">
<OsTiles />
</FeatureSection>

<FeatureSection index="02" title="Autónomo" text="Se instala en su propio directorio y funciona de forma nativa en tu sistema operativo.">

- Sin Docker
- Sin configuración manual del entorno
- Toolchain y paquetes instalados y actualizados por `ps2build`

</FeatureSection>

<FeatureSection index="03" title="Definiciones de build simples" wide>
<HomeShowcase :before="before" :after="after" />
</FeatureSection>

<FeatureSection index="04" title="Soporte de editores" text="compile_commands.json viene incluido. Funciona en la mayoría de editores.">
<EditorTiles />
</FeatureSection>

<div class="home-end">
<HomeShowcase :actions="actions" :links="links" />
</div>

<style>
.home-end { margin-top: 56px; padding-top: 56px; border-top: 1px solid var(--vp-c-divider); }
</style>
