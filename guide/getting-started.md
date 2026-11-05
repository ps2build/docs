# Getting started

## Install the SDK

First, get [PS2BUILD](/guide/installation) installed if you haven't already, then come back here to build your first project!

## Create a project

### Step 1

In a new directory run:

```
ps2build init
```

Which creates the following project files:
```
.
├─ .clangd
├─ src
│  └─ main.c
└─ ps2.yaml
```

- `main.c` is your source file with a simple hello world `printf` to get you started.
- `.clangd` is a support file to help your editor understand the PS2's toolchain.
- `ps2.yaml` is the build definition, which allows you to define executables, libraries, drivers, and more.

### Step 2

Now run the build:

```
ps2build build
```

A `compile_commands.json` intellisense support file will be automatically generated for your convenience.

### Step 3

Congratulations! You now have an `.elf` file in `build/bin/<project name>.elf` which can be run in PCSX2 or on hardware!

## Next steps

PS2BUILD includes a simple package system to keep dependencies modular.

To link an installed package, add an item to the `libs:` array in `ps2.yaml`.

```yaml
targets:
  - name: my-game
    type: ee
    sources: [main.c]
    libs: [png, freetype, gskit, dmakit]
```

See [Packages](/guide/packages) for how packages work, and [ps2.yaml](/guide/ps2-yaml) for the full `ps2.yaml` build description format.
