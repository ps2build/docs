# Installation

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

This installs the `ps2build` SDK and adds it to your path.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

See [ps2/install](https://github.com/ps2build/install) for install customization options.

::: warning Linux Support
Non-GLIBC based distributions of Linux are not supported yet
:::