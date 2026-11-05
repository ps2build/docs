# LLVM toolchain <Badge type="warning" text="beta" />

::: warning Beta
The LLVM toolchain is in beta and may change.
:::

`ps2build` can compile your game with clang instead of GCC. GCC is still the
default, and your code and `ps2.yaml` stay the same apart from one line.

## What you get

A newer C++ standard library, so these work in your game:

- `std::filesystem`
- coroutines
- `std::thread`, `std::promise` and `std::future`
- `thread_local`

## Use it

Add one line to `ps2.yaml`, or to `ps2workspace.yaml` to cover every project in
the workspace:

```yaml
toolchain: llvm
```

Then build as usual:

```bash
ps2build build
```

To try it once without editing any file:

```bash
ps2build build --toolchain llvm
```

## Install

The first build asks to install the toolchain if it is missing. To install or
update it yourself:

```bash
ps2build update llvm-toolchain
```

It is available for Windows x64 and Linux x64.

## Packages

Packages built for the LLVM toolchain live in `packages-llvm`, next to
`packages` in the SDK folder. With `toolchain: llvm`, builds read from
`packages-llvm`, and `ps2build install` puts your own packages there. If the
folder does not exist, builds read from `packages`.
