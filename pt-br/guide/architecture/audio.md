# Áudio <Badge type="warning" text="beta" />

> Esta seção está em beta. Veja a nota na [folha de referência](/pt-br/guide/architecture/cheat-sheet).

Como a maioria dos periféricos do PS2, o chip de som (SPU2) é hardware do lado do IOP.
Não há caminho direto do EE para o SPU2. Todo pacote de áudio deste SDK é
um driver IOP que acessa os registradores do SPU2 ou um
cliente do lado EE que alcança um deles por SIF (veja
[EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif)).

## Camadas

Este SDK tem dois drivers SPU2 independentes em nível de registrador.
Todo o resto é construído sobre um deles:

```
core/libsd  ─────┐                     core/libspu2 ─────┐
                 │                                        │
             world/sdr                            world/libsnd2 (MIDI/sequenciador)
      (wrapper RPC, IOP)                                  │
                                              world/rspu2drv (RPC, linka OS DOIS
                                               libsnd2 E libspu2)
```

- **`libsd`** e **`libspu2`** (ambos core) são drivers SPU2 independentes
  em nível de registrador, com acesso direto ao hardware. São implementações separadas, não versões do mesmo driver.
- **`libsnd2`** (world) é uma camada de MIDI/sequenciador construída sobre `libspu2`.
- **`rspu2drv`** (world) é um driver exposto por RPC que linka estaticamente
  `libsnd2` e `libspu2`.
- **`sdr`** (world) é um wrapper RPC em volta do `libsd`
  (seu binário IOP é `sdrdrv.irx`).
- **`ps2snd`** (core) é o cliente RPC do lado EE para o driver IOP
  que estiver rodando. É o que o seu código EE chama.
- **`ahx`** (core) é um cliente RPC do lado EE separado para o driver de codec de áudio
  AHX do IOP (um formato de áudio comprimido). É independente dos drivers SPU2 acima.

## `audio`

**`audio`** (world) é uma API de reprodução de nível mais alto: carregue um som, toque-o em um canal ou envie PCM a um
stream para música e áudio de vídeo. Ele tem um driver
IOP, `audio.irx`, que controla o SPU2 por meio do `libsd`, e uma biblioteca EE, `libaudio.a`, que o seu código
linka. Sua licença é AFL-2.0, como o resto do tier `world`.

- **Sons e canais.** `audio_sound_load_apcm()` envia um arquivo `.adp` para a memória do SPU2 e
  `audio_play_sound()` o toca no primeiro canal livre. Cada um dos 24 canais mantém seu próprio volume, pan
  e pitch.
- **Stream.** `audio_stream_start()` define um formato (8 ou 16 bits, mono ou estéreo, de 8000 a 48000 Hz) e
  `audio_stream_queue_pcm()` o alimenta. A biblioteca converte para o que o SPU2 reproduz.
- **Efeitos.** O SPU2 tem reverb e delay por hardware. `audio_effect_set_preset()` escolhe um de dez presets
  (room, studio, hall, space, echo, delay, pipe e outros), e `audio_channel_set_effect_send()` ou
  `audio_stream_set_effect_send()` envia um canal ou o stream por ele. Selecione o preset antes de carregar
  sons: o efeito do stream precisa de memória de trabalho da mesma RAM do SPU2.
- **Carregando o driver.** Seu programa carrega `libsd.irx` e depois `audio.irx` antes de chamar `audio_init()`.
  Com o ps2build, `embed_irx: [libsd, "audio:audio"]` faz isso.

Dois exemplos, um player de sons e um gerador de tons, estão na pasta
[`audio/examples`](https://github.com/ps2build/sdk-world/tree/master/audio/examples) do
`sdk-world`. A [referência da API](https://api.ps2build.dev/sdk-world/latest/) cobre cada função, o formato `.adp` e as regras de
threads.

### Código escrito para o `audsrv`

**`audsrv-compat`** (world) fornece a API do audsrv sobre o `audio`, de modo que o código existente compila e roda
sem mudanças no fonte: linke `audsrv-compat` e embuta o driver sob o símbolo antigo com
`embed_irx: [libsd, "audio:audsrv"]`. Áudio de CD não é suportado e as chamadas de CD retornam erro. A
[referência da API](https://api.ps2build.dev/sdk-world/latest/) tem um guia de migração com uma linha por chamada do audsrv.

O [`audsrv`](https://github.com/ps2build/audsrv) original continua disponível como repositório próprio, sob
sua própria licença.

**`libmad`** (world) decodifica MP3 em amostras PCM. Ele alimenta o `audio` ou um dos drivers de nível mais baixo
para a reprodução.

## Resumo das camadas

| Necessidade | Pacote |
|---|---|
| Efeitos sonoros, streams de música, reverb | `audio` |
| Controle em nível de voz, DSP personalizado | `libsd`, `libspu2`, `ps2snd` |
| Sequenciamento MIDI | `libsnd2` |
| Decodificação de MP3 | `libmad` |

## Veja também

- [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif) - por que a maioria dos pacotes emparelha um cliente EE com um driver IOP
- [Pacotes](/pt-br/guide/packages) - a divisão de licenças entre core e world
