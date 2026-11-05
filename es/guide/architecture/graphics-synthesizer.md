# Graphics Synthesizer <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

El Graphics Synthesizer (GS) es el chip gráfico de la PS2. Es un chip
independiente con su propia memoria de video local.

## Memoria local

El GS tiene 4MB de eDRAM en el propio chip, usados para el frame
buffer, el z-buffer y las texturas residentes.
La EE **no puede leer ni escribir esta memoria directamente**. Todo lo
que termina en la memoria del GS (una carga de textura, un frame
buffer limpiado, un triángulo) llega como un comando que el propio GS
ejecuta.

## Paquetes GIF

Esos comandos se empaquetan como **paquetes GIF** (GIF = Graphics
Interface) - datos etiquetados que el front end del GS desempaqueta
en escrituras de registros y dibujos de primitivas. Un paquete
normalmente se entrega al GS por su propio canal DMA
(`DMA_CHANNEL_GIF`, canal 2; consulta [DMA](/es/guide/architecture/dma)).

## Registros privilegiados

Un puñado de registros del GS están mapeados en memoria directamente
en el propio espacio de direcciones de la EE (no a través de DMA) para
lo que la CPU necesita tocar de forma síncrona: el timing de
pantalla, el buffer de despliegue actual y el estado de
interrupciones. Direcciones de `ee_regs.h`:

| Registro | Dirección | Propósito |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Configuración del circuito de salida (qué circuito(s) de lectura están activos, mezcla alfa entre ellos) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Modo de timing/sincronización de video |
| `GS_BGCOLOR` | `0x120000e0` | Color de fondo cuando no se dibuja nada más |
| `GS_CSR` | `0x12001000` | Control/estado - bandera de interrupción VSync, campo actual, reset |

Todo lo demás (tipo de primitiva, color de vértice, parámetros de
textura, modo de mezcla alfa, los punteros del frame y z-buffer)
pasa por paquetes GIF y no por este conjunto mapeado.

## Bibliotecas de dibujo

Este SDK incluye dos bibliotecas para dibujar,
y **no deben usarse juntas** en un mismo proyecto:

- **`gsKit`**: una API de modo inmediato.
  Construyes una primitiva y llamas a una función de dibujo.
  `gskit-toolkit` la extiende con carga de texturas desde
  `freetype`/`libpng`.
- **`ps2gl`**: una API parecida a OpenGL.

Ambas construyen paquetes GIF y
los envían por DMA al GS. Las bibliotecas de más alto nivel construidas sobre una
de las dos generalmente no funcionan con la otra.

## Ubicación del frame buffer y z-buffer

Los frame buffers, z-buffers y texturas se colocan en
offsets dentro de esos 4MB, dimensionados para caber. Este
presupuesto lo administras tú (`gsKit` y `ps2gl`
tienen cada uno su asignador).

## Ver también

- [DMA](/es/guide/architecture/dma): cómo llegan los paquetes
- [Vector Units](/es/guide/architecture/vector-units): VU1
  normalmente construye los paquetes GIF
