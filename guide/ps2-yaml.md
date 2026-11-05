# ps2.yaml

The build definition `ps2build` reads. `ps2build init` creates a minimal one:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
```

## Target types

Every target has a `type`: `ee`, `iop`, `ee_lib`, or `iop_lib`.

- **`ee`** - a bootable `.elf`. The standard kernel, cglue and cdvd libraries
  are linked automatically. List only additional libraries in
  `libs:`. Set `output_bin: true` to also produce a flat `.bin`, or
  `pack: true` to produce a compressed, self-extracting
  `<name>-packed.elf`.
- **`iop`** - a relocatable `.irx` module. Linked with
  `-nostdlib -dc -r`, stripped, then processed by `iopfixup`.
- **`ee_lib` / `iop_lib`** - compiles like an `ee` or `iop` target but
  produces `lib<name>.a` and is not linked itself.
  An `ee` target links an `ee_lib` (and `iop` an
  `iop_lib`) by listing the target name, without `lib<name>.a`, in its
  `libs:` next to any external library names. Link order is preserved as
  written, so order matters.

An `ee` target's final link automatically switches to the C++ link
driver when the target has a `.cpp`, `.cc` or `.cxx` source, or links an `ee_lib` that does. No configuration is needed.

## Embedding an IOP module (`embed_irx`)

An `ee` target can list `iop` targets by name in `embed_irx:`. For each
one, `ps2build` runs `bin2c` on the built `.irx` and links the result
in:

```c
extern unsigned char <name>_irx[];
extern unsigned int size_<name>_irx;
SifExecModuleBuffer(<name>_irx, size_<name>_irx, 0, NULL, NULL);
```

If two `ee` targets embed the same `iop` module, it is built once.

## Fields

| Field | Applies to | Meaning |
|---|---|---|
| `project` | root | Project name (documentation only) |
| `targets` | root | The list of build targets |
| `name` | target | Unique name - the ninja alias, and how other targets reference it |
| `type` | target | `ee` / `iop` / `ee_lib` / `iop_lib` |
| `sources` | target | Explicit source file paths (`.c`/`.cpp`/`.s`/`.S`) |
| `include_dirs` | target | Extra `-I` dirs |
| `defines` | target | Extra preprocessor defines |
| `cflags` | target | Extra compile flags |
| `ldflags` | target | Extra link flags (`ee`/`iop` only) |
| `libs` | target | Extra libraries and/or same-file `ee_lib`/`iop_lib` names (`ee`/`iop` only) |
| `headers` | target | Installed packages whose headers this target compiles against - no linking. Valid on every target type, including `ee_lib`/`iop_lib` |
| `linkfile` | target | Override the default linker script (`ee`/`iop` only) |
| `opt` | target | Override the optimization flag (default `-O2` ee, `-Os` iop) |
| `debug` | target | Add `-gdwarf-2 -gz` |
| `embed_irx` | target | `ee` only - `iop` targets to embed via `bin2c` |
| `output_bin` | target | `ee` only - also emit a flat `.bin` |
| `pack` | target | `ee` only - also run `ps2pack` to produce a compressed, self-extracting `<name>-packed.elf` |
| `imports_lst` | target | `iop` only - path to an `imports.lst` file |
| `exports_tab` | target | `iop` only - path to an `exports.tab` file |

The tool prints the full JSON Schema:

```bash
ps2build schema
```
