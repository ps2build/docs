<script setup>
import pkgs from '../../.vitepress/data/packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Pacotes disponíveis

Todo pacote desta lista pode ser usado pelo nome em `libs:`. Veja
[Pacotes](/pt-br/guide/packages) para entender como os nomes são resolvidos. Cada nome leva ao
seu código-fonte: o diretório de pacote do `sdk-core` ou `sdk-world`, seu próprio repositório ou,
para bibliotecas portadas, o projeto upstream. Um nome sem link ainda não tem fonte pública.
A lista corresponde à última release. Para verificar sua própria instalação, use a ferramenta
`search_packages` do [servidor MCP](/pt-br/guide/mcp).

`ps2build update` mantém os tiers `core` e `world` atualizados. Alguns pacotes `world`, entre eles `audsrv` e `ps2gl`, são mantidos em seus próprios repositórios, com seu
próprio calendário de releases. Veja [Pacotes
personalizados](/pt-br/guide/custom-packages) para instalá-los ou publicar o seu.

## core

Kernel, drivers, sistema de arquivos, memória e rede. A base com licença permissiva sobre a qual todo projeto é construído.

<PackageList :items="pkgs.core" />

## world

Gráficos, áudio, entrada e todo o resto, sem restrição de licença. Vários são ports de projetos
upstream e linkam diretamente àquele upstream. Outros quatro,
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
e [`ps2stuff`](https://github.com/ps2build/ps2stuff), são
mantidos em seus próprios repositórios e publicados de forma
independente do `sdk-world`. Veja
[Pacotes personalizados](/pt-br/guide/custom-packages).

<PackageList :items="pkgs.world" />
