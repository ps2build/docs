# Audio <Badge type="warning" text="beta" />

> This section is in beta. See the note on the [cheat sheet](/guide/architecture/cheat-sheet).

Like most PS2 peripherals, the sound chip (SPU2) is IOP-side hardware.
There is no direct path from the EE to SPU2. Every audio package in this SDK is
either an IOP driver that accesses SPU2 registers or an
EE-side client that reaches one over SIF (see
[EE, IOP, and SIF](/guide/architecture/ee-iop-sif)).

## Layering

This SDK has two separate register-level SPU2 drivers.
Everything else builds on one of them:

```
core/libsd  ─────┐                     core/libspu2 ─────┐
                 │                                        │
             world/sdr                            world/libsnd2 (MIDI/sequencer)
      (RPC wrapper, IOP)                                  │
                                              world/rspu2drv (RPC, links BOTH
                                               libsnd2 AND libspu2)
```

- **`libsd`** and **`libspu2`** (both core) are independent,
  register-level SPU2 drivers with direct hardware access. They are separate implementations, not versions of the same driver.
- **`libsnd2`** (world) is a MIDI/sequencer layer built on `libspu2`.
- **`rspu2drv`** (world) is an RPC-exposed driver that statically links
  both `libsnd2` and `libspu2`.
- **`sdr`** (world) is an RPC wrapper around `libsd`
  (its IOP binary is `sdrdrv.irx`).
- **`ps2snd`** (core) is the EE-side RPC client for whichever of
  these IOP drivers is running. Your EE code calls it.
- **`ahx`** (core) is a separate EE-side RPC client for the IOP's AHX
  audio-codec driver (a compressed audio format). It is separate from the SPU2 drivers above.

## `audio`

**`audio`** (world) is a higher-level playback API: load a sound, play it on a channel, or feed PCM to a
stream for music and video audio. It has an IOP
driver, `audio.irx`, that drives the SPU2 through `libsd`, and an EE library, `libaudio.a`, that your code
links. It is licensed AFL-2.0, like the rest of the `world` tier.

- **Sounds and channels.** `audio_sound_load_apcm()` uploads an `.adp` file to SPU2 memory and
  `audio_play_sound()` plays it on the first free channel. Each of the 24 channels keeps its own volume, pan
  and pitch.
- **Stream.** `audio_stream_start()` sets a format (8 or 16 bits, mono or stereo, 8000 to 48000 Hz) and
  `audio_stream_queue_pcm()` feeds it. The library converts to what the SPU2 plays.
- **Effects.** The SPU2 has a hardware reverb and delay. `audio_effect_set_preset()` picks one of ten presets
  (room, studio, hall, space, echo, delay, pipe and others), and `audio_channel_set_effect_send()` or
  `audio_stream_set_effect_send()` sends a channel or the stream through it. Select the preset before loading
  sounds: the effect on the stream needs working memory from the same SPU2 RAM.
- **Loading the driver.** Your program loads `libsd.irx` and then `audio.irx` before calling `audio_init()`.
  With ps2build, `embed_irx: [libsd, "audio:audio"]` does it.

Two examples, a sound player and a tone generator, are in the
[`audio/examples`](https://github.com/ps2build/sdk-world/tree/master/audio/examples) folder of
`sdk-world`. The [API reference](https://api.ps2build.dev/sdk-world/latest/) covers every function, the `.adp` format and the threading
rules.

### Code written for `audsrv`

**`audsrv-compat`** (world) provides the audsrv API on top of `audio`, so existing code builds and runs
without source changes: link `audsrv-compat` and embed the driver under the old symbol with
`embed_irx: [libsd, "audio:audsrv"]`. CD audio is not supported and the CD calls return an error. The
[API reference](https://api.ps2build.dev/sdk-world/latest/) has a migration guide with one row per audsrv call.

The original [`audsrv`](https://github.com/ps2build/audsrv) is still available as its own repo, under
its own license.

**`libmad`** (world) decodes MP3 to raw PCM samples. It feeds `audio` or one of the lower-level drivers for
playback.

## Layer summary

| Need | Package |
|---|---|
| Sound effects, music streams, reverb | `audio` |
| Voice-level control, custom DSP | `libsd`, `libspu2`, `ps2snd` |
| MIDI sequencing | `libsnd2` |
| MP3 decoding | `libmad` |

## See also

- [EE, IOP, and SIF](/guide/architecture/ee-iop-sif) - why most packages pair an EE client with an IOP driver
- [Packages](/guide/packages) - the core/world license split
