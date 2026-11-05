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

## First build

In a new folder, run:

```shell
ps2build init
ps2build build
```

The result is `build/bin/<project>.elf`, ready for PCSX2 or hardware. Targets, libraries and drivers are described in `ps2.yaml`:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
    libs: [png, freetype, gskit, dmakit]
```

## Less to write

<HomeShowcase :before="before" :after="after" :platforms-label="platformsLabel" :platforms="platforms" :actions="actions" :links="links" />
