# ps2.yaml

A definição de build que o `ps2build` lê. Uma mínima, vinda do
`ps2build init`:

```yaml
project: my-game

targets:
  - name: my-game
    type: ee
    sources: [src/main.c]
```

## Tipos de target

Todo target tem um `type`: `ee`, `iop`, `ee_lib`, ou `iop_lib`.

- **`ee`** - um `.elf` inicializável. As bibliotecas padrão (kernel,
  cglue, cdvd) já são linkadas automaticamente - liste apenas
  bibliotecas *extras* em `libs:`. Defina `output_bin: true` para
  também gerar um `.bin` plano, ou `pack: true` para gerar um
  `<name>-packed.elf` comprimido e autoextraível.
- **`iop`** - um módulo `.irx` relocável. Linkado de forma especial
  (`-nostdlib -dc -r`), stripped, e depois passado pela ferramenta
  `iopfixup`.
- **`ee_lib` / `iop_lib`** - compila como um target `ee`/`iop` mas
  arquiva em `lib<name>.a` em vez de linkar - nunca é linkado por si
  só. Um target `ee` linka contra um `ee_lib` (e `iop` contra
  `iop_lib`) listando o *nome* do target (não `lib<name>.a`) no seu
  próprio `libs:`, junto com quaisquer nomes de bibliotecas externas,
  na mesma lista - a ordem importa, já que a ordem de linkagem estática
  é preservada exatamente como escrita.

O linkado final de um target `ee` muda automaticamente para o driver
de linkagem de C++ sempre que suporte a runtime de C++ é necessário -
suas próprias fontes contêm um arquivo `.cpp`/`.cc`/`.cxx`, ou ele
linka um `ee_lib` que contém. Você nunca precisa fazer nada para
ativar isso.

## Incorporando um módulo IOP (`embed_irx`)

Um target `ee` pode listar targets `iop` pelo nome em `embed_irx:`.
Para cada um, o `ps2build` roda o `bin2c` sobre o `.irx` compilado e
linka o resultado:

```c
extern unsigned char <name>_irx[];
extern unsigned int size_<name>_irx;
SifExecModuleBuffer(<name>_irx, size_<name>_irx, 0, NULL, NULL);
```

Se dois targets `ee` incorporam o mesmo módulo `iop`, ele é compilado
apenas uma vez e compartilhado.

## Campos

| Campo | Aplica-se a | Significado |
|---|---|---|
| `project` | raiz | Nome do projeto (apenas documentação) |
| `targets` | raiz | A lista de targets de build |
| `name` | target | Nome único - o alias do ninja, e como outros targets o referenciam |
| `type` | target | `ee` / `iop` / `ee_lib` / `iop_lib` |
| `sources` | target | Caminhos explícitos de arquivos-fonte (`.c`/`.cpp`/`.s`/`.S`) |
| `include_dirs` | target | Diretórios `-I` extras |
| `defines` | target | Defines extras do pré-processador |
| `cflags` | target | Flags de compilação extras |
| `ldflags` | target | Flags de linkagem extras (apenas `ee`/`iop`) |
| `libs` | target | Bibliotecas extras e/ou nomes de `ee_lib`/`iop_lib` do mesmo arquivo (apenas `ee`/`iop`) |
| `headers` | target | Pacotes instalados cujos headers este target precisa para compilar - sem linkar. Válido em todo tipo de target, incluindo `ee_lib`/`iop_lib` |
| `linkfile` | target | Sobrescreve o script de linkagem padrão (apenas `ee`/`iop`) |
| `opt` | target | Sobrescreve a flag de otimização (padrão `-O2` em ee, `-Os` em iop) |
| `debug` | target | Adiciona `-gdwarf-2 -gz` |
| `embed_irx` | target | Apenas `ee` - targets `iop` para incorporar via `bin2c` |
| `output_bin` | target | Apenas `ee` - também gera um `.bin` plano |
| `pack` | target | Apenas `ee` - roda `ps2pack` para gerar um `<name>-packed.elf` comprimido e autoextraível |
| `imports_lst` | target | Apenas `iop` - caminho para um arquivo `imports.lst` |
| `exports_tab` | target | Apenas `iop` - caminho para um arquivo `exports.tab` |

Garantido estar correto - o JSON Schema completo vem direto da própria
ferramenta:

```bash
ps2build schema
```
