# Vector Units <Badge type="warning" text="beta" />

> Esta sección está en beta. Consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La EE tiene dos **Vector Units** conectadas, VU0 y VU1: procesadores
pequeños para aritmética de vectores y matrices.

## VU0 y VU1

**VU0** está junto a la EE y corre en uno de dos
modos: como coprocesador macro/micro fuertemente acoplado al que
la EE emite instrucciones como una extensión de su propio
pipeline, o ejecutando su propio microprograma independiente. Se usa
comúnmente para matemática por vértice que de otra forma haría
la CPU principal (skinning, iluminación y otro trabajo por objeto),
intercalada con código EE normal.

**VU1** es más independiente. Normalmente corre su propio
microprograma de forma continua, alimentada con vértices y matrices
por `DMA_CHANNEL_VIF1`. Su trabajo más
común es el descrito en
[Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer):
transformar vértices y construir el paquete GIF que va al GS. Así la
EE no construye paquetes
y puede seguir con la lógica del siguiente frame mientras VU1
trabaja.

## Programas VU

`math3d` (core) es matemática de vectores y matrices del lado EE, no
microcódigo VU. Los programas VU de este SDK son:

- Ensamblador VU escrito a mano o fuente VCL (un compilador para
  VU), compilado por separado y empaquetado y cargado como cualquier
  otro blob binario.
- Microprogramas prearmados dentro de una biblioteca de
  más alto nivel. `gsKit` y `ps2gl` incluyen cada uno un
  microprograma VU1 que transforma vértices y construye paquetes.

## Ver también

- [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer)
- [DMA](/es/guide/architecture/dma): VIF0 y VIF1 llevan los datos
  a VU0 y VU1
