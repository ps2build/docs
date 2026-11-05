# Áudio <Badge type="warning" text="beta" />

> Seção nova, escrita à mão - veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

Como a maioria dos periféricos do PS2, o chip de som (SPU2) é
hardware do lado IOP - não existe um caminho direto EE-para-SPU2.
Todo pacote de áudio deste SDK é um driver IOP que de fato toca nos
registradores do SPU2, ou um cliente do lado EE que alcança um deles
via SIF (veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)).

## As camadas de verdade

Este SDK traz dois drivers SPU2 a nível de registrador genuinamente
separados, e tudo mais se constrói em cima de um deles:

```
core/libsd  ─────┐                     core/libspu2 ─────┐
                 │                                        │
             world/sdr                            world/libsnd2 (MIDI/sequenciador)
      (wrapper RPC, IOP)                                   │
                                              world/rspu2drv (RPC, linka AMBOS
                                               libsnd2 E libspu2)
```

- **`libsd`** e **`libspu2`** (ambos core) são drivers SPU2
  independentes a nível de registrador - acesso direto ao hardware,
  não existe caminho mais primitivo para nenhum dos dois. Não são
  duas versões da mesma coisa; são duas implementações separadas que
  por acaso ambas existem na história deste código-base.
- **`libsnd2`** (world) é uma camada MIDI/sequenciador construída
  sobre `libspu2`.
- **`rspu2drv`** (world) é um driver exposto por RPC que linka
  estaticamente *tanto* `libsnd2` quanto `libspu2` - o mais em
  camadas do grupo.
- **`sdr`** (world) é um wrapper RPC em torno de `libsd`
  especificamente (seu próprio binário IOP se chama literalmente
  `sdrdrv.irx`).
- **`ps2snd`** (core) é o *cliente* RPC do lado EE que corresponde a
  qual desses drivers IOP estiver rodando - o que seu código EE de
  fato chama.
- **`ahx`** (core) é um cliente RPC do lado EE separado,
  especificamente para o driver de codec de áudio AHX do IOP (um
  formato de áudio comprimido, distinto dos drivers SPU2 gerais
  acima).

## `audsrv`: o caminho fácil, deliberadamente fora dessa pilha

**`audsrv`** (repositório independente, não `sdk-core`/`sdk-world`) é
uma API de reprodução de nível mais alto - enfileire um som,
reproduza - e é de longe a forma mais fácil de colocar áudio em um
projeto homebrew. Ele é mantido como seu próprio repositório em vez
de um pacote `sdk-core` porque é LGPL-2, a única licença que o tier
`core` deste SDK não permite (veja a política de licenças em
[Pacotes](/pt-br/guide/packages)) - não porque seja de qualidade
inferior ou não mantido.

**`libmad`** (world) decodifica MP3 - combine com `audsrv` (ou um dos
drivers de nível mais baixo acima) para reprodução em vez de esperar
que ele produza som sozinho; ele só transforma áudio comprimido em
amostras PCM cruas.

## Escolhendo uma camada

Para praticamente qualquer jogo real, `audsrv` é o ponto de partida
certo - é a API construída para "eu tenho um efeito sonoro / uma
faixa de música, toque," sem precisar entender vozes do SPU2, lotes,
ou a encanação RPC diretamente. Recorra a
`libsd`/`libspu2`/`ps2snd` diretamente só se `audsrv` genuinamente não
conseguir fazer o que você precisa (efeitos de DSP sob medida,
controle direto a nível de voz) - isso é um salto bem maior em
complexidade.

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - por que
  "cliente EE + driver IOP" é a forma de quase todo par de pacotes
  aqui
- [Pacotes](/pt-br/guide/packages) - a divisão de licenças core/world
