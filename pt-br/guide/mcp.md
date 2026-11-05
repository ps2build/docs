# Configuração do MCP

O `ps2build` inclui um servidor [MCP](https://modelcontextprotocol.io),
para que um assistente de programação com IA possa consultar quais
pacotes estão realmente instalados, resolver `libs:` da mesma forma
que uma build real faria, e rodar uma build real - em vez de chutar.

## Configure seu assistente

O `ps2build` já precisa estar no seu `PATH` (o
[instalador](/pt-br/guide/getting-started) faz isso por você). Aponte
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

Por padrão, `ps2build mcp` roda via stdio (um subprocesso local - a
configuração acima). Para um cliente que não consegue iniciar um
subprocesso local, `--listen` muda para HTTP streamable:

```bash
ps2build mcp --listen localhost:8931
```

Aponte seu assistente para `http://localhost:8931/` como servidor MCP
HTTP streamable. Nenhuma autenticação é adicionada - vincule apenas a
um endereço que você confia que qualquer processo local ou par de
rede pode alcançar.

## O que ele pode fazer

Somente leitura:

- **`list_packages`** / **`describe_package`** / **`search_packages`** - o que está realmente instalado, por tier
- **`resolve_libs`** - para o que uma lista `libs:` resolve (headers, ordem de linkagem, nomes faltando) - exatamente a mesma resolução que uma build real faz
- **`get_schema`** / **`explain`** - o formato do `ps2.yaml`
- **`validate_target`** - valida um target sem rodar uma build completa

Não é somente leitura:

- **`build_project`** - roda uma build real, retorna erros/avisos já interpretados em vez da saída bruta da build
- **`install_project`** - compila, e depois instala o resultado em `$PS2DEV/packages`
