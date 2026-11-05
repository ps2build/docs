# DMA <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El Direct Memory Access (DMA) mueve bloques de datos entre la RAM
principal y los demás componentes de la PS2 sin que la EE los copie a
mano. Como el GS, VU1, y el IOP (a través de SIF) son todos destinos
separados fuera de la propia memoria de la EE, el DMA es cómo los
datos realmente llegan a cualquiera de ellos en un programa real - no
es una optimización que agregas después.

## Diez canales, un trabajo cada uno

La lista real y empaquetada de canales de este SDK
(`ee/dma/include/dma.h`):

| Canal | Valor | Dirección |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (o VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | La Image Processing Unit - el IPU es lo que realmente hace el trabajo de decodificación MPEG2 que envuelve `core/mpeg` (consulta la [hoja de referencia](/es/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (consulta [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | Una segunda ruta EE↔IOP separada (usada con menos frecuencia que SIF0/1) |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM (una memoria pequeña y rápida local a la EE) |

El canal que uses se sigue directamente de a dónde van los datos -
enviar datos de vértices/texturas al GS significa el canal GIF,
enviar una solicitud RPC al IOP significa un canal SIF, y así
sucesivamente. No existe una llamada genérica de "DMA a cualquier
lado."

## Por qué existe `dmakit`

Encolar una transferencia DMA de verdad significa construir un **tag
DMA** (un pequeño encabezado que describe la transferencia - origen,
tamaño, y qué hacer cuando termina o cuándo encadenar con el próximo
tag) y escribirlo en los registros del canal correcto. `dmakit`
(tier world) envuelve esto: construir cadenas de tags, esperar a que
terminen, y los patrones comunes (envía este buffer, luego este otro,
luego interrúmpeme) en lugar de armar bytes de tag a mano en cada
sitio de llamada.

## Por qué esto importa para cómo estructuras el código

Como las transferencias DMA corren **de forma concurrente con la
CPU**, un programa real construido en torno a esto se ve distinto de
uno que simplemente llama a una función bloqueante de "dibuja ahora":
encolas trabajo, haces otra cosa (construyes los datos del siguiente
frame, corres lógica del juego), y solo sincronizas cuando realmente
necesitas el resultado o necesitas reusar un buffer que el motor DMA
aún no ha terminado de leer. Reusar un buffer de origen antes de que
su transferencia DMA realmente haya terminado es un bug clásico de
PS2 - los datos que terminan viendo el GS/VU son los que estaban en
memoria en el momento en que el motor DMA llegó a ellos, no en el
momento en que llamaste a la función.

## Ver también

- [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer) -
  el destino del canal GIF
- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif) - el destino de
  los canales SIF
- [Vector Units](/es/guide/architecture/vector-units) - el destino de
  los canales VIF0/VIF1
