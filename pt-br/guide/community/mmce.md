# MMCE (Multi-Purpose Memory Card Emulator) <Badge type="warning" text="beta" />

> Esta página está em beta. Ela é compilada a partir da documentação da comunidade e do
> código-fonte do pacote `mmceman`. Diferente da seção de [arquitetura do PS2](/pt-br/guide/architecture/introduction),
> a maior parte dela não pode ser verificada no código-fonte deste SDK.
> Relate qualquer coisa que pareça errada.

MMCE é um protocolo da comunidade e uma família de hardware que permite a um
slot de cartão de memória guardar muito mais que 8 MB de saves. Não faz
parte do modelo de hardware do PS2. Este
SDK inclui um driver funcional para ele.

## Visão geral

Um cartão MMCE fica no slot do cartão de memória e
emula o protocolo padrão de cartão de memória sobre
[SIO2](/pt-br/guide/architecture/controllers), guardando os dados
em um cartão microSD. Duas implementações:

- **SD2PSX** - código aberto e hardware aberto (desenvolvedor `@xyzz`;
  `sd2psxtd` é um fork popular de firmware estendido).
- **MemCard Pro 2** - um produto comercial (8BitMods).

Como o cartão usa armazenamento SD, ele guarda muito mais dados de save
que um cartão de memória. Como o próprio protocolo SIO2
é emulado, um PS2 padrão não precisa
de suporte especial para usá-lo como cartão de memória.

Uma extensão de protocolo mais nova permite que o cartão também sirva
dados de jogo, de modo que um loader como o Open PS2 Loader possa iniciar
um jogo a partir do cartão, alternando entre um cartão de memória virtual
por jogo e os dados do jogo conforme necessário.

## Drivers neste SDK

O pacote `mmceman` do `sdk-world` compila três módulos IOP
a partir do mesmo código-fonte upstream
(`ps2-mmce/mmceman` v2.1.1, MIT):

| Pacote | IRX | Função |
|---|---|---|
| `mmceman` | `mmceman.irx` | O driver completo. Registra um dispositivo de sistema de arquivos do IOP (baseado em `iomanX_AddDrv`). |
| `mmcedrv` | `mmcedrv.irx` | Uma variante mínima com exports de leitura, escrita e seek em nível de setor e sem registro de dispositivo. Para uso dentro do jogo depois que um loader colocou a porta do cartão de memória em modo MMCE. |
| `mmceigr` | `mmceigr.irx` | O menor módulo. Emite o **in-game reset (IGR)** do MMCE, que volta ao cartão de memória de boot. Não importa funções do kernel e usa acesso inline aos registradores do SIO2. |

| Programa | Módulo |
|---|---|
| Loader que navega e gerencia o cartão | `mmceman` |
| Jogo que lê e grava seus próprios saves depois que um loader trocou de modo | `mmcedrv` |
| Programa que devolve o controle ao cartão de memória original | `mmceigr` |

## Veja também

- [Controles](/pt-br/guide/architecture/controllers) - o barramento SIO2 que o MMCE
  emula
- [Armazenamento](/pt-br/guide/architecture/storage) - a pilha de drivers de cartão de memória
  padrão (`mc`, `mcman`, `mcserv`) que o MMCE substitui
- [PSU](/pt-br/guide/community/psu) - o formato de arquivo para conteúdo de cartão de memória
  da comunidade, separado do hardware e do
  protocolo desta página
