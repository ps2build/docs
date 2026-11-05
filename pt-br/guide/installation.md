# Instalação

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

Isso instala o SDK e adiciona `ps2build` ao seu `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

Veja [ps2build/install](https://github.com/ps2build/install) para as opções do instalador.

::: warning Suporte a Linux
Distribuições que não usam glibc não são suportadas.
:::

