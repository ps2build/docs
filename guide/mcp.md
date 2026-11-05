# MCP setup

`ps2build` includes an [MCP](https://modelcontextprotocol.io) server, so
an AI coding assistant can look up what packages are actually
installed, resolve `libs:` the same way a real build would, and run a
real build - instead of guessing.

## Configure your assistant

`ps2build` needs to already be on your `PATH` (the
[installer](/guide/getting-started) does this for you). Point your
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

`ps2build mcp` serves on stdio by default (a spawned local subprocess -
the config above). For a client that can't spawn a local subprocess,
`--listen` switches to streamable HTTP instead:

```bash
ps2build mcp --listen localhost:8931
```

Point your assistant at `http://localhost:8931/` as a streamable-HTTP
MCP server. No authentication is added - only bind an address you trust
every local process/network peer to reach.

## What it can do

Read-only:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - what's actually installed, by tier
- **`resolve_libs`** - what a `libs:` list resolves to (headers, link order, missing names) - the exact same resolution a real build does
- **`get_schema`** / **`explain`** - the `ps2.yaml` format
- **`validate_target`** - checks a target without running a full build

Not read-only:

- **`build_project`** - runs a real build, returns parsed errors/warnings instead of raw build output
- **`install_project`** - builds, then installs the result into `$PS2DEV/packages`
