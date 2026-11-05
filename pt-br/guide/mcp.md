# Configuração do MCP

O `ps2build` inclui um servidor [MCP](https://modelcontextprotocol.io),
para que um assistente de programação com IA possa listar pacotes instalados, resolver `libs:` como uma build faria e rodar builds.

## Configure seu assistente

O `ps2build` já precisa estar no seu `PATH` (o
[instalador](/pt-br/guide/installation) faz isso). Aponte
seu assistente para:

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

Por padrão, `ps2build mcp` roda via stdio (um subprocesso local, como na configuração acima). Para um cliente que não consegue iniciar um
subprocesso local, `--listen` serve HTTP streamable:

```bash
ps2build mcp --listen localhost:8931
```

Aponte seu assistente para `http://localhost:8931/` como servidor MCP
HTTP streamable. O servidor não tem autenticação. Vincule apenas a um endereço em que todo processo local e par de rede com acesso seja confiável.

## O que ele pode fazer

Somente leitura:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - pacotes instalados, por tier
- **`resolve_libs`** - para o que uma lista `libs:` resolve (headers, ordem de linkagem, nomes faltando), com a mesma resolução de uma build
- **`get_schema`** / **`explain`** - o formato do `ps2.yaml`
- **`validate_target`** - valida um target sem compilar

Não é somente leitura:

- **`build_project`** - roda uma build e retorna erros e avisos já interpretados
- **`install_project`** - compila, e depois instala o resultado em `$PS2DEV/packages`
