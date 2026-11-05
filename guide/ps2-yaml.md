# ps2.yaml

The build definition `ps2build` reads. A minimal one, from `ps2build init`:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
```

## Target types

Every target has a `type`: `ee`, `iop`, `ee_lib`, or `iop_lib`.

- **`ee`** - a bootable `.elf`. The standard kernel/cglue/cdvd libraries
  are already linked automatically - only list *extra* libraries in
  `libs:`. Set `output_bin: true` to also produce a flat `.bin`, or
  `pack: true` to produce a compressed, self-extracting
  `<name>-packed.elf`.
- **`iop`** - a relocatable `.irx` module. Linked specially
  (`-nostdlib -dc -r`), stripped, then passed through the `iopfixup`
  tool.
- **`ee_lib` / `iop_lib`** - compiles like an `ee`/`iop` target but
  archives into `lib<name>.a` instead of linking - never itself linked.
  An `ee` target links against an `ee_lib` (and `iop` against
  `iop_lib`) by listing its target *name* (not `lib<name>.a`) in its own
  `libs:`, alongside any external library names, in the same list -
  order matters, since static link order is preserved exactly as
  written.

An `ee` target's final link automatically switches to the C++ link
driver whenever C++ runtime support is needed - its own sources contain
a `.cpp`/`.cc`/`.cxx` file, or it links an `ee_lib` that does. You never
need to do anything to trigger this.

## Embedding an IOP module (`embed_irx`)

An `ee` target can list `iop` targets by name in `embed_irx:`. For each
one, `ps2build` runs `bin2c` on the built `.irx` and links the result
in:

```c
extern unsigned char <name>_irx[];
extern unsigned int size_<name>_irx;
SifExecModuleBuffer(<name>_irx, size_<name>_irx, 0, NULL, NULL);
```

If two `ee` targets embed the same `iop` module, it's only built once
and shared.

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

Guaranteed to be correct - the full JSON Schema comes straight from the
tool itself:

```bash
ps2build schema
```
