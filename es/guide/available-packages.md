<script setup>
import pkgs from '../../.vitepress/data/packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Paquetes disponibles

Todos los paquetes aquí están listos para usarse en `libs:` por
nombre - consulta [Paquetes](/es/guide/packages) para saber cómo
funciona la resolución. Cada nombre enlaza a donde realmente vive su
código fuente - el directorio de paquete de `sdk-core`/`sdk-world`, su
propio repositorio, o (para un puñado de bibliotecas portadas) el
propio proyecto upstream. Un nombre sin enlace todavía no está
rastreado públicamente en ningún sitio. Esta lista refleja lo que
realmente instala la última versión (release); si no estás seguro de
si un nombre está actualizado, la herramienta `search_packages` del
[servidor MCP](/es/guide/mcp) revisa tu propia instalación
directamente.

`core` y `world` son los dos tiers que `ps2build update` mantiene
actualizados por ti. Algunos paquetes `world` - `audsrv` y `ps2gl`
entre ellos - se mantienen en sus propios repositorios con su propio
calendario de releases. Consulta [Paquetes
personalizados](/es/guide/custom-packages) para ver cómo se instalan,
o cómo publicar el tuyo de la misma forma.

## core

Kernel, drivers, sistema de archivos, memoria, y redes - la base con
licencia permisiva sobre la que se construye todo proyecto.

<PackageList :items="pkgs.core" />

## world

Gráficos, audio, entrada, y todo lo demás - el tier de conveniencia,
sin restricción de licencia. Varios de estos son ports de proyectos
upstream reales, enlazados directamente a ese upstream en lugar de a
un espejo interno. Algunos otros -
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
y [`ps2stuff`](https://github.com/ps2build/ps2stuff) - se
mantienen en sus propios repositorios, publicados de forma
independiente a `sdk-world`, e instalados de la misma forma. Consulta
[Paquetes personalizados](/es/guide/custom-packages) para ver cómo se
hacen.

<PackageList :items="pkgs.world" />
