# Vector Units <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

A EE tem duas **Vector Units** acopladas - VU0 e VU1 - processadores
pequenos e especializados construídos para exatamente o tipo de
matemática que um jogo 3D precisa fazer bastante: aritmética de
vetor/matriz, rodando em loop apertado, muitas vezes por frame.

## Duas unidades, duas relações diferentes com a EE

**VU0** fica perto da EE e pode rodar em um de dois modos: como um
coprocessador macro/micro fortemente acoplado ao qual a EE consegue
emitir instruções quase como uma extensão do próprio pipeline dela,
ou rodando seu próprio microprograma independente. É comumente usada
para matemática por-vértice que a CPU principal teria que fazer ela
mesma - skinning, termos de iluminação, esse tipo de trabalho por
objeto - intercalada com código EE normal.

**VU1** é mais independente - ela tipicamente roda seu próprio
microprograma continuamente, alimentada com um fluxo de dados de
vértice/matriz através do `DMA_CHANNEL_VIF1`, e seu trabalho mais
comum é exatamente o descrito em
[Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer):
transformar vértices e montar o pacote GIF que vai para o GS, então
a EE não precisa fazer esse trabalho de montagem de pacote ela mesma
e pode seguir para a lógica do próximo frame enquanto a VU1 continua
trabalhando.

## Não existe um "pacote VU" de propósito geral

Diferente de, digamos, áudio ou rede, não existe uma única biblioteca
neste SDK que envolva "as VUs" como uma facilidade geral - `math3d`
(core) é matemática de vetor/matriz do lado EE, não microcódigo de
VU. Programas VU reais neste ecossistema aparecem como:

- Assembly VU escrito à mão ou fonte VCL (um compilador voltado para
  VU), compilado separadamente e embutido/carregado como qualquer
  outro blob binário.
- Microprogramas pré-construídos empacotados dentro de uma biblioteca
  de nível mais alto - `gsKit`/`ps2gl` trazem cada um seu próprio
  microprograma VU1 de transformar-e-montar-pacote como um detalhe de
  implementação de "desenhe isso," não algo que você mesmo escreve a
  menos que esteja substituindo o pipeline delas.

Se um projeto precisa de código VU personalizado (um sistema de
partículas sob medida, um pipeline de vértice não padrão), isso é um
trabalho genuinamente de nível mais baixo do que recorrer a um pacote
existente - mais próximo de escrever sua própria pequena peça do
trabalho do `gsKit`/`ps2gl` do que de consumir uma biblioteca.

## Veja também

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer)
- [DMA](/pt-br/guide/architecture/dma) - VIF0/VIF1 são como os dados
  chegam à VU0/VU1 em primeiro lugar
