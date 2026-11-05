<script setup>
import pkgs from '../.vitepress/data/packages.json'
import PackageList from '../.vitepress/components/PackageList.vue'
</script>

# Available packages

Every package listed here can be used by name in `libs:`. See
[Packages](/guide/packages) for how names are resolved. Each name links to
its source: the `sdk-core` or `sdk-world` package directory, its own repository, or,
for ported libraries, the upstream project. A name with no link has no public source yet.
The list matches the latest release. To check your own install, use the
[MCP server](/guide/mcp)'s `search_packages` tool.

`ps2build update` keeps the `core` and `world` tiers current. Some `world` packages, including `audsrv` and `ps2gl`, are
maintained in their own repositories with their own release schedule. See
[Custom packages](/guide/custom-packages) to install them or publish your own.

## core

Kernel, drivers, filesystem, memory and networking. The permissively licensed base every project builds on.

<PackageList :items="pkgs.core" />

## world

Graphics, audio, input and everything else, with no license restriction. Several are ports of upstream
projects and link to the upstream directly. Four others,
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
and [`ps2stuff`](https://github.com/ps2build/ps2stuff), are
maintained in their own repositories and released independently of `sdk-world`. See [Custom
packages](/guide/custom-packages).

<PackageList :items="pkgs.world" />
