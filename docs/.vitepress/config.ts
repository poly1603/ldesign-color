import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/color',
  description: '高性能颜色生成和管理库',
  base: '/ldesign-color/',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1890ff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:title', content: '@ldesign/color | 高性能颜色生成库' }],
    ['meta', { property: 'og:site_name', content: '@ldesign/color' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://ldesign.github.io/color/' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/color-generator' },
      { text: '示例', link: '/examples/' },
      { text: '演示', link: '/demo/' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/ldesign/color' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/@ldesign/color' },
          { text: 'LDesign', link: 'https://ldesign.github.io' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '基础概念', link: '/guide/concepts' }
          ]
        },
        {
          text: '核心功能',
          items: [
            { text: '颜色生成', link: '/guide/color-generation' },
            { text: '主题系统', link: '/guide/theme-system' },
            { text: '明暗模式', link: '/guide/dark-mode' },
            { text: 'CSS变量', link: '/guide/css-variables' }
          ]
        },
        {
          text: 'Vue集成',
          items: [
            { text: '组合式API', link: '/guide/vue-composables' },
            { text: '组件', link: '/guide/vue-components' },
            { text: '最佳实践', link: '/guide/best-practices' }
          ]
        },
        {
          text: '高级功能',
          items: [
            { text: '性能优化', link: '/guide/performance' },
            { text: '缓存策略', link: '/guide/caching' },
            { text: 'Web Worker', link: '/guide/web-worker' },
            { text: '自定义配置', link: '/guide/configuration' }
          ]
        }
      ],
      '/api/': [
        {
          text: '核心API',
          items: [
            { text: 'ColorGenerator', link: '/api/color-generator' },
            { text: 'SemanticColorGenerator', link: '/api/semantic-color-generator' },
            { text: 'PaletteGenerator', link: '/api/palette-generator' },
            { text: 'CSSVariableGenerator', link: '/api/css-variable-generator' }
          ]
        },
        {
          text: 'Vue API',
          items: [
            { text: 'useColor', link: '/api/use-color' },
            { text: 'useThemeSwitch', link: '/api/use-theme-switch' },
            { text: 'ColorProvider', link: '/api/color-provider' },
            { text: 'ColorPicker', link: '/api/color-picker' },
            { text: 'ColorPalette', link: '/api/color-palette' }
          ]
        },
        {
          text: '工具函数',
          items: [
            { text: '颜色工具', link: '/api/color-utils' },
            { text: '缓存工具', link: '/api/cache-utils' },
            { text: '性能工具', link: '/api/performance-utils' }
          ]
        },
        {
          text: '类型定义',
          items: [
            { text: '类型总览', link: '/api/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '基础示例',
          items: [
            { text: '快速开始', link: '/examples/basic' },
            { text: '颜色生成', link: '/examples/color-generation' },
            { text: '主题切换', link: '/examples/theme-switching' }
          ]
        },
        {
          text: 'Vue示例',
          items: [
            { text: '组合式API', link: '/examples/vue-composables' },
            { text: '组件使用', link: '/examples/vue-components' },
            { text: '完整应用', link: '/examples/vue-app' }
          ]
        },
        {
          text: '高级示例',
          items: [
            { text: '性能优化', link: '/examples/performance' },
            { text: '自定义主题', link: '/examples/custom-theme' },
            { text: '批量处理', link: '/examples/batch-processing' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/color' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 LDesign Team'
    },

    editLink: {
      pattern: 'https://github.com/ldesign/color/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    }
  }
})
