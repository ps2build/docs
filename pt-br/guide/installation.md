# Instalação

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

Isso instala o SDK `ps2build` e o adiciona ao seu path.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

Veja [ps2/install](https://github.com/ps2build/install) para opções de personalização da instalação.

::: warning Suporte a Linux
Distribuições de Linux não baseadas em GLIBC ainda não são suportadas
:::
