---
layout: home

hero:
  name: PS2BUILD
  text: SDK Homebrew
  tagline: Sistema de compilación y SDK para homebrew de PlayStation 2
  image:
    src: /logo.svg
    alt: PS2BUILD
  actions:
    - theme: brand
      text: Empieza a compilar
      link: /es/guide/getting-started
    - theme: alt
      text: Lee la documentación
      link: /es/guide/architecture/introduction
---

<script setup>
import LinkGrid from '../.vitepress/components/LinkGrid.vue'

const links = [
  { title: 'Primeros pasos', text: 'Crea y compila un proyecto', link: '/es/guide/getting-started' },
  { title: 'ps2.yaml', text: 'El formato de definición de compilación', link: '/es/guide/ps2-yaml' },
  { title: 'Paquetes', text: 'Bibliotecas y drivers, y cómo los resuelve libs:', link: '/es/guide/packages' },
  { title: 'Toolchain LLVM', text: 'Compila con clang en lugar de GCC (beta)', link: '/guide/llvm' },
  { title: 'Arquitectura de PS2', text: 'Cómo encaja el hardware', link: '/es/guide/architecture/introduction' },
  { title: 'Referencia de la API', text: 'Próximamente', link: '/es/api/' },
]
</script>

## Instalación

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

## Primera compilación

En una carpeta nueva, ejecuta:

```shell
ps2build init
ps2build build
```

El resultado es `build/bin/<proyecto>.elf`, listo para PCSX2 o hardware. Los targets, bibliotecas y drivers se describen en `ps2.yaml`:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
    libs: [png, freetype, gskit, dmakit]
```

## Siguientes pasos

<LinkGrid :items="links" />
