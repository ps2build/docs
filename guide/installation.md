# Installation

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

This installs the SDK and adds `ps2build` to your `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

See [ps2build/install](https://github.com/ps2build/install) for installer options.

::: warning Linux support
Distributions that do not use glibc are not supported.
:::
