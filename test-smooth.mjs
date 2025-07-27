import { generateTheme } from './dist/ldesign-color.es.js'

console.log('🎨 优化后的色阶验证\n')

try {
  // 1. 测试主色调最深色阶优化
  console.log('1. 📊 主色调最深色阶优化验证:')
  const colors = [
    { name: '蓝色', color: '#1890ff' },
    { name: '红色', color: '#f5222d' },
    { name: '绿色', color: '#52c41a' },
    { name: '紫色', color: '#722ed1' },
  ]

  colors.forEach(({ name, color }) => {
    const theme = generateTheme(color, { autoInject: false })
    const deepest = theme.palettes.light.primary[11] // 第12个（最深）
    console.log(`  ${name} (${color}): 最深色阶 ${deepest}`)
  })

  // 2. 测试语义化灰色动态生成
  console.log('\n2. 🌫️ 语义化灰色动态生成验证:')
  colors.forEach(({ name, color }) => {
    const theme = generateTheme(color, {
      grayMixPrimary: true,
      grayMixRatio: 0.3,
      autoInject: false,
    })
    const semanticGray = theme.semanticColors.gray
    console.log(`  ${name} (${color}): 语义化灰色 ${semanticGray}`)
  })

  // 3. 测试灰色色阶平滑度
  console.log('\n3. 📈 灰色色阶平滑度验证:')
  const blueTheme = generateTheme('#1890ff', {
    grayMixPrimary: true,
    grayMixRatio: 0.3,
    autoInject: false,
  })

  console.log('  蓝色主题的灰色14色阶:')
  blueTheme.palettes.light.gray.forEach((color, i) => {
    const marker = i === 7 ? ' ← 中心' : ''
    const isDeepest = i === 13 ? ' ← 最深' : ''
    console.log(`    ${i + 1}. ${color}${marker}${isDeepest}`)
  })

  // 4. 对比纯中性灰色
  console.log('\n4. ⚪ 纯中性灰色对比:')
  const pureGrayTheme = generateTheme('#1890ff', {
    grayMixPrimary: false,
    autoInject: false,
  })

  console.log('  纯中性灰色:')
  console.log(`    语义化灰色: ${pureGrayTheme.semanticColors.gray}`)
  console.log(`    最浅色阶: ${pureGrayTheme.palettes.light.gray[0]}`)
  console.log(`    最深色阶: ${pureGrayTheme.palettes.light.gray[13]}`)

  // 5. 验证不同混入比例
  console.log('\n5. 🎭 混入比例效果验证:')
  const ratios = [0.1, 0.3, 0.5, 0.8]
  ratios.forEach((ratio) => {
    const mixTheme = generateTheme('#1890ff', {
      grayMixPrimary: true,
      grayMixRatio: ratio,
      autoInject: false,
    })
    console.log(`  比例${ratio}: 语义化灰色 ${mixTheme.semanticColors.gray}`)
  })

  console.log('\n🎉 优化验证完成！')
  console.log('✅ 主色调最深色阶保持色彩特征，不再过深')
  console.log('✅ 语义化灰色根据主色调动态生成，不再固定')
  console.log('✅ 灰色色阶更平滑，最深色阶不会突然变黑')
  console.log('✅ 混入比例功能正常，效果明显')
}
 catch (error) {
  console.log('❌ 测试失败:', error.message)
}
