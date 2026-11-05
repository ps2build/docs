# Paquetes

Cada paquete instalado vive en `$PS2DEV/packages/<tier>/<name>/` -
`core` o `world` - con un `package.yaml` que describe lo que ofrece:

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

Referéncialo desde un target de `ps2.yaml` igual que un `ee_lib` definido en el mismo archivo:

```yaml
libs: [kernel, png, freetype]
```

`ps2build` resuelve cada nombre contra `$PS2DEV/packages/{core,world}`,
y añade los `include_dirs` y el archivo del paquete a
la compilación. No hacen falta flags `-I` ni `-L`.

## Tipos de artefacto

- **`library`** - un archivo (`lib:`), para uno o más procesadores
  (`target: [ee]`, `[iop]`, o ambos, como entradas de artefacto
  separadas).
- **`driver`** - un módulo `.irx` cargable (`irx:` en lugar de `lib:`),
  solo `iop`.

Un paquete puede declarar ambos, por ejemplo una biblioteca para el EE y un driver para el IOP, resueltos por el mismo nombre.

## Headers transitivos y orden de enlazado

- **`headers:`** - nombra otros paquetes cuyos headers necesitan las
  propias fuentes de este para compilar. Un consumidor que enlaza este
  paquete también obtiene esos directorios de include, sin listarlos
  él mismo.
- **`links:`** - nombra otros paquetes contra los que se enlaza el archivo de
  este. Un
  consumidor que enlaza este paquete también enlaza todo lo
  nombrado aquí, de forma recursiva, en un orden que un enlazador
  estático acepte.

Ambos se resuelven automáticamente. Lista solo el nombre del paquete de nivel superior en `libs:`.
