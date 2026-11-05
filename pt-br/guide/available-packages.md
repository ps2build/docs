<script setup>
import pkgs from '../../.vitepress/data/packages.json'
import PackageList from '../../.vitepress/components/PackageList.vue'
</script>

# Pacotes disponíveis

Todo pacote aqui está pronto para usar em `libs:` pelo nome - veja
[Pacotes](/pt-br/guide/packages) para entender como funciona a
resolução. Cada nome leva a onde o código-fonte realmente vive - o
diretório de pacote do `sdk-core`/`sdk-world`, seu próprio repositório,
ou (para algumas bibliotecas portadas) o próprio projeto upstream. Um
nome sem link ainda não é rastreado publicamente em nenhum lugar. Esta
lista reflete o que está realmente instalado pela última release; se
você não tem certeza se um nome está atualizado, a ferramenta
`search_packages` do [servidor MCP](/pt-br/guide/mcp) verifica sua
própria instalação diretamente.

`core` e `world` são os dois tiers que `ps2build update` mantém
atualizados para você. Alguns pacotes `world` - `audsrv` e `ps2gl`
entre eles - são mantidos em seus próprios repositórios, com seu
próprio calendário de releases. Veja [Pacotes
personalizados](/pt-br/guide/custom-packages) para ver como são
instalados, ou como publicar o seu da mesma forma.

## core

Kernel, drivers, sistema de arquivos, memória, e rede - a base com
licença permissiva sobre a qual todo projeto é construído.

<PackageList :items="pkgs.core" />

## world

Gráficos, áudio, entrada, e todo o resto - o tier de conveniência, sem
restrição de licença. Vários destes são ports de projetos upstream
reais, linkados diretamente àquele upstream em vez de a um espelho
interno. Alguns outros -
[`audsrv`](https://github.com/ps2build/audsrv),
[`ps2gl`](https://github.com/ps2build/ps2gl),
[`ps2glut`](https://github.com/ps2build/ps2gl/tree/master/glut),
e [`ps2stuff`](https://github.com/ps2build/ps2stuff) - são
mantidos em seus próprios repositórios, publicados de forma
independente do `sdk-world`, e instalados da mesma forma. Veja
[Pacotes personalizados](/pt-br/guide/custom-packages) para ver como
são feitos.

<PackageList :items="pkgs.world" />
