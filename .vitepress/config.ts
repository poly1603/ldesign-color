import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/color',
  description: '现代化、高性能的颜色处理库',
  lang: 'zh-CN',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      { text: '示例', link: '/examples/basic' },
      {
        text: 'v1.1.0',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com/ldesign/color' }
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
            { text: '核心概念', link: '/guide/core-concepts' }
          ]
        },
        {
          text: '核心功能',
          items: [
            { text: '颜色创建与转换', link: '/guide/color-creation' },
            { text: '颜色操作', link: '/guide/color-manipulation' },
            { text: '颜色分析', link: '/guide/color-analysis' },
            { text: '调色板生成', link: '/guide/palette-generation' }
          ]
        },
        {
          text: '高级功能',
          items: [
            { text: '色彩空间', link: '/guide/color-spaces' },
            { text: '渐变系统', link: '/guide/gradients' },
            { text: '色彩和谐', link: '/guide/color-harmony' },
            { text: '设计系统集成', link: '/guide/design-systems' },
            { text: '批量处理', link: '/guide/batch-processing' }
          ]
        },
        {
          text: '无障碍与主题',
          items: [
            { text: '无障碍支持', link: '/guide/accessibility' },
            { text: '主题管理', link: '/guide/themes' },
            { text: '暗色模式', link: '/guide/dark-mode' }
          ]
        },
        {
          text: '框架集成',
          items: [
            { text: 'React', link: '/guide/react' },
            { text: 'Vue', link: '/guide/vue' }
          ]
        },
        {
          text: '性能优化',
          items: [
            { text: '性能最佳实践', link: '/guide/performance' },
            { text: '缓存策略', link: '/guide/caching' }
          ]
        }
      ],

      '/api/': [
        {
          text: '核心 API',
          items: [
            { text: 'Color', link: '/api/core' },
            { text: 'ColorAdvanced', link: '/api/advanced' }
          ]
        },
        {
          text: '功能模块',
          items: [
            { text: '无障碍', link: '/api/accessibility' },
            { text: '动画', link: '/api/animation' },
            { text: '分析器', link: '/api/analyzer' },
            { text: '批量处理', link: '/api/batch' },
            { text: '品牌色', link: '/api/brand' },
            { text: '渐变', link: '/api/gradient' },
            { text: '色彩和谐', link: '/api/harmony' },
            { text: '性能', link: '/api/performance' },
            { text: '插件', link: '/api/plugin' }
          ]
        },
        {
          text: '设计系统',
          items: [
            { text: 'Ant Design', link: '/api/design-systems/ant-design' },
            { text: 'Material Design', link: '/api/design-systems/material-design' },
            { text: 'Chakra UI', link: '/api/design-systems/chakra-ui' },
            { text: 'Carbon Design', link: '/api/design-systems/carbon' },
            { text: 'Fluent UI', link: '/api/design-systems/fluent' },
            { text: 'Tailwind CSS', link: '/api/design-systems/tailwind' }
          ]
        },
        {
          text: '框架集成',
          items: [
            { text: 'React', link: '/api/react' },
            { text: 'Vue', link: '/api/vue' }
          ]
        },
        {
          text: '工具函数',
          items: [
            { text: '工具函数', link: '/api/utils' },
            { text: '类型定义', link: '/api/types' }
          ]
        }
      ],

      '/examples/': [
        {
          text: '基础示例',
          items: [
            { text: '基础用法', link: '/examples/basic' },
            { text: '颜色转换', link: '/examples/conversion' },
            { text: '颜色操作', link: '/examples/manipulation' }
          ]
        },
        {
          text: '高级示例',
          items: [
            { text: '渐变生成', link: '/examples/gradients' },
            { text: '调色板生成', link: '/examples/palettes' },
            { text: '色彩和谐', link: '/examples/harmony' },
            { text: '颜色动画', link: '/examples/animation' }
          ]
        },
        {
          text: '设计系统',
          items: [
            { text: '设计系统集成', link: '/examples/design-systems' },
            { text: '主题生成', link: '/examples/themes' }
          ]
        },
        {
          text: '实战应用',
          items: [
            { text: '颜色选择器', link: '/examples/color-picker' },
            { text: '主题切换器', link: '/examples/theme-switcher' },
            { text: '无障碍检查', link: '/examples/accessibility-checker' },
            { text: '品牌色系统', link: '/examples/brand-colors' }
          ]
        },
        {
          text: '性能优化',
          items: [
            { text: '批量处理', link: '/examples/batch-processing' },
            { text: '性能优化', link: '/examples/performance' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/color' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present LDesign Team'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
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
    },

    editLink: {
      pattern: 'https://github.com/ldesign/color/edit/master/packages/color/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  }
})


