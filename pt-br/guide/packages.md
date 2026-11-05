# Pacotes

Todo pacote instalado vive em `$PS2DEV/packages/<tier>/<name>/` -
`core` ou `world` - com um `package.yaml` descrevendo o que ele
oferece:

```yaml
name: kernel
origin: ps2sdk
tier: core
license: AFL-2.0

artifacts:
  - kind: library
    target: [ee]
    include_dirs: [include]
    lib: lib/libkernel.a
```

Referencie-o a partir de um target de `ps2.yaml` como um `ee_lib` definido no mesmo arquivo:

```yaml
libs: [kernel, png, freetype]
```

O `ps2build` resolve cada nome contra `$PS2DEV/packages/{core,world}`,
e adiciona os `include_dirs` e o archive do pacote à
build. Não são necessárias flags `-I` ou `-L`.

## Tipos de artifact

- **`library`** - um archive (`lib:`), para um ou mais processadores
  (`target: [ee]`, `[iop]`, ou ambos, como entradas de artifact
  separadas).
- **`driver`** - um módulo `.irx` carregável (`irx:` em vez de `lib:`),
  apenas `iop`.

Um pacote pode declarar ambos, por exemplo uma biblioteca para o EE e um driver para o IOP, resolvidos pelo mesmo nome.

## Headers transitivos e ordem de linkagem

- **`headers:`** - nomeia outros pacotes cujos headers as próprias
  fontes deste precisam para compilar. Um consumidor que linka este
  pacote também recebe esses diretórios de include, sem precisar
  listá-los ele mesmo.
- **`links:`** - nomeia outros pacotes contra os quais o archive deste
  é linkado. Um consumidor
  que linka este pacote também linka tudo o que está listado
  aqui, recursivamente, em uma ordem que um linker estático aceite.

Ambos são resolvidos automaticamente. Liste apenas o nome do pacote de nível superior em `libs:`.
