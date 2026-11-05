# Vector Units <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O EE tem duas **Vector Units** conectadas, VU0 e VU1. São
processadores pequenos para aritmética de vetores e matrizes.

## VU0 e VU1

A **VU0** fica junto ao EE e roda em um de dois modos: como um
coprocessador fortemente acoplado ao qual o EE emite instruções
como uma extensão do seu próprio pipeline, ou rodando seu próprio
microprograma. É usada comumente para matemática por vértice e por objeto,
como skinning e termos de iluminação, intercalada com código EE comum.

A **VU1** é mais independente. Ela costuma rodar seu próprio microprograma
continuamente, alimentada com dados de vértices e matrizes por
`DMA_CHANNEL_VIF1`. Sua tarefa habitual está descrita em
[Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer):
ela transforma vértices e monta o pacote GIF para o GS,
de modo que o EE possa seguir para a lógica do próximo frame enquanto a VU1 trabalha.

## Programas VU

`math3d` (core) é matemática de vetores e matrizes do lado EE, não microcódigo VU.
Os programas VU deste SDK são:

- Assembly VU escrito à mão ou fonte VCL (um compilador voltado a VU),
  compilados separadamente e embutidos ou carregados como qualquer outro binário.
- Microprogramas pré-compilados em uma biblioteca de nível mais alto.
  `gsKit` e `ps2gl` incluem, cada uma, um microprograma VU1 que transforma vértices e monta pacotes.

## Veja também

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer)
- [DMA](/pt-br/guide/architecture/dma) - `VIF0` e `VIF1` levam dados à
  VU0 e à VU1
