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
      text: Leia a documentação
      link: /pt-br/guide/architecture/introduction
---

<script setup>
import LinkGrid from '../.vitepress/components/LinkGrid.vue'

const links = [
  { title: 'Primeiros passos', text: 'Crie e compile um projeto', link: '/pt-br/guide/getting-started' },
  { title: 'ps2.yaml', text: 'O formato da definição de build', link: '/pt-br/guide/ps2-yaml' },
  { title: 'Pacotes', text: 'Bibliotecas e drivers, e como libs: os resolve', link: '/pt-br/guide/packages' },
  { title: 'Toolchain LLVM', text: 'Compile com clang em vez de GCC (beta)', link: '/guide/llvm' },
  { title: 'Arquitetura do PS2', text: 'Como o hardware se encaixa', link: '/pt-br/guide/architecture/introduction' },
  { title: 'Referência da API', text: 'Em breve', link: '/pt-br/api/' },
]
</script>

## Instalação

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

## Primeiro build

Em uma pasta nova, execute:

```shell
ps2build init
ps2build build
```

O resultado é `build/bin/<projeto>.elf`, pronto para o PCSX2 ou hardware. Targets, bibliotecas e drivers são descritos em `ps2.yaml`:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
    libs: [png, freetype, gskit, dmakit]
```

## Próximos passos

<LinkGrid :items="links" />
