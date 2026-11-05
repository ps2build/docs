# Primeiros passos

## Instale o SDK

[Instale o PS2BUILD](/pt-br/guide/installation) primeiro e depois compile seu primeiro projeto aqui.

## Crie um projeto

### Passo 1

Em um novo diretório, execute:

```
ps2build init
```

Isso cria:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` é um programa hello world com `printf`.
- `.clangd` configura o editor para a toolchain do PS2.
- `ps2.yaml` é a definição de build para executáveis, bibliotecas, drivers e mais.

### Passo 2

Execute o build:

```
ps2build build
```

O build também gera `compile_commands.json` para o autocompletar do editor.

### Passo 3

A saída é `build/bin/<nome do projeto>.elf`, que roda no PCSX2 ou em hardware.

## Próximos passos

O PS2BUILD inclui um sistema de pacotes para bibliotecas e drivers.

Para vincular um pacote instalado, adicione um item ao array `libs:` no `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

Veja [Pacotes](/pt-br/guide/packages) para entender como os pacotes funcionam, e [ps2.yaml](/pt-br/guide/ps2-yaml) para o formato completo.
