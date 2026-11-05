# Instalación

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

Esto instala el SDK y agrega `ps2build` a tu `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux y macOS `~/.local/share/ps2build`

El instalador descarga `ps2build`, lo verifica con el `SHA256SUMS` de la versión y ejecuta `ps2build update` para obtener la cadena de herramientas y el SDK.

| Variable | Efecto |
|---|---|
| `PS2BUILD_INSTALL_DIR` | Ubicación de instalación |
| `PS2BUILD_INSTALL_VERSION` | Etiqueta de `ps2build` a instalar (por defecto, la última) |
| `PS2BUILD_NO_UPDATE=1` | Instala solo `ps2build`; omite `ps2build update` |
| `PS2BUILD_NO_MODIFY_PATH=1` | No modifica los perfiles del shell ni el `PATH` del usuario |

::: warning Plataformas soportadas
Soportadas: Windows x64, Linux x64 (glibc) y macOS Intel y Apple silicon. Las distribuciones que usan musl, como Alpine, no están soportadas.
:::
