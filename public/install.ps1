# Installs ps2build on Windows, then runs "ps2build update" to fetch the toolchain and SDK.
#
#   irm https://ps2build.dev/install.ps1 | iex
#
# Environment:
#   PS2BUILD_INSTALL_DIR      install location (default: %LOCALAPPDATA%\ps2build)
#   PS2BUILD_INSTALL_VERSION  ps2build release tag to install (default: latest)
#   PS2BUILD_NO_UPDATE=1      install ps2build only; skip "ps2build update"
#   PS2BUILD_NO_MODIFY_PATH=1 leave the user PATH alone

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repo = "ps2build/ps2build"
$installDir = if ($env:PS2BUILD_INSTALL_DIR) { $env:PS2BUILD_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA "ps2build" }
$version = if ($env:PS2BUILD_INSTALL_VERSION) { $env:PS2BUILD_INSTALL_VERSION } else { "latest" }

if (-not [Environment]::Is64BitOperatingSystem) {
    throw "ps2build requires a 64-bit version of Windows"
}
if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64" -and -not $env:PROCESSOR_ARCHITEW6432) {
    Write-Host "Note: installing the x64 build; it runs under Windows emulation on ARM64."
}

[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

if ($version -eq "latest") {
    $request = [Net.HttpWebRequest]::Create("https://github.com/$repo/releases/latest")
    $request.AllowAutoRedirect = $false
    $response = $request.GetResponse()
    $location = $response.Headers["Location"]
    $response.Close()
    if (-not $location) { throw "could not determine the latest release" }
    $version = ($location -split "/")[-1]
}

$asset = "ps2build-$version-windows-amd64.exe"
$base = "https://github.com/$repo/releases/download/$version"
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("ps2build-install-" + [Guid]::NewGuid())
New-Item -ItemType Directory -Path $tmp | Out-Null

try {
    Write-Host "Installing ps2build $version to $installDir"
    Invoke-WebRequest -UseBasicParsing -Uri "$base/$asset" -OutFile (Join-Path $tmp $asset)
    Invoke-WebRequest -UseBasicParsing -Uri "$base/SHA256SUMS" -OutFile (Join-Path $tmp "SHA256SUMS")

    $line = Get-Content (Join-Path $tmp "SHA256SUMS") | Where-Object { $_ -match ("\s\*?" + [regex]::Escape($asset) + "$") } | Select-Object -First 1
    if (-not $line) { throw "$asset is not listed in SHA256SUMS" }
    $expected = ($line -split "\s+")[0]
    $actual = (Get-FileHash -Algorithm SHA256 (Join-Path $tmp $asset)).Hash
    if ($actual -ne $expected.ToUpper()) { throw "checksum mismatch for $asset" }

    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    Move-Item -Force (Join-Path $tmp $asset) (Join-Path $installDir "ps2build.exe")
}
finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

if ($env:PS2BUILD_NO_MODIFY_PATH -ne "1") {
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if (($userPath -split ";") -notcontains $installDir) {
        $newPath = if ($userPath) { "$userPath;$installDir" } else { $installDir }
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added $installDir to your PATH"
    }
}
if (($env:Path -split ";") -notcontains $installDir) {
    $env:Path = "$env:Path;$installDir"
}

if ($env:PS2BUILD_NO_UPDATE -ne "1") {
    Write-Host "Installing the toolchain and SDK (ps2build update)"
    & (Join-Path $installDir "ps2build.exe") update
    if ($LASTEXITCODE -ne 0) { throw "ps2build update failed" }
}

Write-Host "Done. Open a new terminal, then run: ps2build --version"
