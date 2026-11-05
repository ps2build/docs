# Packages

Every installed package lives at `$PS2DEV/packages/<tier>/<name>/` -
`core` or `world` - with a `package.yaml` describing what it offers:

```yaml
name: kernel
origin: ps2sdk
tier: core
license: AFL-2.0

artifacts:
  - kind: library
    target: [ee]
    include_dirs: [include]
    lib: lib/libkernel.a
```

Reference it from a `ps2.yaml` target the same way as an `ee_lib` defined in the same file:

```yaml
libs: [kernel, png, freetype]
```

`ps2build` resolves each name against `$PS2DEV/packages/{core,world}`,
adds the package's `include_dirs` and archive to the build. No `-I` or `-L` flags are needed.

## Artifact kinds

- **`library`** - an archive (`lib:`), for one or more processors
  (`target: [ee]`, `[iop]`, or both, as separate artifact entries).
- **`driver`** - a loadable `.irx` module (`irx:` instead of `lib:`),
  `iop` only.

A package can declare both, for example a library for the EE and a driver for the IOP, resolved by the same name.

## Transitive headers and link order

- **`headers:`** - names other packages whose headers this one's own
  sources need to compile. A consumer linking this package gets those
  include dirs too, without listing them itself.
- **`links:`** - names other packages this one's archive links against. A consumer linking this
  package also links everything named here, recursively, in an
  order a static linker accepts.

Both are resolved automatically. List only the top-level package name in `libs:`.
