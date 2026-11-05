# Primeros pasos

## Instala el SDK

[Instala PS2BUILD](/es/guide/installation) primero y luego compila tu primer proyecto aquí.

## Crea un proyecto

### Paso 1

En un directorio nuevo, ejecuta:

```
ps2build init
```

Esto crea:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` es un programa hola mundo con `printf`.
- `.clangd` configura el editor para la cadena de herramientas de PS2.
- `ps2.yaml` es la definición de compilación para ejecutables, bibliotecas, drivers y más.

### Paso 2

Ejecuta la compilación:

```
ps2build build
```

La compilación también genera `compile_commands.json` para el autocompletado del editor.

### Paso 3

La salida es `build/bin/<nombre del proyecto>.elf`, que se ejecuta en PCSX2 o en hardware.

## Próximos pasos

PS2BUILD incluye un sistema de paquetes para bibliotecas y drivers.

Para enlazar un paquete instalado, agrega un elemento al arreglo `libs:` en `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

Consulta [Paquetes](/es/guide/packages) para saber cómo funcionan los paquetes, y [ps2.yaml](/es/guide/ps2-yaml) para el formato completo.
