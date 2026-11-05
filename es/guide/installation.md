# Instalación

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

Esto instala el SDK y agrega `ps2build` a tu `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

Consulta [ps2build/install](https://github.com/ps2build/install) para las opciones del instalador.

::: warning Soporte en Linux
Las distribuciones que no usan glibc no están soportadas.
:::

