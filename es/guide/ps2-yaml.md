# ps2.yaml

La definición de compilación que lee `ps2build`. Una mínima, generada
por `ps2build init`:

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
  cglue, cdvd) ya están enlazadas automáticamente - solo lista
  bibliotecas *extra* en `libs:`. Pon `output_bin: true` para además
  producir un `.bin` plano, o `pack: true` para producir un
  `<name>-packed.elf` comprimido y autoextraíble.
- **`iop`** - un módulo `.irx` reubicable. Enlazado de forma especial
  (`-nostdlib -dc -r`), despojado de símbolos (stripped), y luego
  pasado por la herramienta `iopfixup`.
- **`ee_lib` / `iop_lib`** - compila como un target `ee`/`iop` pero
  archiva en `lib<name>.a` en lugar de enlazar - nunca se enlaza por sí
  mismo. Un target `ee` enlaza contra un `ee_lib` (e `iop` contra
  `iop_lib`) listando su *nombre* de target (no `lib<name>.a`) en su
  propio `libs:`, junto con cualquier nombre de biblioteca externa, en
  la misma lista - el orden importa, ya que el orden de enlazado
  estático se preserva exactamente como se escribió.

El enlazado final de un target `ee` cambia automáticamente al driver de
enlazado de C++ cuando se necesita soporte de runtime de C++ - sus
propias fuentes contienen un archivo `.cpp`/`.cc`/`.cxx`, o enlaza un
`ee_lib` que sí lo hace. Nunca necesitas hacer nada para activar esto.

## Incrustando un módulo IOP (`embed_irx`)

Un target `ee` puede listar targets `iop` por nombre en `embed_irx:`.
Para cada uno, `ps2build` ejecuta `bin2c` sobre el `.irx` compilado y
enlaza el resultado:

```c
extern unsigned char <name>_irx[];
extern unsigned int size_<name>_irx;
SifExecModuleBuffer(<name>_irx, size_<name>_irx, 0, NULL, NULL);
```

Si dos targets `ee` incrustan el mismo módulo `iop`, solo se compila
una vez y se comparte.

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

Garantizado que es correcto - el JSON Schema completo sale directamente
de la propia herramienta:

```bash
ps2build schema
```
