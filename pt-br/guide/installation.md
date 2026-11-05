# Instalação

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

Isso instala o SDK e adiciona `ps2build` ao seu `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux e macOS `~/.local/share/ps2build`

O instalador baixa o `ps2build`, verifica-o com o `SHA256SUMS` da versão e executa `ps2build update` para obter a toolchain e o SDK.

| Variável | Efeito |
|---|---|
| `PS2BUILD_INSTALL_DIR` | Local de instalação |
| `PS2BUILD_INSTALL_VERSION` | Tag do `ps2build` a instalar (padrão: a mais recente) |
| `PS2BUILD_NO_UPDATE=1` | Instala apenas o `ps2build`; pula `ps2build update` |
| `PS2BUILD_NO_MODIFY_PATH=1` | Não altera os perfis do shell nem o `PATH` do usuário |

::: warning Plataformas suportadas
Suportadas: Windows x64, Linux x64 (glibc) e macOS Intel e Apple silicon. Distribuições que usam musl, como Alpine, não são suportadas.
:::
