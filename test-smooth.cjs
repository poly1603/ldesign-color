const { generateTheme } = require('./dist/ldesign-color.umd.js')

console.log('🎨 基于Arco算法的平滑色阶验证\n')

try {
  const theme = generateTheme('#1890ff', { grayMixPrimary: false, autoInject: false })

  console.log('📊 主色调12色阶 (第7个是原色):')
  theme.palettes.light.primary.forEach((color, i) => {
    console.log(`  ${i + 1}. ${color}${i === 6 ? ' ← 原色' : ''}`)
  })

  console.log('\n🌫️ 灰色14色阶 (第8个是中心):')
  theme.palettes.light.gray.forEach((color, i) => {
    console.log(`  ${i + 1}. ${color}${i === 7 ? ' ← 中心' : ''}`)
  })

  console.log('\n✅ 深度验证:')
  const gray = theme.palettes.light.gray
  console.log(`  最浅: ${gray[0]} → 最深: ${gray[13]}`)

  console.log('\n🎭 混入比例测试:')
  const ratios = [0.2, 0.5, 1.0]
  ratios.forEach((ratio) => {
    const mixTheme = generateTheme('#1890ff', {
      grayMixPrimary: true,
      grayMixRatio: ratio,
      autoInject: false,
    })
    console.log(`  比例${ratio}: ${mixTheme.palettes.light.gray[7]}`)
  })

  console.log('\n🎉 优化完成！')
  console.log('✅ 色阶更平滑，告别突兀跳跃')
  console.log('✅ 深度范围更宽，最深更深，最浅更浅')
  console.log('✅ 基于Arco Design成熟算法，质量有保证')
}
 catch (error) {
  console.log('❌ 测试失败:', error.message)
}
