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

Reference it from a `ps2.yaml` target the same way you'd reference a
same-file `ee_lib`:

```yaml
libs: [kernel, png, freetype]
```

`ps2build` resolves each name against `$PS2DEV/packages/{core,world}`,
adds the package's `include_dirs` and archive to the build automatically
- no hand-written `-I`/`-L` flags.

## Artifact kinds

- **`library`** - an archive (`lib:`), for one or more processors
  (`target: [ee]`, `[iop]`, or both, as separate artifact entries).
- **`driver`** - a loadable `.irx` module (`irx:` instead of `lib:`),
  `iop` only.

A package can declare both - e.g. a library half for the EE side and a
driver half for the IOP side of the same real component, both
resolvable by the same name.

## Transitive headers and link order

- **`headers:`** - names other packages whose headers this one's own
  sources need to compile. A consumer linking this package gets those
  include dirs too, without listing them itself.
- **`links:`** - names other packages this one's archive was actually
  linked against - a real build-order edge. A consumer linking this
  package must also link everything named here, recursively, in an
  order a static linker accepts.

Both are resolved automatically - you only ever write the top-level
package name in your own `libs:`.
