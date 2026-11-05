# Primeiros passos

## Instale o SDK

Primeiro, instale o [PS2BUILD](/pt-br/guide/installation) se ainda não tiver feito isso, e depois volte aqui para compilar seu primeiro projeto!

## Crie um projeto

### Passo 1

Em um novo diretório, execute:

```
ps2build init
```

Isso cria os seguintes arquivos do projeto:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` é seu arquivo fonte com um simples `printf` de hello world para você começar.
- `.clangd` é um arquivo de suporte que ajuda seu editor a entender a toolchain da PS2.
- `ps2.yaml` é a definição de build, que permite definir executáveis, bibliotecas, drivers e muito mais.

### Passo 2

Agora rode o build:

```
ps2build build
```

Um arquivo de suporte `compile_commands.json` para o intellisense é gerado automaticamente, para sua conveniência.

### Passo 3

Parabéns! Agora você tem um arquivo `.elf` em `build/bin/<nome do projeto>.elf`, que pode ser executado no PCSX2 ou em hardware real!

## Próximos passos

O PS2BUILD inclui um sistema de pacotes simples para manter as dependências modulares.

Para vincular um pacote instalado, adicione um item ao array `libs:` no `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

Veja [Pacotes](/pt-br/guide/packages) para entender como os pacotes funcionam, e [ps2.yaml](/pt-br/guide/ps2-yaml) para o formato completo de descrição de build do `ps2.yaml`.
