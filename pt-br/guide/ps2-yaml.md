# ps2.yaml

A definição de build que o `ps2build` lê. O `ps2build init` gera uma mínima:

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
  cglue, cdvd) são linkadas automaticamente. Liste apenas
  bibliotecas adicionais em `libs:`. Defina `output_bin: true` para
  também gerar um `.bin` plano, ou `pack: true` para gerar um
  `<name>-packed.elf` comprimido e autoextraível.
- **`iop`** - um módulo `.irx` relocável. Linkado com
  `-nostdlib -dc -r`, stripped e depois processado pelo
  `iopfixup`.
- **`ee_lib` / `iop_lib`** - compila como um target `ee` ou `iop` mas
  gera `lib<name>.a` e não é linkado por si só.
  Um target `ee` linka um `ee_lib` (e `iop` um
  `iop_lib`) listando o nome do target, sem `lib<name>.a`, no seu
  `libs:` junto com os nomes de bibliotecas externas. A ordem de linkagem é preservada
  como escrita, então a ordem importa.

O linkado final de um target `ee` muda automaticamente para o driver
de linkagem de C++ quando o target tem uma fonte `.cpp`, `.cc` ou `.cxx`, ou linka um
`ee_lib` que tem. Nenhuma configuração é necessária.

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
uma única vez.

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

A ferramenta imprime o JSON Schema completo:

```bash
ps2build schema
```
