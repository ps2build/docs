# Audio <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

Como la mayoría de los periféricos de la PS2, el chip de sonido
(SPU2) es hardware del lado IOP - no hay una ruta directa EE-a-SPU2.
Cada paquete de audio de este SDK es un driver IOP que realmente toca
los registros del SPU2, o un cliente del lado EE que alcanza uno a
través de SIF (consulta
[EE, IOP y SIF](/es/guide/architecture/ee-iop-sif)).

## La estratificación real

Este SDK trae dos drivers SPU2 a nivel de registro genuinamente
separados, y todo lo demás se construye sobre uno de ellos:

```
core/libsd  ─────┐                     core/libspu2 ─────┐
                 │                                        │
             world/sdr                            world/libsnd2 (MIDI/secuenciador)
      (envoltorio RPC, IOP)                                │
                                              world/rspu2drv (RPC, enlaza AMBOS
                                               libsnd2 Y libspu2)
```

- **`libsd`** y **`libspu2`** (ambos core) son drivers SPU2
  independientes a nivel de registro - acceso directo al hardware, no
  existe una ruta más primitiva para ninguno de los dos. No son dos
  versiones de la misma cosa; son dos implementaciones separadas que
  resulta que ambas existen en la historia de este código base.
- **`libsnd2`** (world) es una capa MIDI/secuenciador construida
  sobre `libspu2`.
- **`rspu2drv`** (world) es un driver expuesto por RPC que enlaza
  estáticamente *tanto* `libsnd2` como `libspu2` - el más
  estratificado del grupo.
- **`sdr`** (world) es un envoltorio RPC alrededor de `libsd`
  específicamente (su propio binario IOP se llama literalmente
  `sdrdrv.irx`).
- **`ps2snd`** (core) es el *cliente* RPC del lado EE que corresponde
  a cualquiera de estos drivers IOP que esté corriendo - lo que tu
  código EE realmente llama.
- **`ahx`** (core) es un cliente RPC del lado EE separado,
  específicamente para el driver de códec de audio AHX del IOP (un
  formato de audio comprimido, distinto de los drivers SPU2
  generales de arriba).

## `audsrv`: el camino fácil, deliberadamente fuera de este stack

**`audsrv`** (repo independiente, no `sdk-core`/`sdk-world`) es una
API de reproducción de más alto nivel - encola un sonido,
reprodúcelo - y es por mucho la forma más fácil de meter audio en un
proyecto homebrew. Se mantiene como su propio repo en vez de un
paquete de `sdk-core` porque es LGPL-2, la única licencia que el tier
`core` de este SDK no permite (consulta la política de licencias en
[Paquetes](/es/guide/packages)) - no porque sea de menor calidad o no
esté mantenida.

**`libmad`** (world) decodifica MP3 - combínalo con `audsrv` (o uno
de los drivers de más bajo nivel de arriba) para la reproducción en
vez de esperar que produzca sonido por sí solo; solo convierte audio
comprimido en muestras PCM sin comprimir.

## Elegir una capa

Para casi cualquier juego real, `audsrv` es el punto de partida
correcto - es la API construida para "tengo un efecto de sonido / una
pista de música, reprodúcelo," sin necesidad de entender voces SPU2,
lotes, o la plomería RPC directamente. Recurre a
`libsd`/`libspu2`/`ps2snd` directamente solo si `audsrv` genuinamente
no puede hacer lo que necesitas (efectos DSP a medida, control
directo a nivel de voz) - eso es un salto mucho mayor en complejidad.

## Ver también

- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - por qué
  "cliente EE + driver IOP" es la forma de casi todos los pares de
  paquetes aquí
- [Paquetes](/es/guide/packages) - la división de licencias core/world
