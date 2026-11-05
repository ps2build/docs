# Configuración de MCP

`ps2build` incluye un servidor [MCP](https://modelcontextprotocol.io),
para que un asistente de programación con IA pueda consultar qué
paquetes están realmente instalados, resolver `libs:` de la misma
forma en que lo haría una compilación real, y ejecutar una compilación
real - en lugar de adivinar.

## Configura tu asistente

`ps2build` ya debe estar en tu `PATH` (el
[instalador](/es/guide/getting-started) hace esto por ti). Apunta tu
asistente a:

```json
{
  "mcpServers": {
    "ps2build": {
      "command": "ps2build",
      "args": ["mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add ps2build -- ps2build mcp
```

## Modo HTTP

`ps2build mcp` sirve por stdio de forma predeterminada (un subproceso
local generado - la configuración de arriba). Para un cliente que no
puede generar un subproceso local, `--listen` cambia a HTTP
streamable en su lugar:

```bash
ps2build mcp --listen localhost:8931
```

Apunta tu asistente a `http://localhost:8931/` como servidor MCP HTTP
streamable. No se añade autenticación - vincula únicamente una
dirección a la que confíes que puede llegar cualquier proceso local o
par de red.

## Qué puede hacer

Solo lectura:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - qué está realmente instalado, por tier
- **`resolve_libs`** - a qué se resuelve una lista `libs:` (headers, orden de enlazado, nombres faltantes) - exactamente la misma resolución que hace una compilación real
- **`get_schema`** / **`explain`** - el formato de `ps2.yaml`
- **`validate_target`** - valida un target sin ejecutar una compilación completa

No es solo lectura:

- **`build_project`** - ejecuta una compilación real, devuelve errores/advertencias ya interpretados en lugar de la salida cruda de la compilación
- **`install_project`** - compila, y luego instala el resultado en `$PS2DEV/packages`
