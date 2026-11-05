# Folha de referência <Badge type="warning" text="beta" />

> Toda essa seção de arquitetura é nova e escrita à mão contra o
> código-fonte real, mas ainda não passou por muitos olhos - se algo
> aqui parece errado, pode ser que esteja. Veja
> [Introdução à arquitetura do PS2](/pt-br/guide/architecture/introduction)
> para a versão disso que explica *por quê*, não só *o quê*.

Vá direto ao pacote para uma tarefa. Pacotes `core/` estão sempre
instalados; pacotes `world/` e repositórios independentes precisam de
`libs:`/serem adicionados como dependência - veja
[Pacotes](/pt-br/guide/packages).

| Eu quero... | Use | Notas |
|---|---|---|
| Desenhar primitivas 2D/3D | `gsKit` (tier: standalone) ou `ps2gl` (standalone) | Duas APIs com formatos diferentes sobre o mesmo GS - veja [Graphics Synthesizer](/pt-br/guide/architecture/graphics-synthesizer). Não as duas ao mesmo tempo. |
| Mover buffers para o GS/VU sem travar a CPU | `dmakit` (world) | Envolve tags/cadeias de DMA - veja [DMA](/pt-br/guide/architecture/dma). |
| Fazer matemática de vetor/matriz | `math3d` (core), `ps2stuff` (standalone) | `math3d` é a biblioteca base do lado EE; `ps2stuff` adiciona helpers de nível mais alto. |
| Rodar código na VU1 | Microprogramas VU1 próprios do `gsKit`/`ps2gl`, ou asm VCL/VU escrito à mão | Não existe um "pacote VU" de propósito geral - veja [Vector Units](/pt-br/guide/architecture/vector-units). |
| Tocar um efeito sonoro / transmitir música | `libsd`, `libspu2` (core, baixo nível); `audsrv` (standalone, LGPL, o caminho fácil); `libsnd2`, `rspu2drv`, `sdr` (world, específicos de formato) | Veja [Áudio](/pt-br/guide/architecture/audio) para saber qual camada escolher. |
| Decodificar MP3 | `libmad` (world) | Combine com `audsrv` para reprodução. |
| Ler um controle | `pad` (core, cliente RPC do lado EE) + `padman` (core, driver IOP, carregado automaticamente) | Veja [Controles](/pt-br/guide/architecture/controllers). |
| Ler/escrever um cartão de memória | `mc` (core, cliente EE) + `mcman`/`mcserv` (core, drivers IOP) | `mmceman` (world) se você quiser um target de emulador de cartão de memória em vez de hardware real. |
| Ler um cartão de memória no formato de save (PFS) | `fs-osd`/`hdd-osd` (core) | O sistema de arquivos real de save do PS2, também usado no HDD. |
| Ler arquivos do disco | `cdvd`, `cdvdfsv`, `cdfs` (core) | Veja [Armazenamento](/pt-br/guide/architecture/storage). |
| Conversar com a rede | `netman` + `smap` (core, IOP) + `ps2ip` (core, lwIP do lado EE) | Veja [Rede](/pt-br/guide/architecture/networking) - e a alternativa residente no IOP `ps2ip-nm`/`smap-ps2ip`, uma arquitetura separada. |
| Chamar de código EE para um módulo IOP | `sifman`/`sifcmd` (core) | A ponte SIF/RPC - veja [EE, IOP e SIF](/pt-br/guide/architecture/ee-iop-sif). |
| Corrigir uma syscall não suportada (ex.: `LoadModuleBuffer`) | `patches` (core, o diretório-fonte se chama `sbv`) | `sbv_patch_enable_lmb()` é a que quase todo programa não trivial chama. |
| Carregar fontes | `freetype` (standalone) + `gskit-toolkit` (world, conecta ao sistema de texturas do `gsKit`) | |
| Carregar imagens PNG/JPEG | `libpng` (standalone), `libjpeg_ps2_addons`/`libjpeg-turbo` (world/standalone) | |
| Comprimir/descomprimir dados | `zlib` (standalone), `unzip` (world) | |
| Fazer hash de dados (MD5/SHA/CRC32) | `hash` (world) | Genérico, não específico do PS2. |
| Renderizar gráficos em ASCII-art | `aalib` (world) | |
| Decodificar vídeo MPEG2 | `mpeg` (core) | Acelerado por IPU/DMAC/MMI - veja [DMA](/pt-br/guide/architecture/dma) para os dois canais próprios da IPU (`fromIPU`/`toIPU`). |
