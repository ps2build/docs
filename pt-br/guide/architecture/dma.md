# DMA <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O Direct Memory Access (DMA) move blocos de dados entre a RAM principal e
os demais componentes do PS2 sem que o EE os copie manualmente. O
GS, a VU1 e o IOP (via SIF) estão fora da memória do EE, então o DMA é como os dados chegam
a eles.

## Canais

Os canais definidos em `ee/dma/include/dma.h`:

| Canal | Valor | Direção |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (ou VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | A Image Processing Unit, que faz a decodificação MPEG2 que `core/mpeg` envolve (veja a [folha de referência](/pt-br/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | Um segundo caminho EE↔IOP, menos usado que SIF0 e SIF1 |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM, uma memória pequena e rápida local ao EE |

## dmakit

Uma transferência DMA é descrita por um **tag de DMA**: um pequeno cabeçalho com a origem, o tamanho, a
ação ao concluir e o próximo tag da cadeia. O `dmakit` (world) monta
cadeias de tags, espera a conclusão e oferece padrões de transferência comuns.

## Concorrência

As transferências DMA rodam **concorrentemente com a CPU**. Um buffer de origem não deve ser modificado nem reutilizado
até que sua transferência termine. O GS ou a VU recebe o conteúdo da memória no momento em que o motor de DMA
o lê, que pode diferir do conteúdo no momento da chamada.

## Veja também

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer) -
  o destino do canal GIF
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o destino dos
  canais SIF
- [Vector Units](/pt-br/guide/architecture/vector-units) - o destino dos
  canais VIF0/VIF1
