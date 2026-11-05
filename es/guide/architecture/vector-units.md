# Vector Units <Badge type="warning" text="beta" />

> Sección nueva, escrita a mano - consulta la nota en la [hoja de referencia](/es/guide/architecture/cheat-sheet).

La EE tiene dos **Vector Units** conectadas - VU0 y VU1 - procesadores
pequeños y especializados construidos para exactamente el tipo de
matemática que un juego 3D necesita hacer mucho: aritmética de
vectores/matrices, corrida en un ciclo ajustado, muchas veces por
frame.

## Dos unidades, dos relaciones distintas con la EE

**VU0** está situada cerca de la EE y puede correr en uno de dos
modos: como un coprocesador macro/micro fuertemente acoplado al que
la EE puede emitir instrucciones casi como una extensión de su propio
pipeline, o corriendo su propio microprograma independiente. Se usa
comúnmente para matemática por-vértice que de otra forma tendría que
hacer la CPU principal - skinning, términos de iluminación, ese tipo
de trabajo por objeto - intercalada con código EE normal.

**VU1** es más independiente - típicamente corre su propio
microprograma de forma continua, alimentada con un flujo de datos de
vértices/matrices a través de `DMA_CHANNEL_VIF1`, y su trabajo más
común es exactamente el descrito en
[Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer):
transformar vértices y construir el paquete GIF que va al GS, así la
EE no tiene que hacer ese trabajo de construcción de paquetes ella
misma y puede seguir con la lógica del siguiente frame mientras VU1
sigue trabajando.

## No hay un "paquete VU" de propósito general

A diferencia de, digamos, audio o redes, no hay una sola biblioteca
en este SDK que envuelva "las VU" como una facilidad general -
`math3d` (core) es matemática de vectores/matrices del lado EE, no
microcódigo VU. Los programas VU reales en este ecosistema aparecen
como:

- Ensamblador VU escrito a mano o fuente VCL (un compilador dirigido
  a VU), compilado por separado y empaquetado/cargado como cualquier
  otro blob binario.
- Microprogramas prearmados empaquetados dentro de una biblioteca de
  más alto nivel - `gsKit`/`ps2gl` traen cada uno su propio
  microprograma VU1 de transformar-y-construir-paquete como un
  detalle de implementación de "dibuja esto," no algo que escribes tú
  mismo a menos que estés reemplazando su pipeline.

Si un proyecto necesita código VU personalizado (un sistema de
partículas a medida, un pipeline de vértices no estándar), eso es un
trabajo genuinamente de más bajo nivel que recurrir a un paquete
existente - más cercano a escribir tu propia pequeña pieza del
trabajo de `gsKit`/`ps2gl` que a consumir una biblioteca.

## Ver también

- [Graphics Synthesizer](/es/guide/architecture/graphics-synthesizer)
- [DMA](/es/guide/architecture/dma) - VIF0/VIF1 son cómo los datos
  llegan a VU0/VU1 en primer lugar
