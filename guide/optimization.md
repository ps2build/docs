# Making EE code faster <Badge type="warning" text="beta" />

::: warning Beta
This page is new and has not been reviewed yet. The figures come from the
sdk-core `tests/bench` programs run on a real PS2.
:::

Work through this page from the top. Each step costs more effort than the one
before it, and the early steps are enough for most games.

## 1. Pick an optimization level

`ps2build` compiles EE code with `-O2` and IOP code with `-Os`. To change it,
set `opt` on the target in `ps2.yaml`:

```yaml
targets:
  - name: my-game
    type: ee
    sources:
      - src/*.c
    opt: -Os
```

| Level | Use it for |
|---|---|
| `-O2` | The default. The best speed for most code. |
| `-Os` | Code that runs rarely, or a build that has to fit in less memory. On the bench, `-Os` code from LLVM runs within a few percent of its `-O2` code. |
| `-O3` | Only for code you have measured. It makes code larger, and it can make it much slower: on the bench, LLVM `-O3` runs the inflate decoder 3x slower than `-O2`, because it unrolls a loop that should stay rolled. |
| `-O1` | Rarely the right choice. |

You can set a different level for each target, so a hot library can use `-O3`
while the rest of the game uses `-O2`.

## 2. Let the linker drop unused code

`ps2build` already compiles every function into its own section
(`-ffunction-sections`) and links with `--gc-sections`, so functions that
nothing calls are left out of the ELF. You get this without doing anything.

## 3. Link-time optimization

Link-time optimization (LTO) lets the compiler inline and remove code across
source files.

- **GCC:** add `-flto` to `opt`, for example `opt: -O2 -flto`. This builds and
  runs correctly on the console.
- **LLVM:** not supported yet. The LLVM linker, `ld.lld`, treats LTO objects
  for any 64-bit MIPS CPU as 64-bit ELF, and does not recognise the n32 ABI
  that EE code uses, so it rejects them. This affects every MIPS n32 target,
  not only the PS2, so the fix goes to upstream LLVM first. With the fix
  applied, `opt: -O2 -flto` builds and runs correctly on the console.

## 4. Profile-guided optimization

Profile-guided optimization (PGO) is not available for the EE with either
toolchain yet: neither ships a profiling runtime that can write a profile back
from the console.

## 5. Measure before and after

The PS2 tells you how fast code is better than any rule of thumb. Measure on a
real console: PCSX2 does not model the caches, so its timings can point the
wrong way.

Read the CPU cycle counter (COP0 register 9) around the code, with interrupts
off, and keep the fastest of several runs:

```c
#include <kernel.h>

static inline unsigned int cycles(void)
{
    unsigned int v;
    __asm__ __volatile__("mfc0 %0, $9" : "=r"(v) : : "memory");
    return v;
}

unsigned int time_best_of_3(void (*fn)(void))
{
    unsigned int best = 0xffffffffu;

    for (int i = 0; i < 3; i++) {
        DIntr();
        unsigned int t0 = cycles();
        fn();
        unsigned int t = cycles() - t0;
        EIntr();
        if (t < best)
            best = t;
    }
    return best;
}
```

- The counter runs at the CPU clock, about 294.9 MHz, and wraps after about 14
  seconds.
- Give every run the same input, and check the output, so a faster build that
  computes something different does not count.
- Some code takes a different time on each boot of the same ELF: on the bench
  the triangle rasterizer varies by up to 7% between boots, while three runs in
  one boot agree. Run each build on a few boots and compare the fastest.

## 6. Change the code

When the compiler settings run out, the biggest gains come from how the code
uses memory. On the bench, a change to the source made a particle update 6x
faster, where no compiler setting changed it by more than a few percent.

### Mind the data cache

The EE data cache is 8 KB, 2-way set associative, with 64-byte lines. An
address's offset modulo 4 KB picks its set, and each set holds two lines.

The bench's particle update keeps six arrays of 1024 floats, each 4 KB long,
one after another. Element `i` of all six arrays lands in the same set, so
every particle needs six lines from a set that holds two, and the loop misses
the cache on most accesses. Padding each array by one cache line puts them in
different sets:

```c
#define PARTICLES 1024
#define PAD 16 /* one 64-byte line of floats */

static float pool[6][PARTICLES + PAD] __attribute__((aligned(64)));
#define px pool[0]
#define py pool[1]
/* ... */
```

With that change the same code runs 3.7x to 7x faster with both compilers.
Storing each particle's fields together in one struct has the same effect.

### Put the loop that walks memory on the inside

The same particle update ran 30 frames over all 1024 particles, with the frame
loop on the outside. Each frame then walks all 24 KB again, three times the
size of the cache. Swapping the loops, so each particle runs all its frames
while it is in the cache, made it about 6x faster.

### Align buffers

Align DMA buffers, and buffers the IOP writes into, to 64 bytes, so they start
on a cache line: `__attribute__((aligned(64)))`. This also keeps 128-bit
`lq`/`sq` copies on whole lines.

### Keep long fixed-count loops rolled at `-O3`

If `-O3` makes a hot function slower, look for a loop with a fixed trip count
of 8 to 16 that does a little work each time, such as a bit-by-bit Huffman
decode. LLVM may unroll it completely and spill registers. Keep it rolled:

```c
#pragma clang loop unroll(disable)
for (int len = 1; len < 16; len++) {
    /* ... */
}
```

## Floating point on the EE

The EE's FPU is not IEEE 754. It has no infinities, no NaNs and no denormals.
Results that overflow clamp to the largest float (`0x7fffffff`), division by
zero gives the largest float, denormal results become zero, and `add.s`
truncates instead of rounding to nearest.

Both compilers evaluate float expressions on constants while they compile, and
neither does it the way the hardware would:

| Expression on constants | Console at run time | LLVM folds to | GCC folds to |
|---|---|---|---|
| `1.0f / 0.0f` | `0x7fffffff` | `0x7f800000` (infinity) | `0x7fffffff` |
| `FLT_MAX * 2.0f` | `0x7fffffff` | `0x7f800000` (infinity) | `0x7fffffff` |
| `1.0f + 1.5 * 2^-24` | `0x3f800000` | `0x3f800001` | `0x3f800000` |
| `1.0f / 3.0f` | `0x3eaaaaab` | `0x3eaaaaab` | `0x3eaaaaaa` |
| `1.1f * 1.1f` | `0x3f9ae148` | `0x3f9ae148` | `0x3f9ae145` |
| `0x1p-126f * 0.5f` | `0` | `0x00400000` (denormal) | `0x00400000` (denormal) |

So the same expression can give a different result when its inputs are
constants than when they come from memory, with either compiler. Keep code
correct for both: do not rely on an overflow or a division by zero producing a
particular value, and test edge cases with values the compiler cannot see, for
example read from a `volatile` variable.

Two smaller points:

- When `mul.s` overflows, the clamped result can depend on the order of its
  operands: on the console `2.0f * FLT_MAX` gave `0x7ffffffe` and
  `FLT_MAX * 2.0f` gave `0x7fffffff`. Both compilers may swap the operands of a
  multiply.
- `sqrtf` of a negative number gives the square root of its absolute value with
  the `sqrt.s` instruction, which both compilers use at `-O2` (LLVM also at
  `-O0`). GCC at `-O0` calls the C library instead, which gives a different
  result.

## The R5900 short-loop erratum

The R5900 can run a loop of six instructions or fewer only once or twice
if the branch at its end has a useful instruction in its delay slot. Both
toolchains avoid this for you: the compiler and the assembler leave a `nop` in
the delay slot of such loops. A scan of every EE library `ps2build` installs,
built with each toolchain, found no loop that breaks this rule. If you write
assembly with `.set noreorder`, you fill delay slots yourself, so keep a `nop`
after the branch of a short loop.
