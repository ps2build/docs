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
import LinkGrid from './.vitepress/components/LinkGrid.vue'

const links = [
  { title: 'Getting started', text: 'Create and build a project', link: '/guide/getting-started' },
  { title: 'ps2.yaml', text: 'The build definition format', link: '/guide/ps2-yaml' },
  { title: 'Packages', text: 'Libraries and drivers, and how libs: resolves them', link: '/guide/packages' },
  { title: 'LLVM toolchain', text: 'Build with clang instead of GCC (beta)', link: '/guide/llvm' },
  { title: 'PS2 architecture', text: 'How the hardware fits together', link: '/guide/architecture/introduction' },
  { title: 'API reference', text: 'Coming soon', link: '/api/' },
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

## Where to go next

<LinkGrid :items="links" />
