# DMA <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O Direct Memory Access (DMA) move blocos de dados entre a RAM
principal e os outros componentes do PS2 sem a EE copiá-los à mão.
Como o GS, a VU1, e o IOP (via SIF) são todos destinos separados fora
da própria memória da EE, o DMA é como os dados realmente chegam a
qualquer um deles em um programa real - não é uma otimização que você
adiciona depois.

## Dez canais, um trabalho cada um

A lista real e embutida de canais deste SDK
(`ee/dma/include/dma.h`):

| Canal | Valor | Direção |
|---|---|---|
| `DMA_CHANNEL_VIF0` | 0 | EE → VU0 |
| `DMA_CHANNEL_VIF1` | 1 | EE → VU1 |
| `DMA_CHANNEL_GIF` | 2 | EE (ou VU1) → GS |
| `DMA_CHANNEL_fromIPU` / `DMA_CHANNEL_toIPU` | 3 / 4 | A Image Processing Unit - a IPU é o que realmente faz o trabalho de decodificação MPEG2 que `core/mpeg` envolve (veja a [folha de referência](/pt-br/guide/architecture/cheat-sheet)) |
| `DMA_CHANNEL_fromSIF0` / `DMA_CHANNEL_toSIF1` | 5 / 6 | EE ↔ IOP (veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)) |
| `DMA_CHANNEL_SIF2` | 7 | Um segundo caminho EE↔IOP separado (usado com menos frequência que SIF0/1) |
| `DMA_CHANNEL_fromSPR` / `DMA_CHANNEL_toSPR` | 8 / 9 | Scratchpad RAM (uma memória pequena e rápida local à EE) |

O canal que você usa segue diretamente de para onde os dados estão
indo - enviar dados de vértice/textura para o GS significa o canal
GIF, enviar uma requisição RPC para o IOP significa um canal SIF, e
assim por diante. Não existe uma chamada genérica de "DMA para
qualquer lugar."

## Por que o `dmakit` existe

Enfileirar uma transferência DMA de verdade significa construir uma
**tag DMA** (um pequeno cabeçalho descrevendo a transferência -
origem, tamanho, e o que fazer quando terminar ou quando encadear com
a próxima tag) e escrevê-la nos registradores do canal certo.
`dmakit` (tier world) envolve isso: construir cadeias de tags, esperar
a conclusão, e os padrões comuns (envie este buffer, depois este
outro, depois me interrompa) em vez de montar bytes de tag à mão em
cada ponto de chamada.

## Por que isso importa para como você estrutura o código

Como as transferências DMA rodam **concorrentemente com a CPU**, um
programa real construído em torno disso se parece diferente de um que
apenas chama uma função bloqueante de "desenhe agora": você
enfileira trabalho, faz outra coisa (monta os dados do próximo
frame, roda a lógica do jogo), e só sincroniza quando realmente
precisa do resultado ou precisa reusar um buffer que o motor DMA
ainda não terminou de ler. Reusar um buffer de origem antes que sua
transferência DMA de fato tenha terminado é um bug clássico do PS2 -
os dados que o GS/VU acaba vendo são o que estava na memória no
momento em que o motor DMA chegou até eles, não no momento em que
você chamou a função.

## Veja também

- [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer) -
  o destino do canal GIF
- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - o destino
  dos canais SIF
- [Vector Units](/pt-br/guide/architecture/vector-units) - o destino
  dos canais VIF0/VIF1
