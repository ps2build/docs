# Audio <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

Como la mayoría de los periféricos de la PS2, el chip de sonido (SPU2) es hardware del lado IOP.
No hay una ruta directa de la EE al SPU2. Cada paquete de audio de este SDK es
un driver IOP que accede a los registros del SPU2 o un
cliente del lado EE que alcanza uno a través de SIF (consulta
[EE, IOP y SIF](/es/guide/architecture/ee-iop-sif)).

## Capas

Este SDK tiene dos drivers SPU2 independientes a nivel de registro.
Todo lo demás se construye sobre uno de ellos:

```
core/libsd  ─────┐                     core/libspu2 ─────┐
                 │                                        │
             world/sdr                            world/libsnd2 (MIDI/secuenciador)
      (envoltorio RPC, IOP)                               │
                                              world/rspu2drv (RPC, enlaza AMBOS
                                               libsnd2 Y libspu2)
```

- **`libsd`** y **`libspu2`** (ambos core) son drivers SPU2 independientes
  a nivel de registro con acceso directo al hardware. Son implementaciones separadas, no versiones del mismo driver.
- **`libsnd2`** (world) es una capa MIDI/secuenciador construida sobre `libspu2`.
- **`rspu2drv`** (world) es un driver expuesto por RPC que enlaza estáticamente
  `libsnd2` y `libspu2`.
- **`sdr`** (world) es un envoltorio RPC alrededor de `libsd`
  (su binario IOP es `sdrdrv.irx`).
- **`ps2snd`** (core) es el cliente RPC del lado EE para el driver IOP
  que esté corriendo. Es lo que llama tu código EE.
- **`ahx`** (core) es un cliente RPC del lado EE separado para el driver de códec de audio
  AHX del IOP (un formato de audio comprimido). Es independiente de los drivers SPU2 de arriba.

## `audio`

**`audio`** (world) es una API de reproducción de más alto nivel: carga un sonido, reprodúcelo en un canal o envía PCM a un
stream para el audio de música y video. Tiene un driver
IOP, `audio.irx`, que maneja el SPU2 a través de `libsd`, y una biblioteca EE, `libaudio.a`, que tu código
enlaza. Su licencia es AFL-2.0, como el resto del tier `world`.

- **Sonidos y canales.** `audio_sound_load_apcm()` sube un archivo `.adp` a la memoria del SPU2 y
  `audio_play_sound()` lo reproduce en el primer canal libre. Cada uno de los 24 canales conserva su propio volumen, pan
  y tono.
- **Stream.** `audio_stream_start()` define un formato (8 o 16 bits, mono o estéreo, de 8000 a 48000 Hz) y
  `audio_stream_queue_pcm()` lo alimenta. La biblioteca convierte a lo que reproduce el SPU2.
- **Efectos.** El SPU2 tiene reverb y delay por hardware. `audio_effect_set_preset()` elige uno de diez presets
  (room, studio, hall, space, echo, delay, pipe y otros), y `audio_channel_set_effect_send()` o
  `audio_stream_set_effect_send()` envía un canal o el stream a través de él. Selecciona el preset antes de cargar
  sonidos: el efecto del stream necesita memoria de trabajo de la misma RAM del SPU2.
- **Carga del driver.** Tu programa carga `libsd.irx` y luego `audio.irx` antes de llamar a `audio_init()`.
  Con ps2build, `embed_irx: [libsd, "audio:audio"]` lo hace.

Dos ejemplos, un reproductor de sonidos y un generador de tonos, están en la carpeta
[`audio/examples`](https://github.com/ps2build/sdk-world/tree/master/audio/examples) de
`sdk-world`. La [referencia de la API](/api/) cubre cada función, el formato `.adp` y las reglas de
hilos.

### Código escrito para `audsrv`

**`audsrv-compat`** (world) ofrece la API de audsrv sobre `audio`, de modo que el código existente compila y corre
sin cambios de fuente: enlaza `audsrv-compat` e incrusta el driver con el símbolo antiguo mediante
`embed_irx: [libsd, "audio:audsrv"]`. El audio de CD no está soportado y las llamadas de CD devuelven un error. La
[referencia de la API](/api/) tiene una guía de migración con una fila por llamada de audsrv.

El [`audsrv`](https://github.com/ps2build/audsrv) original sigue disponible como repositorio independiente, con
su propia licencia.

**`libmad`** (world) decodifica MP3 a muestras PCM. Alimenta a `audio` o a uno de los drivers de más bajo nivel
para la reproducción.

## Resumen de capas

| Necesidad | Paquete |
|---|---|
| Efectos de sonido, streams de música, reverb | `audio` |
| Control a nivel de voz, DSP a medida | `libsd`, `libspu2`, `ps2snd` |
| Secuenciación MIDI | `libsnd2` |
| Decodificación MP3 | `libmad` |

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - por qué la mayoría de los paquetes emparejan un cliente EE con un driver IOP
- [Paquetes](/es/guide/packages) - la división de licencias core y world
