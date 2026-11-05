# Graphics Synthesizer <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

O Graphics Synthesizer (GS) é o chip gráfico do PS2 - seu próprio
silício, com sua própria memória de vídeo local, ficando ao lado da
EE em vez de dentro dela. Entender essa separação explica a maior
parte de como o código gráfico no PS2 realmente se parece.

## Memória local, não memória compartilhada

O GS tem 4MB de eDRAM no próprio chip, usados para o frame buffer, o
z-buffer, e toda textura atualmente residente na GPU. A EE **não
consegue ler nem escrever essa memória diretamente** - não existe um
ponteiro que você possa desreferenciar para tocar em um pixel. Tudo
que acaba na memória do GS (um upload de textura, um frame buffer
limpo, um triângulo) chega como um comando que o próprio GS executa.

## Pacotes GIF: como os comandos chegam ao GS

Esses comandos são empacotados como **pacotes GIF** (GIF = Graphics
Interface) - dados etiquetados que o front end do GS desempacota em
escritas de registrador e desenhos de primitivas. Um pacote
normalmente é entregue ao GS através do seu próprio canal DMA
(`DMA_CHANNEL_GIF`, canal 2 - veja [DMA](/pt-br/guide/architecture/dma))
em vez de escrito pela CPU palavra por palavra, já que isso travaria
a EE esperando o GS acompanhar o ritmo.

## Registradores privilegiados

Um punhado de registradores do GS são mapeados em memória diretamente
no próprio espaço de endereços da EE (não através de DMA) para coisas
que a CPU precisa tocar de forma síncrona - o timing de exibição, o
buffer de exibição atual, e o status de interrupção. Endereços reais,
do próprio `ee_regs.h` deste SDK:

| Registrador | Endereço | Propósito |
|---|---|---|
| `GS_PMODE` | `0x12000000` | Configuração do circuito de saída (quais circuitos de leitura estão ativos, mistura alfa entre eles) |
| `GS_SMODE1`/`GS_SMODE2` | `0x12000010`/`0x12000020` | Modo de timing/sincronismo de vídeo |
| `GS_BGCOLOR` | `0x120000e0` | Cor de fundo quando nada mais está sendo desenhado |
| `GS_CSR` | `0x12001000` | Controle/status - flag de interrupção de VSync, campo atual, reset |

Tudo o mais - tipo de primitiva, cor de vértice, parâmetros de
textura, modo de mistura alfa, os próprios ponteiros de frame/z-buffer
- passa por pacotes GIF, não por esse conjunto mapeado diretamente.

## Duas APIs sobre o mesmo chip

Este SDK traz duas bibliotecas diferentes para desenhar coisas de
fato, e elas **não devem ser usadas juntas** em um mesmo projeto:

- **`gsKit`** - a API mais tradicional, com cara de modo imediato:
  monta uma primitiva, chama uma função de desenho. `gskit-toolkit`
  estende ela com carregamento de textura a partir de
  `freetype`/`libpng`.
- **`ps2gl`** - uma API com formato diferente, mais próxima de um
  pequeno estilo OpenGL.

As duas no fim fazem a mesma coisa por baixo - montam pacotes GIF e
os enviam via DMA para o GS - só discordam de como seu código deveria
se parecer enquanto faz isso. Escolher uma em vez da outra cedo
importa, já que bibliotecas de nível mais alto construídas em cima de
qualquer uma delas geralmente não são portáveis para a outra.

## Onde o frame/z-buffer realmente ficam

Como a memória do GS não é simplesmente "mais RAM," frame buffers,
z-buffers, e texturas todos precisam ser explicitamente colocados em
offsets escolhidos dentro desses 4MB, dimensionados para caber - um
orçamento real e finito que você mesmo gerencia (`gsKit`/`ps2gl` têm
cada um seu próprio conceito de alocador para isso), diferente da RAM
principal onde `malloc` esconde a contabilidade.

## Veja também

- [DMA](/pt-br/guide/architecture/dma) - como os pacotes realmente
  chegam lá
- [Vector Units](/pt-br/guide/architecture/vector-units) - a VU1
  geralmente monta os pacotes GIF em primeiro lugar
