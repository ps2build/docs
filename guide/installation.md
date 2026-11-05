# Installation

::: code-group
```powershell [Windows]
irm https://ps2build.dev/install.ps1 | iex
```
```shell [Linux / macOS]
curl -sSfL https://ps2build.dev/install.sh | sh
```
:::

This installs the SDK and adds `ps2build` to your `PATH`.

- Windows `%LOCALAPPDATA%\ps2build`
- Linux and macOS `~/.local/share/ps2build`

The installer downloads `ps2build`, verifies it against the release `SHA256SUMS`, then runs `ps2build update` to fetch the toolchain and SDK.

| Variable | Effect |
|---|---|
| `PS2BUILD_INSTALL_DIR` | Install location |
| `PS2BUILD_INSTALL_VERSION` | `ps2build` release tag to install (default: latest) |
| `PS2BUILD_NO_UPDATE=1` | Install `ps2build` only; skip `ps2build update` |
| `PS2BUILD_NO_MODIFY_PATH=1` | Do not edit shell profiles or the user `PATH` |

::: warning Platform support
Supported: Windows x64, Linux x64 (glibc), macOS Intel and Apple silicon. Distributions that use musl, such as Alpine, are not supported.
:::
