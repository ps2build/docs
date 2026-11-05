# PSU <Badge type="warning" text="beta" />

> Esta página está em beta. Ela é compilada a partir da documentação da comunidade
> (o texto do formato PSU em ps2savetools.com), não do código-fonte deste SDK. Veja a nota
> em [MMCE](/pt-br/guide/community/mmce). Relate qualquer coisa que pareça errada,
> especialmente os offsets de bytes abaixo, porque as fontes da comunidade não concordam totalmente.

**PSU** é o formato de arquivo único padrão da comunidade para exportar
e importar conteúdo de cartão de memória: um save, um app homebrew ou uma
estrutura inteira de pastas reunidos em um só arquivo. A maioria dos gerenciadores
de cartão de memória (uLaunchELF e outros) move conteúdo nesse formato.

PSU é para conteúdo de **cartão de memória em formato padrão**, que usa o
mesmo layout de entradas de diretório de um cartão de memória de 8 MB. É
separado do **PFS**, o sistema de arquivos que `fs-osd` e
`hdd-osd` implementam para saves de HDD e do navegador do OSD (veja
[Armazenamento](/pt-br/guide/architecture/storage)). PSU não é usado para exportar conteúdo PFS.

## O que ele reúne

Um PSU empacota uma pasta do cartão de memória em um arquivo: os dados de save
ou os arquivos do aplicativo, o `icon.sys` da pasta (para que ela mantenha o
ícone ao ser descompactada em um cartão) e
metadados de diretório como timestamps. Descompactar um PSU em um
cartão de memória reproduz a pasta como o navegador de cartão de memória
espera.

## Onde é usado

- **Transferência de saves** - mover um save entre um cartão de memória, um PC
  e um cartão SD [MMCE](/pt-br/guide/community/mmce) sem o
  hardware original.
- **Distribuição de homebrew** - um app homebrew que vive em um cartão de memória
  é comumente distribuído como PSU, então instalá-lo significa descompactar
  um arquivo em vez de recriar uma estrutura de pastas.

## Especificação do formato

Um PSU é uma concatenação simples de **entradas**. O PSU de um save típico é uma entrada de diretório
(com a contagem de arquivos), depois as entradas obrigatórias `.` e `..`, depois uma
entrada por arquivo.

### Layout da entrada

Cada entrada contém, em ordem:

1. Um cabeçalho de 32 bytes (abaixo)
2. 32 bytes de preenchimento com zeros
3. Um campo de nome de 448 bytes com o nome da entrada, preenchido com zeros
4. O conteúdo do arquivo (0 bytes para uma entrada de diretório, `.` ou `..`)
5. Bytes de preenchimento que completam o conteúdo até um múltiplo de 1024 bytes

### O cabeçalho de 32 bytes

| Bytes | Campo |
|---|---|
| 0-1 | Tipo: `0x2784` para as entradas de diretório, `.` e `..`, `0x9784` para um arquivo regular, `0x27A0` para um arquivo de save protegido ou de sistema |
| 5-8 | Contagem de arquivos (entrada de diretório) ou tamanho do arquivo em bytes (entrada de arquivo), big-endian |
| 9-16 | Timestamp de criação: segundos, minutos, horas, dia, mês e ano de 2 bytes, no formato de data do cartão de memória do PS2 |
| 17-18 | Setor inicial do conteúdo no cartão de memória original. Sem significado após a exportação, porque um PSU não tem layout de cartão |
| 25-31 | Timestamp da última modificação, mesmo layout do timestamp de criação |

Todos os outros bytes do cabeçalho são reservados. A documentação da
comunidade os reporta como zero em todo PSU observado.

### Preenchimento de 1024 bytes

O conteúdo de cada entrada é preenchido até um limite de 1024 bytes, que corresponde ao
tamanho de cluster de um cartão de memória do PS2 formatado de forma padrão. Isso provavelmente
faz com que gravar um PSU de volta em um cartão seja uma cópia alinhada a clusters. A fonte
desta página não declara o motivo, então isto é uma inferência.

## Veja também

- [MMCE](/pt-br/guide/community/mmce) - uma convenção da comunidade em nível de hardware
  (esta página cobre um formato de arquivo)
- [Armazenamento](/pt-br/guide/architecture/storage) - a pilha de drivers de cartão de memória do SDK,
  e o PFS, o formato separado de HDD e OSD
