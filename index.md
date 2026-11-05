---
layout: home

hero:
  name: PS2BUILD
  text: Homebrew SDK
  tagline: Build system and SDK for PlayStation 2 homebrew
  image:
    src: /logo.svg
    alt: PS2BUILD
  actions:
    - theme: brand
      text: Start building
      link: /guide/getting-started
    - theme: alt
      text: Read the docs
      link: /guide/architecture/introduction
---

<script setup>
import HomeShowcase from './.vitepress/components/HomeShowcase.vue'
import FeatureSection from './.vitepress/components/FeatureSection.vue'
import OsTiles from './.vitepress/components/OsTiles.vue'
import EditorTiles from './.vitepress/components/EditorTiles.vue'

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
  { text: 'Start building', link: '/guide/getting-started', primary: true },
  { text: 'Migrating from ps2sdk', link: '/guide/migration' },
]

const links = [
  { text: 'ps2.yaml reference', link: '/guide/ps2-yaml' },
  { text: 'Packages', link: '/guide/packages' },
  { text: 'LLVM toolchain', link: '/guide/llvm' },
  { text: 'PS2 architecture', link: '/guide/architecture/introduction' },
]
</script>

## Install

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

<FeatureSection index="01" title="Cross platform" text="Runs natively on Windows, Linux and macOS.">
<OsTiles />
</FeatureSection>

<FeatureSection index="02" title="Self contained" text="Installs into its own directory and runs on your OS.">

- No Docker
- No manual environment setup
- Toolchain and packages installed and updated by `ps2build`

</FeatureSection>

<FeatureSection index="03" title="Simple build definitions" wide text="A Makefile that includes shared rules and lists include paths, library paths and -l flags becomes one ps2.yaml. Packages named in libs: supply their headers and link flags.">
<HomeShowcase :before="before" :after="after" />
</FeatureSection>

<FeatureSection index="04" title="Editor support" text="compile_commands.json is built in. Works in most editors.">
<EditorTiles />
</FeatureSection>

<div class="home-end">
<HomeShowcase :actions="actions" :links="links" />
</div>

<style>
.home-end { margin-top: 56px; padding-top: 56px; border-top: 1px solid var(--vp-c-divider); }
</style>
