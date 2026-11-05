# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> Página nova, compilada a partir de documentação da comunidade e do
> próprio código-fonte deste SDK. Diferente da seção de
> [arquitetura do PS2](/pt-br/guide/architecture/introduction), a
> maior parte dela não pode ser verificada contra o código-fonte
> próprio deste SDK - trate como um ponto de partida, não como
> verdade absoluta, e sinalize qualquer coisa que pareça errada.

MMCE é um protocolo comunitário (e uma família de hardware) que faz
uma ranhura de cartão de memória ser capaz de muito mais que 8MB de
saves. Não faz parte do próprio modelo de hardware deste SDK - é uma
convenção de ecossistema para a qual este SDK tem um driver real e
funcional.

## O que de fato é

Um cartão de memória "inteligente" - hardware real que fica na
ranhura de cartão de memória - que emula o protocolo padrão de
cartão de memória sobre o [SIO2](/pt-br/guide/architecture/controllers)
enquanto na verdade armazena os dados em um cartão microSD. Duas
implementações reais:

- **SD2PSX** - código aberto e hardware aberto (desenvolvedor
  `@xyzz`; `sd2psxtd` é um fork popular de firmware estendido).
- **MemCard Pro 2** - um produto comercial (8BitMods).

Por ser apoiado em cartão SD, ele guarda dados de save
efetivamente ilimitados em vez do que cabe em um único cartão de
memória - e como o próprio protocolo SIO2 é emulado (não só o
armazenamento), um PS2 padrão não precisa de nenhum suporte especial
para usá-lo como um cartão de memória comum.

Uma extensão mais nova do protocolo vai além: o cartão também pode
servir dados de *jogo*, não só saves, permitindo que um loader como
o Open PS2 Loader dê boot em um jogo completo diretamente a partir do
cartão, alternando entre um cartão de memória "virtual" por-jogo e os
dados reais do jogo conforme necessário.

## A família de drivers deste SDK

O pacote `mmceman` do `sdk-world` na verdade são três módulos IOP
separados construídos a partir da mesma fonte upstream real
(`ps2-mmce/mmceman` v2.1.1, MIT), cada um com um trabalho diferente:

| Pacote | IRX | Papel |
|---|---|---|
| `mmceman` | `mmceman.irx` | O driver completo - registra um dispositivo real de sistema de arquivos IOP (baseado em `iomanX_AddDrv`). |
| `mmcedrv` | `mmcedrv.irx` | Uma variante mínima - só exporta leitura/escrita/seek a nível de setor, sem registro de dispositivo. Pensada para uso dentro do jogo, uma vez que um loader já tenha trocado a porta de cartão de memória para o modo MMCE. |
| `mmceigr` | `mmceigr.irx` | O menor dos três - um módulo de disparo único que emite o **reset dentro do jogo (IGR)** do MMCE, voltando ao cartão de memória de boot. Não tem nenhuma função de kernel importada - só acesso direto a registradores SIO2. |

Qual você precisa depende do que seu programa está fazendo: um
loader que precisa navegar/gerenciar o cartão quer o `mmceman`
completo; um jogo que só precisa ler/escrever seus próprios dados de
save depois que um loader já fez a troca quer o `mmcedrv` mais leve;
algo que precisa devolver o controle ao cartão de memória original
(voltar para um menu, por exemplo) quer o `mmceigr`.

## Veja também

- [Controles](/pt-br/guide/architecture/controllers) - o barramento
  SIO2 sobre o qual o MMCE é emulado
- [Armazenamento](/pt-br/guide/architecture/storage) - a pilha de
  driver de cartão de memória padrão (`mc`/`mcman`/`mcserv`) à qual o
  MMCE é uma alternativa direta
- [PSU](/pt-br/guide/community/psu) - o formato de arquivo no qual o
  conteúdo comunitário de cartão de memória é empacotado, um assunto
  separado do hardware/protocolo desta página
