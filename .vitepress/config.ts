import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from 'vitepress-carbon'
import baseConfig from 'vitepress-carbon/config'

const guideItems = (t: Record<string, string>) => [
  { text: t.gettingStarted, link: '/guide/getting-started' },
  { text: t.installation, link: '/guide/installation' },
  { text: 'ps2.yaml', link: '/guide/ps2-yaml' },
  { text: t.packages, link: '/guide/packages' },
  { text: t.availablePackages, link: '/guide/available-packages' },
  { text: t.customPackages, link: '/guide/custom-packages' },
  { text: t.migration, link: '/guide/migration' },
  { text: t.mcpSetup, link: '/guide/mcp' },
  { text: t.acknowledgements, link: '/guide/acknowledgements' },
]

const architectureItems = (t: Record<string, string>) => [
  { text: t.cheatSheet, link: '/guide/architecture/cheat-sheet' },
  { text: t.introduction, link: '/guide/architecture/introduction' },
  { text: 'Graphics Synthesizer', link: '/guide/architecture/graphics-synthesizer' },
  { text: 'DMA', link: '/guide/architecture/dma' },
  { text: t.eeIopSif, link: '/guide/architecture/ee-iop-sif' },
  { text: 'Vector Units', link: '/guide/architecture/vector-units' },
  { text: t.audio, link: '/guide/architecture/audio' },
  { text: t.controllers, link: '/guide/architecture/controllers' },
  { text: t.storage, link: '/guide/architecture/storage' },
  { text: t.networking, link: '/guide/architecture/networking' },
]

const communityItems = (t: Record<string, string>) => [
  { text: 'MMCE', link: '/guide/community/mmce' },
  { text: 'PSU', link: '/guide/community/psu' },
]

const SITE = 'https://ps2build.dev'
const OG_LOCALE: Record<string, string> = { root: 'en_US', es: 'es_ES', 'pt-br': 'pt_BR' }
const LOCALES = ['', '/es', '/pt-br']
const HREFLANG: Record<string, string> = { '': 'en', '/es': 'es', '/pt-br': 'pt-BR' }

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  title: 'PS2BUILD',
  description: 'Documentation for PS2 homebrew development',
  base: '/',
  cleanUrls: true,
  srcExclude: ['README.md', 'CONTRIBUTING.md', 'SECURITY.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' }],
    ['meta', { name: 'author', content: 'PS2BUILD' }],
    ['meta', { name: 'keywords', content: 'PS2, PlayStation 2, homebrew, SDK, ps2build, ps2sdk, build system, LLVM, GCC' }],
    [
      'script',
      {
        defer: '',
        src: 'https://umami.techwritescode.dev/script.js',
        'data-website-id': 'c601c969-6a94-4eac-9fc9-d8b39642eeca',
      },
    ],
  ],

  transformHead({ pageData, siteData, title, description }) {
    const route = '/' + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = SITE + (route.length > 1 ? route.replace(/\/$/, '') : '/')
    const prefix = LOCALES.find((l) => l && (route === l + '/' || route.startsWith(l + '/'))) ?? ''
    const key = prefix ? prefix.slice(1) : 'root'
    const path = route.slice(prefix.length) || '/'
    const isHome = pageData.frontmatter.layout === 'home'
    const pageTitle = isHome ? siteData.locales[key]?.title ?? siteData.title : title
    const desc = pageData.frontmatter.description ?? description
    const tags: [string, Record<string, string>][] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
      ['meta', { property: 'og:site_name', content: 'PS2BUILD' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:locale', content: OG_LOCALE[key] }],
      ['meta', { property: 'og:image', content: `${SITE}/icon.png` }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
      ['meta', { name: 'twitter:description', content: desc }],
      ['meta', { name: 'twitter:image', content: `${SITE}/icon.png` }],
      ['meta', { name: 'theme-color', content: '#1d5b76' }],
    ]
    for (const l of LOCALES) {
      const href = SITE + (l + path === '/' ? '/' : (l + path).replace(/\/$/, ''))
      tags.push(['link', { rel: 'alternate', hreflang: HREFLANG[l], href }])
    }
    return tags
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API Reference', link: '/api/' },
          { text: 'ps2build', link: 'https://github.com/ps2build/ps2build' },
          { text: 'All repos', link: 'https://github.com/ps2build' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: guideItems({
              gettingStarted: 'Getting started',
              installation: 'Installation',
              packages: 'Packages',
              availablePackages: 'Available packages',
              customPackages: 'Custom packages',
              migration: 'Migrating from ps2sdk',
              mcpSetup: 'MCP setup',
              acknowledgements: 'Acknowledgements',
            }).concat([{ text: 'LLVM toolchain', link: '/guide/llvm' }, { text: 'Making EE code faster', link: '/guide/optimization' }]),
          },
          {
            text: 'PS2 architecture (beta)',
            items: architectureItems({
              cheatSheet: 'Cheat sheet',
              introduction: 'Introduction',
              eeIopSif: 'EE, IOP, and SIF',
              audio: 'Audio',
              controllers: 'Controllers',
              storage: 'Storage',
              networking: 'Networking',
            }),
          },
          {
            text: 'PS2 Community (beta)',
            items: communityItems({}),
          },
        ],
      },
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      title: 'PS2BUILD',
      description: 'Documentación para el desarrollo homebrew de PS2',
      themeConfig: {
        nav: [
          { text: 'Guía', link: '/es/guide/getting-started' },
          { text: 'Referencia de API', link: '/es/api/' },
          { text: 'ps2build', link: 'https://github.com/ps2build/ps2build' },
          { text: 'Todos los repos', link: 'https://github.com/ps2build' },
        ],
        sidebar: [
          {
            text: 'Guía',
            items: guideItems({
              gettingStarted: 'Primeros pasos',
              installation: 'Instalación',
              packages: 'Paquetes',
              availablePackages: 'Paquetes disponibles',
              customPackages: 'Paquetes personalizados',
              migration: 'Migrando desde ps2sdk',
              mcpSetup: 'Configuración de MCP',
              acknowledgements: 'Agradecimientos',
            }).map((i) => ({ ...i, link: `/es${i.link}` })),
          },
          {
            text: 'Arquitectura de PS2 (beta)',
            items: architectureItems({
              cheatSheet: 'Hoja de referencia',
              introduction: 'Introducción',
              eeIopSif: 'EE, IOP y SIF',
              audio: 'Audio',
              controllers: 'Controles',
              storage: 'Almacenamiento',
              networking: 'Redes',
            }).map((i) => ({ ...i, link: `/es${i.link}` })),
          },
          {
            text: 'Comunidad de PS2 (beta)',
            items: communityItems({}).map((i) => ({ ...i, link: `/es${i.link}` })),
          },
        ],
      },
    },
    'pt-br': {
      label: 'Português (BR)',
      lang: 'pt-BR',
      link: '/pt-br/',
      title: 'PS2BUILD',
      description: 'Documentação para desenvolvimento homebrew de PS2',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt-br/guide/getting-started' },
          { text: 'Referência de API', link: '/pt-br/api/' },
          { text: 'ps2build', link: 'https://github.com/ps2build/ps2build' },
          { text: 'Todos os repos', link: 'https://github.com/ps2build' },
        ],
        sidebar: [
          {
            text: 'Guia',
            items: guideItems({
              gettingStarted: 'Primeiros passos',
              installation: 'Instalação',
              packages: 'Pacotes',
              availablePackages: 'Pacotes disponíveis',
              customPackages: 'Pacotes personalizados',
              migration: 'Migrando do ps2sdk',
              mcpSetup: 'Configuração do MCP',
              acknowledgements: 'Agradecimentos',
            }).map((i) => ({ ...i, link: `/pt-br${i.link}` })),
          },
          {
            text: 'Arquitetura do PS2 (beta)',
            items: architectureItems({
              cheatSheet: 'Folha de referência',
              introduction: 'Introdução',
              eeIopSif: 'EE, IOP e SIF',
              audio: 'Áudio',
              controllers: 'Controles',
              storage: 'Armazenamento',
              networking: 'Rede',
            }).map((i) => ({ ...i, link: `/pt-br${i.link}` })),
          },
          {
            text: 'Comunidade do PS2 (beta)',
            items: communityItems({}).map((i) => ({ ...i, link: `/pt-br${i.link}` })),
          },
        ],
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    footer: {
      copyright: 'Made with ❤️ by <a href="https://github.com/techwritescode">techwritescode</a>',
    },
  },

  sitemap: {
    hostname: 'https://ps2build.dev'
  }
})
