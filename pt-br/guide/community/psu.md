# PSU <Badge type="warning" text="beta" />

> Página nova, compilada a partir de documentação da comunidade (o
> artigo sobre o formato PSU do ps2savetools.com) em vez do próprio
> código-fonte deste SDK - veja a nota em
> [MMCE](/pt-br/guide/community/mmce). Trate como um ponto de partida,
> sinalize qualquer coisa que pareça errada, especialmente os offsets
> de bytes exatos abaixo - as fontes comunitárias não concordam todas
> byte a byte.

**PSU** é o formato padrão da comunidade para exportar e importar
conteúdo de cartão de memória em um único arquivo - um save, um app
homebrew, ou uma estrutura de pastas inteira, empacotados em um
arquivo em vez de copiar um diretório bruto por aí. É o formato com o
qual a maioria dos gerenciadores de cartão de memória (uLaunchELF e
outros) de fato move conteúdo.

O PSU é especificamente para conteúdo de **cartão de memória em
formato padrão** - a mesma forma de entrada de diretório que um
cartão de memória real de 8MB usa. É uma coisa diferente e separada
de **PFS**, o sistema de arquivos que `fs-osd`/`hdd-osd` implementam
para saves de HDD/navegador OSD (veja
[Armazenamento](/pt-br/guide/architecture/storage)) - um PSU não é
como o conteúdo PFS é exportado.

## O que ele empacota

Um PSU empacota uma pasta inteira de cartão de memória como um único
arquivo: os próprios dados de save ou arquivos da aplicação, o
`icon.sys` da pasta (assim ele continua aparecendo com um ícone
correto quando desempacotado de volta em um cartão), e metadados de
diretório como timestamps. É isso que o torna um formato de
exportação de fato em vez de só um zip de arquivos - desempacotar um
PSU de volta em um cartão de memória reproduz a pasta exatamente
como o navegador de cartão de memória espera vê-la.

## Onde você vai encontrar isso

- **Transferências de save** - mover um save entre um cartão de
  memória real, um PC, ou um cartão SD de
  [MMCE](/pt-br/guide/community/mmce), sem precisar do hardware
  original no meio.
- **Distribuição de homebrew** - um app homebrew pensado para viver
  em um cartão de memória é comumente distribuído como PSU, então
  instalá-lo é "desempacote este arquivo único" em vez de recriar
  manualmente uma estrutura de pastas.

## Especificação do formato

Um PSU é uma concatenação simples de **entradas** - não existe uma
árvore de sistema de arquivos além dessa sequência simples. O PSU
típico de um save é: uma entrada de diretório (carregando a contagem
de arquivos), depois as entradas obrigatórias `.` e `..`, depois uma
entrada por cada arquivo real.

### Layout de uma entrada

Cada entrada, em ordem:

1. Um cabeçalho de 32 bytes (abaixo)
2. 32 bytes de preenchimento zerado
3. Um campo de nome de 448 bytes - o nome da entrada, preenchido com
   zeros
4. O conteúdo de fato do arquivo (0 bytes para uma entrada de
   diretório/`.`/`..`)
5. Bytes de preenchimento, completando o conteúdo até um múltiplo de
   1024 bytes

### O cabeçalho de 32 bytes

| Bytes | Campo |
|---|---|
| 0-1 | Tipo: `0x2784` para as entradas de diretório/`.`/`..`, `0x9784` para um arquivo comum, `0x27A0` para um arquivo de save protegido/de sistema |
| 5-8 | Contagem de arquivos (na entrada de diretório) ou tamanho do arquivo em bytes (em uma entrada de arquivo), big-endian |
| 9-16 | Timestamp de criação - segundos/minutos/horas/dia/mês/ano de 2 bytes, formato de data de cartão de memória do PS2 |
| 17-18 | Setor inicial que o conteúdo ocuparia no cartão de memória *original* - sem sentido depois de exportado, já que um PSU não tem um layout de cartão próprio |
| 25-31 | Timestamp de última modificação, mesmo layout do timestamp de criação |

Tudo o mais no cabeçalho é reservado e, segundo a documentação da
comunidade, nunca visto com outro valor além de zero em um PSU real.

### Por que o preenchimento de 1024 bytes

Preencher o conteúdo de cada entrada até um limite de 1024 bytes bate
com o tamanho de cluster que um cartão de memória de PS2 formatado
padrão usa - possivelmente para que escrever o conteúdo de um PSU de
volta em um cartão real seja uma cópia direta alinhada a cluster, não
um motivo declarado explicitamente na fonte da qual esta página se
baseia, então trate como uma inferência embasada em vez de um fato
confirmado.

## Veja também

- [MMCE](/pt-br/guide/community/mmce) - uma convenção comunitária
  diferente, a nível de hardware (esta página é sobre *formato de
  arquivo*, não hardware de armazenamento)
- [Armazenamento](/pt-br/guide/architecture/storage) - a própria
  pilha de driver de cartão de memória deste SDK, e onde o PFS (o
  formato separado de HDD/OSD) é coberto
