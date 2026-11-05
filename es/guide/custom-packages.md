<script setup>
import customPkgs from '../../.vitepress/data/custom-packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Paquetes personalizados

`core` y `world` (ver [Paquetes disponibles](/es/guide/available-packages))
cubren los paquetes que `ps2build update` instala por ti. Cualquier
otra cosa - una biblioteca que escribiste, o un proyecto de terceros
que alguien más mantiene - se instala como paquete `world` de la misma
forma.

## Instalar uno

Descarga el zip de release del paquete y extráelo en
`$PS2DEV/packages/world/<nombre>/`, coincidiendo con el `name:` que
declara su `package.yaml`. Por ejemplo, el zip de release de
[`ps2gl`](https://github.com/ps2build/ps2gl) se extrae en
`$PS2DEV/packages/world/ps2gl/`. Desde ahí es usable en `libs:` igual
que cualquier cosa de `core`/`world`.

## Empaquetar una biblioteca

Un paquete es un directorio con la forma `packages/world/<nombre>/`,
con un `package.yaml` que describe su contenido junto al resultado
construido - consulta [Paquetes](/es/guide/packages) para el esquema
completo. Cómo se produce ese directorio depende del sistema de build
en uso.

**Los proyectos CMake** se construyen contra `$PS2DEV/cmake/ps2dev.cmake`
como archivo de toolchain (instalado automáticamente por `ps2build
update`), con `CMAKE_INSTALL_PREFIX` apuntando a
`packages/world/<nombre>`. Luego se escribe a mano un `package.yaml`
describiendo lo que produce `cmake --install`.
[`ps2gl`](https://github.com/ps2build/ps2gl) y
[`ps2stuff`](https://github.com/ps2build/ps2stuff) siguen
ambos este patrón - sus archivos `package.yaml` sirven como ejemplos
de trabajo.

**Los proyectos nativos de `ps2build`** (un `ps2.yaml` normal)
mantienen un `package.yaml` junto a él, nombrando cuáles resultados
del build deben publicarse. `ps2build install` construye en un
directorio de scratch y copia solo lo que nombra `package.yaml` a
`packages/world/<nombre>`. [`audsrv`](https://github.com/ps2build/audsrv)
es un ejemplo de este patrón.

**Publicar un release**: el directorio `packages/world/<nombre>/`
resultante se comprime y se adjunta a un release. Los propios
[`.github/workflows`](https://github.com/ps2build/ps2gl/tree/master/.github/workflows)
de `ps2gl` hacen esto en cada tag - un punto de partida razonable para
el CI de un paquete nuevo.

## Paquetes personalizados existentes

<PackageList :items="customPkgs" />
