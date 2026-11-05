<script setup>
import pkgs from '../../.vitepress/data/packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Paquetes disponibles

Todos los paquetes de esta lista se pueden usar por nombre en `libs:`. Consulta
[Paquetes](/es/guide/packages) para saber cómo se resuelven los nombres. Cada nombre enlaza a
su código fuente: el directorio de paquete de `sdk-core` o `sdk-world`, su propio repositorio o,
para las bibliotecas portadas, el proyecto upstream. Un nombre sin enlace aún no tiene fuente pública.
La lista corresponde a la última versión. Para revisar tu propia instalación, usa la herramienta
`search_packages` del [servidor MCP](/es/guide/mcp).

`ps2build update` mantiene actualizados los tiers `core` y `world`. Algunos paquetes `world`, entre ellos `audsrv` y `ps2gl`, se mantienen en sus propios repositorios con su propio
calendario de releases. Consulta [Paquetes
personalizados](/es/guide/custom-packages) para instalarlos o publicar el tuyo.

## core

Kernel, drivers, sistema de archivos, memoria y redes. La base con licencia permisiva sobre la que se construye todo proyecto.

<PackageList :items="pkgs.core" />

## world

Gráficos, audio, entrada y todo lo demás, sin restricción de licencia. Varios son ports de proyectos
upstream y enlazan directamente a ese upstream. Otros cuatro,
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
y [`ps2stuff`](https://github.com/ps2build/ps2stuff), se
mantienen en sus propios repositorios y se publican de forma
independiente de `sdk-world`. Consulta
[Paquetes personalizados](/es/guide/custom-packages).

<PackageList :items="pkgs.world" />
