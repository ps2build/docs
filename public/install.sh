#!/bin/sh
# Installs ps2build on Linux or macOS, then runs "ps2build update" to fetch the toolchain and SDK.
#
#   curl -sSfL https://ps2build.dev/install.sh | sh
#
# Environment:
#   PS2BUILD_INSTALL_DIR      install location (default: $HOME/.local/share/ps2build)
#   PS2BUILD_INSTALL_VERSION  ps2build release tag to install (default: latest)
#   PS2BUILD_NO_UPDATE=1      install ps2build only; skip "ps2build update"
#   PS2BUILD_NO_MODIFY_PATH=1 leave shell profiles alone

set -eu

REPO="ps2build/ps2build"
INSTALL_DIR="${PS2BUILD_INSTALL_DIR:-$HOME/.local/share/ps2build}"
VERSION="${PS2BUILD_INSTALL_VERSION:-latest}"

die() {
    echo "error: $*" >&2
    exit 1
}

fetch() {
    if command -v curl >/dev/null 2>&1; then
        curl -sSfL "$1" -o "$2"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "$2" "$1"
    else
        die "curl or wget is required"
    fi
}

latest_tag() {
    if command -v curl >/dev/null 2>&1; then
        url=$(curl -sSf -o /dev/null -w '%{url_effective}' -L "https://github.com/$REPO/releases/latest")
    elif command -v wget >/dev/null 2>&1; then
        url=$(wget -qO /dev/null --server-response "https://github.com/$REPO/releases/latest" 2>&1 | sed -n 's/^ *Location: *//p' | tail -n 1)
    else
        die "curl or wget is required"
    fi
    echo "${url##*/}"
}

sha256_of() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | cut -d' ' -f1
    elif command -v shasum >/dev/null 2>&1; then
        shasum -a 256 "$1" | cut -d' ' -f1
    else
        die "sha256sum or shasum is required to verify the download"
    fi
}

case "$(uname -s)" in
    Linux) os=linux ;;
    Darwin) os=darwin ;;
    *) die "unsupported OS: $(uname -s). Windows users: run install.ps1" ;;
esac

case "$(uname -m)" in
    x86_64 | amd64) arch=amd64 ;;
    arm64 | aarch64) arch=arm64 ;;
    *) die "unsupported architecture: $(uname -m)" ;;
esac

case "$os-$arch" in
    linux-amd64 | darwin-amd64 | darwin-arm64) ;;
    *) die "no ps2build release for $os-$arch" ;;
esac

if [ "$os" = linux ] && command -v ldd >/dev/null 2>&1 && ldd --version 2>&1 | grep -qi musl; then
    die "musl-based Linux (Alpine) is not supported"
fi

if [ "$VERSION" = latest ]; then
    VERSION="$(latest_tag)"
    [ -n "$VERSION" ] || die "could not determine the latest release"
fi

asset="ps2build-$VERSION-$os-$arch"
base="https://github.com/$REPO/releases/download/$VERSION"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Installing ps2build $VERSION to $INSTALL_DIR"
fetch "$base/$asset" "$tmp/$asset"
fetch "$base/SHA256SUMS" "$tmp/SHA256SUMS"

expected="$(awk -v a="$asset" '{ n = $2; sub(/^\*/, "", n); if (n == a) print $1 }' "$tmp/SHA256SUMS")"
[ -n "$expected" ] || die "$asset is not listed in SHA256SUMS"
[ "$(sha256_of "$tmp/$asset")" = "$expected" ] || die "checksum mismatch for $asset"

mkdir -p "$INSTALL_DIR"
chmod +x "$tmp/$asset"
mv -f "$tmp/$asset" "$INSTALL_DIR/ps2build"

add_to_path() {
    profile="$1"
    line="export PATH=\"$INSTALL_DIR:\$PATH\""
    if [ -f "$profile" ] && grep -qF "$line" "$profile"; then
        return
    fi
    printf '\n# ps2build\n%s\n' "$line" >>"$profile"
    echo "Added $INSTALL_DIR to PATH in $profile"
}

case ":$PATH:" in
    *":$INSTALL_DIR:"*) ;;
    *)
        if [ "${PS2BUILD_NO_MODIFY_PATH:-0}" != 1 ]; then
            case "${SHELL:-}" in
                */zsh) add_to_path "${ZDOTDIR:-$HOME}/.zshrc" ;;
                */bash)
                    if [ "$os" = darwin ]; then add_to_path "$HOME/.bash_profile"; else add_to_path "$HOME/.bashrc"; fi
                    ;;
                */fish)
                    mkdir -p "$HOME/.config/fish/conf.d"
                    echo "fish_add_path $INSTALL_DIR" >"$HOME/.config/fish/conf.d/ps2build.fish"
                    echo "Added $INSTALL_DIR to PATH for fish"
                    ;;
                *) add_to_path "$HOME/.profile" ;;
            esac
        fi
        ;;
esac

export PATH="$INSTALL_DIR:$PATH"

if [ "${PS2BUILD_NO_UPDATE:-0}" != 1 ]; then
    echo "Installing the toolchain and SDK (ps2build update)"
    ps2build update
fi

echo "Done. Open a new terminal, then run: ps2build --version"
