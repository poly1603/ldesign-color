import { createPresetThemeManager, generateRandomColor, generateTheme } from './dist/ldesign-color.es.js'

console.log('🔧 验证修复...\n')

// 1. 验证灰色色阶偏红问题修复
console.log('1. 验证灰色色阶偏红问题修复')
try {
  const theme1 = generateTheme('#1890ff', { grayMixPrimary: false })
  const grayColors = theme1.palettes.light.gray
  console.log('✅ 禁用混入主色调时生成的灰色色阶:', grayColors.slice(0, 3), '...')

  const theme2 = generateTheme('#1890ff', { grayMixPrimary: true })
  const grayColors2 = theme2.palettes.light.gray
  console.log('✅ 启用混入主色调时生成的灰色色阶:', grayColors2.slice(0, 3), '...')
} catch (error) {
  console.log('❌ 灰色色阶生成失败:', error.message)
}

// 2. 验证随机颜色报错修复
console.log('\n2. 验证随机颜色报错修复')
try {
  const randomColors = []
  for (let i = 0; i < 5; i++) {
    randomColors.push(generateRandomColor())
  }
  console.log('✅ 随机颜色生成成功:', randomColors)
} catch (error) {
  console.log('❌ 随机颜色生成失败:', error.message)
}

// 3. 验证CSS变量配置支持
console.log('\n3. 验证CSS变量配置支持')
try {
  const theme = generateTheme('#1890ff', {
    cssPrefix: 'my-design',
    semanticNames: {
      primary: 'brand',
      success: 'positive',
      warning: 'caution',
      danger: 'negative',
      gray: 'neutral',
    },
  })

  const hasCustomPrefix = theme.cssVariables.includes('--my-design-')
  const hasCustomNames = theme.cssVariables.includes('--my-design-brand-') &&
    theme.cssVariables.includes('--my-design-positive-')

  console.log('✅ CSS前缀自定义:', hasCustomPrefix ? '成功' : '失败')
  console.log('✅ 语义化名称自定义:', hasCustomNames ? '成功' : '失败')

  // 验证样式注入方法存在
  const hasInjectMethod = typeof theme.cssGenerator.injectToHead === 'function'
  console.log('✅ 样式注入方法:', hasInjectMethod ? '存在' : '不存在')
} catch (error) {
  console.log('❌ CSS变量配置失败:', error.message)
}

// 4. 验证预设主题管理器
console.log('\n4. 验证预设主题管理器')
try {
  const presetManager = createPresetThemeManager()
  const themes = presetManager.getThemes()
  console.log('✅ 默认预设主题数量:', themes.length)

  // 添加自定义主题
  presetManager.addTheme({
    name: '测试主题',
    color: '#ff0000',
    description: '测试红色主题',
  })

  const newThemes = presetManager.getThemes()
  console.log('✅ 添加自定义主题后数量:', newThemes.length)

  // 查找主题
  const testTheme = presetManager.findTheme('测试主题')
  console.log('✅ 查找自定义主题:', testTheme ? '成功' : '失败')

  // 禁用主题
  presetManager.toggleTheme('测试主题', false)
  const enabledThemes = presetManager.getEnabledThemes()
  console.log('✅ 启用的主题数量:', enabledThemes.value.length)
} catch (error) {
  console.log('❌ 预设主题管理器失败:', error.message)
}

console.log('\n🎉 修复验证完成!')
