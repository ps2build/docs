# Getting started

## Install the SDK

[Install PS2BUILD](/guide/installation) first, then build your first project here.

## Create a project

### Step 1

In a new directory, run:

```
ps2build init
```

This creates:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` is a hello world program using `printf`.
- `.clangd` configures your editor for the PS2 toolchain.
- `ps2.yaml` is the build definition for executables, libraries, drivers and more.

### Step 2

Run the build:

```
ps2build build
```

The build also generates `compile_commands.json` for editor code completion.

### Step 3

The output is `build/bin/<project name>.elf`, which runs in PCSX2 or on hardware.

## Next steps

PS2BUILD includes a package system for libraries and drivers.

To link an installed package, add an item to the `libs:` array in `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

See [Packages](/guide/packages) for how packages work and [ps2.yaml](/guide/ps2-yaml) for the full format.
