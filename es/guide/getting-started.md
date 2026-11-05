# Primeros pasos

## Instala el SDK

Primero, instala [PS2BUILD](/es/guide/installation) si aún no lo has hecho, ¡y luego vuelve aquí para compilar tu primer proyecto!

## Crea un proyecto

### Paso 1

En un directorio nuevo, ejecuta:

```
ps2build init
```

Esto crea los siguientes archivos del proyecto:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` es tu archivo fuente con un simple `printf` de hola mundo para empezar.
- `.clangd` es un archivo de soporte que ayuda a tu editor a entender la cadena de compilación de la PS2.
- `ps2.yaml` es la definición de compilación, que te permite definir ejecutables, bibliotecas, drivers y más.

### Paso 2

Ahora ejecuta la compilación:

```
ps2build build
```

Se genera automáticamente un archivo de soporte `compile_commands.json` para el autocompletado, para tu comodidad.

### Paso 3

¡Felicidades! Ahora tienes un archivo `.elf` en `build/bin/<nombre del proyecto>.elf` que puedes ejecutar en PCSX2 o en hardware real.

## Próximos pasos

PS2BUILD incluye un sistema de paquetes simple para mantener las dependencias modulares.

Para enlazar un paquete instalado, agrega un elemento al arreglo `libs:` en `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

Consulta [Paquetes](/es/guide/packages) para saber cómo funcionan los paquetes, y [ps2.yaml](/es/guide/ps2-yaml) para el formato completo de la descripción de compilación `ps2.yaml`.
