<script setup>
import customPkgs from '../../.vitepress/data/custom-packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Paquetes personalizados

`core` y `world` (ver [Paquetes disponibles](/es/guide/available-packages))
cubren los paquetes que `ps2build update` instala. Cualquier otra cosa, como una biblioteca propia o un proyecto de terceros, se instala como paquete `world`.

## Instalar uno

Descarga el zip de release del paquete y extráelo en
`$PS2DEV/packages/world/<nombre>/`, coincidiendo con el `name:` que
declara su `package.yaml`. Por ejemplo, el zip de release de
[`ps2gl`](https://github.com/ps2build/ps2gl) se extrae en
`$PS2DEV/packages/world/ps2gl/`. Después se puede usar en `libs:` como cualquier paquete de `core` o `world`.

## Empaquetar una biblioteca

Un paquete es un directorio con la forma `packages/world/<nombre>/`,
con un `package.yaml` que describe su contenido junto al resultado
compilado. Consulta [Paquetes](/es/guide/packages) para el esquema. Cómo se produce ese directorio depende del sistema de build.

**Los proyectos CMake** se construyen contra `$PS2DEV/cmake/ps2dev.cmake`
como archivo de toolchain (instalado automáticamente por `ps2build
update`), con `CMAKE_INSTALL_PREFIX` apuntando a
`packages/world/<nombre>`. Se escribe a mano un `package.yaml`
que describe lo que produce `cmake --install`.
[`ps2gl`](https://github.com/ps2build/ps2gl) y
[`ps2stuff`](https://github.com/ps2build/ps2stuff) siguen
ambos este patrón, y sus archivos `package.yaml` son ejemplos funcionales.

**Los proyectos nativos de `ps2build`** (un `ps2.yaml` normal)
mantienen un `package.yaml` junto a él que nombra los resultados
del build que se publican. `ps2build install` construye en un
directorio de scratch y copia solo lo que nombra `package.yaml` a
`packages/world/<nombre>`. [`audsrv`](https://github.com/ps2build/audsrv)
sigue este patrón.

**Publicar un release**: el directorio `packages/world/<nombre>/`
resultante se comprime y se adjunta a un release. Los propios
[`.github/workflows`](https://github.com/ps2build/ps2gl/tree/master/.github/workflows)
de `ps2gl` hacen esto en cada tag y sirven de punto de partida para
el CI de un paquete nuevo.

## Paquetes personalizados existentes

<PackageList :items="customPkgs" />
