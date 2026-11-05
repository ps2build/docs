# DMA <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El Direct Memory Access (DMA) mueve bloques de datos entre la RAM
principal y los demás componentes de la PS2 sin que la EE los copie a
mano. El GS, VU1 y el IOP (a través de SIF) están fuera de la memoria de la EE, así que el DMA es la forma en que los
datos llegan a ellos.

## Canales

Los canales definidos en `ee/dma/include/dma.h`:

| Canal | Valor | Dirección |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (o VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | La Image Processing Unit, que hace la decodificación MPEG2 que envuelve `core/mpeg` (consulta la [hoja de referencia](/es/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (consulta [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | Una segunda ruta EE↔IOP, menos usada que SIF0 y SIF1 |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM (una memoria pequeña y rápida local a la EE) |

## dmakit

Una transferencia DMA se describe con un **tag DMA**: un pequeño encabezado con el origen, el tamaño, la
acción al terminar y el siguiente tag de la cadena. `dmakit` (world) construye
cadenas de tags, espera a que termine la transferencia y ofrece patrones de transferencia comunes.

## Concurrencia

Las transferencias DMA corren **de forma concurrente con la CPU**. Un buffer de origen no debe modificarse ni reutilizarse
hasta que su transferencia termine. El GS o la VU reciben el contenido de la memoria en el momento en que el motor DMA
lo lee, que puede diferir del contenido en el momento de la llamada.

## Ver también

- [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer):
  el destino del canal GIF
- [EE, IOP y SIF](/es/guide/architecture/ee-iop-sif): el destino de
  los canales SIF
- [Vector Units](/es/guide/architecture/vector-units): el destino de
  los canales VIF0 y VIF1
