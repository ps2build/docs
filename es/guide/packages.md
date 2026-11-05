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

Referéncialo desde un target de `ps2.yaml` de la misma forma en que
referenciarías un `ee_lib` del mismo archivo:

```yaml
libs: [kernel, png, freetype]
```

`ps2build` resuelve cada nombre contra `$PS2DEV/packages/{core,world}`,
y añade automáticamente los `include_dirs` y el archivo del paquete a
la compilación - sin flags `-I`/`-L` escritos a mano.

## Tipos de artefacto

- **`library`** - un archivo (`lib:`), para uno o más procesadores
  (`target: [ee]`, `[iop]`, o ambos, como entradas de artefacto
  separadas).
- **`driver`** - un módulo `.irx` cargable (`irx:` en lugar de `lib:`),
  solo `iop`.

Un paquete puede declarar ambos - por ejemplo, una mitad de biblioteca
para el lado EE y una mitad de driver para el lado IOP del mismo
componente real, ambas resolubles por el mismo nombre.

## Headers transitivos y orden de enlazado

- **`headers:`** - nombra otros paquetes cuyos headers necesitan las
  propias fuentes de este para compilar. Un consumidor que enlaza este
  paquete también obtiene esos directorios de include, sin listarlos
  él mismo.
- **`links:`** - nombra otros paquetes contra los que el archivo de
  este realmente se enlazó - un edge real de orden de compilación. Un
  consumidor que enlaza este paquete también debe enlazar todo lo
  nombrado aquí, de forma recursiva, en un orden que un enlazador
  estático acepte.

Ambos se resuelven automáticamente - solo escribes el nombre del
paquete de nivel superior en tu propio `libs:`.
