<script setup>
import pkgs from '../.vitepress/data/packages.json'
import PackageList from '../.vitepress/components/PackageList.vue'
</script>

# Available packages

Every package here is ready to use in `libs:` by name - see
[Packages](/guide/packages) for how resolution works. Each name links to
where its source actually lives - the `sdk-core`/`sdk-world` package
directory, its own repo, or (for a handful of ported libraries) the
upstream project itself. A name with no link isn't yet tracked anywhere
public. This list reflects what's actually installed by the latest
release; if you're not sure a name is current, the
[MCP server](/guide/mcp)'s `search_packages` tool checks your own
install directly.

`core` and `world` are the two tiers `ps2build update` keeps current
for you. Some `world` packages - `audsrv` and `ps2gl` among them - are
maintained in their own repos with their own release schedule. See
[Custom packages](/guide/custom-packages) for how those are installed,
or how to publish your own the same way.

## core

Kernel, drivers, filesystem, memory, and networking - the
permissively-licensed base every project builds on.

<PackageList :items="pkgs.core" />

## world

Graphics, audio, input, and everything else - the convenience tier, no
license restriction. Several of these are ports of real upstream
projects, linked to that upstream directly rather than an internal
mirror. A few others -
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
and [`ps2stuff`](https://github.com/ps2build/ps2stuff) - are
maintained in their own repos, released independently of `sdk-world`,
and installed the same way. See [Custom
packages](/guide/custom-packages) for how those are made.

<PackageList :items="pkgs.world" />
