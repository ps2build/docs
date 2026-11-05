# MCP setup

`ps2build` includes an [MCP](https://modelcontextprotocol.io) server, so
an AI coding assistant can list installed packages, resolve `libs:` as a build would, and run builds.

## Configure your assistant

`ps2build` needs to already be on your `PATH` (the
[installer](/guide/installation) does this). Point your
assistant at:

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

## HTTP mode

`ps2build mcp` serves on stdio by default (a local subprocess, as in the config above). For a client that cannot spawn a local subprocess,
`--listen` serves streamable HTTP instead:

```bash
ps2build mcp --listen localhost:8931
```

Point your assistant at `http://localhost:8931/` as a streamable-HTTP
MCP server. The server has no authentication. Bind only to an address that every process and network peer able to reach it is trusted.

## What it can do

Read-only:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - installed packages, by tier
- **`resolve_libs`** - what a `libs:` list resolves to (headers, link order, missing names), using the same resolution as a build
- **`get_schema`** / **`explain`** - the `ps2.yaml` format
- **`validate_target`** - checks a target without building

Not read-only:

- **`build_project`** - runs a build and returns parsed errors and warnings
- **`install_project`** - builds, then installs the result into `$PS2DEV/packages`
