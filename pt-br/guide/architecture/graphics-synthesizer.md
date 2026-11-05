# Graphics Synthesizer <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O Graphics Synthesizer (GS) é o chip gráfico do PS2. É um chip separado com sua própria
memória de vídeo local.

## Memória local

O GS tem 4MB de eDRAM no próprio chip, usados para o frame buffer, o
z-buffer e as texturas em uso. O EE
**não pode ler nem escrever nesta memória diretamente**. Tudo o que está na memória do GS (um upload de textura, um frame buffer limpo, um triângulo)
chega como um comando que o GS executa.

## Pacotes GIF

Os comandos são empacotados como **pacotes GIF** (GIF = Graphics
Interface): dados etiquetados que o front end do GS desempacota em
escritas de registradores e desenhos de primitivas. Um pacote normalmente é enviado ao GS por
seu próprio canal de DMA (`DMA_CHANNEL_GIF`, canal 2; veja
[DMA](/pt-br/guide/architecture/dma)).

## Registradores privilegiados

Alguns registradores do GS são mapeados em memória no espaço de endereços do EE
(sem passar por DMA) para o que a CPU precisa acessar de forma
síncrona: temporização de vídeo, o buffer de exibição atual e o status de
interrupção. Os endereços, de `ee_regs.h`:

| Registrador | Endereço | Finalidade |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Configuração do circuito de saída (quais circuitos de leitura estão ativos, alpha blending entre eles) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Temporização de vídeo e modo de sincronização |
| `GS_BGCOLOR` | `0x120000e0` | Cor de fundo quando nada mais é desenhado |
| `GS_CSR` | `0x12001000` | Controle e status: flag de interrupção de VSync, campo atual, reset |

Todo o resto, incluindo tipo de primitiva, cor de vértice, parâmetros de textura,
modo de alpha blend e os ponteiros do frame e do z-buffer, passa por
pacotes GIF.

## Bibliotecas de desenho

Este SDK tem duas bibliotecas para desenhar.
**Não as use juntas** em um mesmo projeto:

- **`gsKit`** - uma API em estilo de modo imediato:
  monte uma primitiva e chame uma função de desenho. O `gskit-toolkit` adiciona
  carregamento de texturas a partir de `freetype` e `libpng`.
- **`ps2gl`** - uma API semelhante a um pequeno subconjunto do OpenGL.

Ambas montam pacotes GIF e os enviam
por DMA ao GS. Bibliotecas de nível mais alto construídas sobre uma delas geralmente não
funcionam com a outra.

## Posicionamento do frame buffer e do z-buffer

Frame buffers, z-buffers e
texturas devem ser colocados em offsets escolhidos dentro
dos 4MB e dimensionados para caber. Você administra esse orçamento
(`gsKit` e `ps2gl` têm, cada uma, um alocador para isso).

## Veja também

- [DMA](/pt-br/guide/architecture/dma) - como os pacotes chegam ao GS
- [Vector Units](/pt-br/guide/architecture/vector-units) - a VU1 geralmente monta
  os pacotes GIF
