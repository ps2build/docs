<script setup>
import customPkgs from '../.vitepress/data/custom-packages.json'
import PackageList from '../.vitepress/components/PackageList.vue'
</script>

# Custom packages

`core` and `world` (see [Available packages](/guide/available-packages))
cover the packages `ps2build update` installs. Anything else, such as a library you wrote or a third-party project, installs as a `world` package.

## Installing one

Download the package's release zip and extract it to
`$PS2DEV/packages/world/<name>/`, matching the `name:` its
`package.yaml` declares. For example,
[`ps2gl`](https://github.com/ps2build/ps2gl)'s release zip
extracts to `$PS2DEV/packages/world/ps2gl/`. It can then be used in `libs:` like any `core` or `world` package.

## Packaging a library

A package is a directory shaped like `packages/world/<name>/`, with a
`package.yaml` describing its contents next to the built output. See [Packages](/guide/packages) for the schema. How the
directory is produced depends on the build system.

**CMake projects** build against `$PS2DEV/cmake/ps2dev.cmake` as the
toolchain file (installed automatically by `ps2build update`), with
`CMAKE_INSTALL_PREFIX` set to `packages/world/<name>`. A `package.yaml`
is written by hand to describe what `cmake --install` produces.
[`ps2gl`](https://github.com/ps2build/ps2gl) and
[`ps2stuff`](https://github.com/ps2build/ps2stuff) both follow
this pattern, and their `package.yaml` files are working examples.

**Native `ps2build` projects** (a plain `ps2.yaml`) keep a
`package.yaml` next to it that names the build outputs to ship.
`ps2build install` builds into a scratch directory and copies only
what `package.yaml` names into `packages/world/<name>`.
[`audsrv`](https://github.com/ps2build/audsrv) follows this pattern.

**Publishing a release**: the resulting `packages/world/<name>/`
directory is zipped and attached to a release. `ps2gl`'s own
[`.github/workflows`](https://github.com/ps2build/ps2gl/tree/master/.github/workflows)
does this on every tag push and is a starting point for CI
on a new package.

## Existing custom packages

<PackageList :items="customPkgs" />
