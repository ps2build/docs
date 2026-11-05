# ps2.yaml

La definición de compilación que lee `ps2build`. `ps2build init` genera una mínima:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
```

## Tipos de target

Cada target tiene un `type`: `ee`, `iop`, `ee_lib`, o `iop_lib`.

- **`ee`** - un `.elf` arrancable. Las bibliotecas estándar (kernel,
  cglue, cdvd) se enlazan automáticamente. Lista solo las
  bibliotecas adicionales en `libs:`. Pon `output_bin: true` para además
  producir un `.bin` plano, o `pack: true` para producir un
  `<name>-packed.elf` comprimido y autoextraíble.
- **`iop`** - un módulo `.irx` reubicable. Se enlaza con
  `-nostdlib -dc -r`, se le quitan los símbolos y luego lo procesa
  `iopfixup`.
- **`ee_lib` / `iop_lib`** - compila como un target `ee` o `iop` pero
  produce `lib<name>.a` y no se enlaza por sí mismo.
  Un target `ee` enlaza un `ee_lib` (e `iop` un
  `iop_lib`) listando el nombre del target, sin `lib<name>.a`, en su
  `libs:` junto a los nombres de bibliotecas externas. El orden de enlazado se preserva
  como se escribió, así que el orden importa.

El enlazado final de un target `ee` cambia automáticamente al driver de
enlazado de C++ cuando el target tiene una fuente `.cpp`, `.cc` o `.cxx`, o enlaza un
`ee_lib` que la tiene. No hace falta configuración.

## Incrustando un módulo IOP (`embed_irx`)

Un target `ee` puede listar targets `iop` por nombre en `embed_irx:`.
Para cada uno, `ps2build` ejecuta `bin2c` sobre el `.irx` compilado y
enlaza el resultado:

```c
extern unsigned char <name>_irx[];
extern unsigned int size_<name>_irx;
SifExecModuleBuffer(<name>_irx, size_<name>_irx, 0, NULL, NULL);
```

Si dos targets `ee` incrustan el mismo módulo `iop`, se compila
una sola vez.

## Campos

| Campo | Aplica a | Significado |
|---|---|---|
| `project` | raíz | Nombre del proyecto (solo documentación) |
| `targets` | raíz | La lista de targets de compilación |
| `name` | target | Nombre único - el alias de ninja, y cómo lo referencian otros targets |
| `type` | target | `ee` / `iop` / `ee_lib` / `iop_lib` |
| `sources` | target | Rutas explícitas de archivos fuente (`.c`/`.cpp`/`.s`/`.S`) |
| `include_dirs` | target | Directorios `-I` extra |
| `defines` | target | Defines extra del preprocesador |
| `cflags` | target | Flags de compilación extra |
| `ldflags` | target | Flags de enlazado extra (solo `ee`/`iop`) |
| `libs` | target | Bibliotecas extra y/o nombres de `ee_lib`/`iop_lib` del mismo archivo (solo `ee`/`iop`) |
| `headers` | target | Paquetes instalados cuyos headers necesita este target para compilar - sin enlazar. Válido en todo tipo de target, incluidos `ee_lib`/`iop_lib` |
| `linkfile` | target | Sobrescribe el script de enlazado por defecto (solo `ee`/`iop`) |
| `opt` | target | Sobrescribe el flag de optimización (por defecto `-O2` en ee, `-Os` en iop) |
| `debug` | target | Añade `-gdwarf-2 -gz` |
| `embed_irx` | target | Solo `ee` - targets `iop` a incrustar vía `bin2c` |
| `output_bin` | target | Solo `ee` - también emite un `.bin` plano |
| `pack` | target | Solo `ee` - ejecuta `ps2pack` para producir un `<name>-packed.elf` comprimido y autoextraíble |
| `imports_lst` | target | Solo `iop` - ruta a un archivo `imports.lst` |
| `exports_tab` | target | Solo `iop` - ruta a un archivo `exports.tab` |

La herramienta imprime el JSON Schema completo:

```bash
ps2build schema
```
