# Configuración de MCP

`ps2build` incluye un servidor [MCP](https://modelcontextprotocol.io),
para que un asistente de programación con IA pueda listar los paquetes instalados, resolver `libs:` como lo haría una compilación y ejecutar compilaciones.

## Configura tu asistente

`ps2build` ya debe estar en tu `PATH` (el
[instalador](/es/guide/installation) hace esto). Apunta tu
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
local, como en la configuración de arriba). Para un cliente que no
puede generar un subproceso local, `--listen` sirve HTTP
streamable:

```bash
ps2build mcp --listen localhost:8931
```

Apunta tu asistente a `http://localhost:8931/` como servidor MCP HTTP
streamable. El servidor no tiene autenticación. Vincúlalo solo a una dirección en la que todo proceso local y par de red con acceso sea de confianza.

## Qué puede hacer

Solo lectura:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - paquetes instalados, por tier
- **`resolve_libs`** - a qué se resuelve una lista `libs:` (headers, orden de enlazado, nombres faltantes), con la misma resolución de una compilación
- **`get_schema`** / **`explain`** - el formato de `ps2.yaml`
- **`validate_target`** - valida un target sin compilar

No es solo lectura:

- **`build_project`** - ejecuta una compilación y devuelve errores y advertencias ya interpretados
- **`install_project`** - compila, y luego instala el resultado en `$PS2DEV/packages`
