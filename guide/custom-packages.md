<script setup>
import customPkgs from '../.vitepress/data/custom-packages.json'
import PackageList from '../.vitepress/components/PackageList.vue'
</script>

# Custom packages

`core` and `world` (see [Available packages](/guide/available-packages))
cover the packages `ps2build update` installs for you. Anything else -
a library you wrote, or a third-party project someone else maintains -
installs as a `world` package the same way.

## Installing one

Download the package's release zip and extract it to
`$PS2DEV/packages/world/<name>/`, matching the `name:` its
`package.yaml` declares. For example,
[`ps2gl`](https://github.com/ps2build/ps2gl)'s release zip
extracts to `$PS2DEV/packages/world/ps2gl/`. From there it's usable in
`libs:` exactly like anything from `core`/`world`.

## Packaging a library

A package is a directory shaped like `packages/world/<name>/`, with a
`package.yaml` describing its contents alongside the built output -
see [Packages](/guide/packages) for the full schema. How that
directory is produced depends on the build system in use.

**CMake projects** build against `$PS2DEV/cmake/ps2dev.cmake` as the
toolchain file (installed automatically by `ps2build update`), with
`CMAKE_INSTALL_PREFIX` set to `packages/world/<name>`. A `package.yaml`
is then written by hand to describe what `cmake --install` produces.
[`ps2gl`](https://github.com/ps2build/ps2gl) and
[`ps2stuff`](https://github.com/ps2build/ps2stuff) both follow
this pattern - their `package.yaml` files serve as working examples.

**Native `ps2build` projects** (a plain `ps2.yaml`) keep a
`package.yaml` alongside it, naming which build outputs should ship.
`ps2build install` builds into a scratch directory and copies only
what `package.yaml` names into `packages/world/<name>`.
[`audsrv`](https://github.com/ps2build/audsrv) is an example of
this pattern.

**Publishing a release**: the resulting `packages/world/<name>/`
directory is zipped and attached to a release. `ps2gl`'s own
[`.github/workflows`](https://github.com/ps2build/ps2gl/tree/master/.github/workflows)
does this on every tag push, and is a reasonable starting point for CI
on a new package.

## Existing custom packages

<PackageList :items="customPkgs" />
