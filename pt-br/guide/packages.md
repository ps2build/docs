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

Referencie-o a partir de um target de `ps2.yaml` da mesma forma que
você referenciaria um `ee_lib` do mesmo arquivo:

```yaml
libs: [kernel, png, freetype]
```

O `ps2build` resolve cada nome contra `$PS2DEV/packages/{core,world}`,
e adiciona automaticamente os `include_dirs` e o archive do pacote à
build - sem flags `-I`/`-L` escritas à mão.

## Tipos de artifact

- **`library`** - um archive (`lib:`), para um ou mais processadores
  (`target: [ee]`, `[iop]`, ou ambos, como entradas de artifact
  separadas).
- **`driver`** - um módulo `.irx` carregável (`irx:` em vez de `lib:`),
  apenas `iop`.

Um pacote pode declarar ambos - por exemplo, uma metade de biblioteca
para o lado EE e uma metade de driver para o lado IOP do mesmo
componente real, ambas resolvíveis pelo mesmo nome.

## Headers transitivos e ordem de linkagem

- **`headers:`** - nomeia outros pacotes cujos headers as próprias
  fontes deste precisam para compilar. Um consumidor que linka este
  pacote também recebe esses diretórios de include, sem precisar
  listá-los ele mesmo.
- **`links:`** - nomeia outros pacotes contra os quais o archive deste
  foi realmente linkado - um edge real de ordem de build. Um consumidor
  que linka este pacote também precisa linkar tudo o que está listado
  aqui, recursivamente, em uma ordem que um linker estático aceite.

Ambos são resolvidos automaticamente - você só precisa escrever o nome
do pacote de nível superior no seu próprio `libs:`.
