# Instalación

::: code-group
```powershell [Windows]
irm https://raw.githubusercontent.com/ps2build/install/master/install.ps1 | iex
```
```shell [Linux]
curl -sSfL https://raw.githubusercontent.com/ps2build/install/master/install.sh | sh
```
:::

Esto instala el SDK `ps2build` y lo agrega a tu path.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux `~/.local/share/ps2build`

Consulta [ps2/install](https://github.com/ps2build/install) para opciones de personalización de la instalación.

::: warning Soporte en Linux
Las distribuciones de Linux que no están basadas en GLIBC aún no están soportadas
:::
