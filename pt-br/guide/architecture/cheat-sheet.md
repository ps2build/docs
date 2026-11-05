# Folha de referência <Badge type="warning" text="beta" />

> Esta seção está em beta e teve pouca revisão. Se algo parecer errado, abra uma issue.
> A [Introdução à arquitetura do PS2](/pt-br/guide/architecture/introduction) descreve o hardware de cada pacote.

Encontre o pacote para uma tarefa. Pacotes `core/` estão sempre
instalados. Pacotes `world/` e repositórios independentes precisam ser adicionados a `libs:`. Veja [Pacotes](/pt-br/guide/packages).

| Eu quero... | Use | Notas |
|---|---|---|
| Desenhar primitivas 2D/3D | `gsKit` (tier: standalone) ou `ps2gl` (standalone) | Duas APIs diferentes para o mesmo GS. Não use as duas ao mesmo tempo. Veja [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer). |
| Mover buffers para o GS/VU sem travar a CPU | `dmakit` (world) | Envolve tags e cadeias de DMA. Veja [DMA](/pt-br/guide/architecture/dma). |
| Fazer matemática de vetor/matriz | `math3d` (core), `ps2stuff` (standalone) | `math3d` é a biblioteca base do lado EE. `ps2stuff` adiciona helpers de nível mais alto. |
| Rodar código na VU1 | Microprogramas VU próprios do `gsKit`/`ps2gl`, ou asm VCL/VU escrito à mão | Não há pacote VU de propósito geral. Veja [Vector Units](/pt-br/guide/architecture/vector-units). |
| Tocar um efeito sonoro / transmitir música | `libsd`, `libspu2` (core, baixo nível); `audio` (world, a API de alto nível); `libsnd2`, `rspu2drv`, `sdr` (world, específicos de formato) | Veja [Áudio](/pt-br/guide/architecture/audio). |
| Decodificar MP3 | `libmad` (world) | Combine com `audio` para reprodução. |
| Ler um controle | `pad` (core, cliente RPC do lado EE) + `padman` (core, driver IOP, carregado automaticamente) | Veja [Controles](/pt-br/guide/architecture/controllers). |
| Ler/escrever um cartão de memória | `mc` (core, cliente EE) + `mcman`/`mcserv` (core, drivers IOP) | Use `mmceman` (world) para um emulador de cartão de memória. |
| Ler um cartão de memória no formato de save (PFS) | `fs-osd`/`hdd-osd` (core) | O sistema de arquivos de save do PS2, também usado no HDD. |
| Ler arquivos do disco | `cdvd`, `cdvdfsv`, `cdfs` (core) | Veja [Armazenamento](/pt-br/guide/architecture/storage). |
| Conversar com a rede | `netman` + `smap` (core, IOP) + `ps2ip` (core, lwIP do lado EE) | Veja [Rede](/pt-br/guide/architecture/networking), que também cobre a alternativa residente no IOP `ps2ip-nm`/`smap-ps2ip`. |
| Chamar de código EE um módulo IOP | `sifman`/`sifcmd` (core) | A ponte SIF/RPC. Veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif). |
| Corrigir uma syscall não suportada (ex.: `LoadModuleBuffer`) | `patches` (core, o diretório-fonte se chama `sbv`) | `sbv_patch_enable_lmb()` é a que quase todo programa não trivial chama. |
| Carregar fontes | `freetype` (standalone) + `gskit-toolkit` (world, liga ao sistema de texturas do `gsKit`) | |
| Carregar imagens PNG/JPEG | `libpng` (standalone), `libjpeg_ps2_addons`/`libjpeg-turbo` (world/standalone) | |
| Comprimir/descomprimir dados | `zlib` (standalone), `unzip` (world) | |
| Fazer hash de dados (MD5/SHA/CRC32) | `hash` (world) | Não específico do PS2. |
| Renderizar gráficos em ASCII art | `aalib` (world) | |
| Decodificar vídeo MPEG2 | `mpeg` (core) | Acelerado por IPU, DMAC e MMI. Veja [DMA](/pt-br/guide/architecture/dma) para os dois canais da IPU (`fromIPU`, `toIPU`). |
