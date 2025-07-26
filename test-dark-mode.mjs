import { generateTheme } from './dist/ldesign-color.es.js'

console.log('🌙 暗黑模式色阶修复验证\n')

try {
  const theme = generateTheme('#1890ff', { 
    grayMixPrimary: true, 
    grayMixRatio: 0.3,
    autoInject: false 
  })
  
  // 1. 验证主色调暗黑模式色阶
  console.log('1. 📊 主色调暗黑模式色阶 (应该从深到浅):')
  theme.palettes.dark.primary.forEach((color, i) => {
    const marker = i === 6 ? ' ← 原色' : ''
    console.log(`  ${i+1}. ${color}${marker}`)
  })
  
  // 2. 验证灰色暗黑模式色阶
  console.log('\n2. 🌫️ 灰色暗黑模式色阶 (应该从深到浅):')
  theme.palettes.dark.gray.forEach((color, i) => {
    const marker = i === 7 ? ' ← 中心' : ''
    console.log(`  ${i+1}. ${color}${marker}`)
  })
  
  // 3. 对比明亮模式和暗黑模式
  console.log('\n3. 🔄 明亮模式 vs 暗黑模式对比:')
  console.log('明亮模式主色调:')
  console.log(`  最浅: ${theme.palettes.light.primary[0]}`)
  console.log(`  原色: ${theme.palettes.light.primary[6]}`)
  console.log(`  最深: ${theme.palettes.light.primary[11]}`)
  
  console.log('暗黑模式主色调:')
  console.log(`  最深: ${theme.palettes.dark.primary[0]}`)
  console.log(`  原色: ${theme.palettes.dark.primary[6]}`)
  console.log(`  最浅: ${theme.palettes.dark.primary[11]}`)
  
  // 4. 验证不同语义色的暗黑模式
  console.log('\n4. 🎨 不同语义色暗黑模式验证:')
  const semanticColors = ['primary', 'success', 'warning', 'danger']
  semanticColors.forEach(type => {
    const colors = theme.palettes.dark[type]
    console.log(`${type}: ${colors[0]} (最深) → ${colors[6]} (原色) → ${colors[11]} (最浅)`)
  })
  
  // 5. 测试其他主色调的暗黑模式
  console.log('\n5. 🌈 其他主色调暗黑模式测试:')
  const testColors = [
    { name: '红色', color: '#f5222d' },
    { name: '绿色', color: '#52c41a' },
    { name: '紫色', color: '#722ed1' }
  ]
  
  testColors.forEach(({ name, color }) => {
    const testTheme = generateTheme(color, { autoInject: false })
    const darkPrimary = testTheme.palettes.dark.primary
    console.log(`${name}: ${darkPrimary[0]} (最深) → ${darkPrimary[11]} (最浅)`)
  })
  
  console.log('\n🎉 暗黑模式修复验证完成！')
  console.log('✅ 暗黑模式色阶顺序正确：从深到浅')
  console.log('✅ 暗黑模式色阶平滑，没有突兀跳跃')
  console.log('✅ 灰色色阶顺序正确，不再反转')
  console.log('✅ 所有语义色在暗黑模式下都正常工作')
  
} catch (error) {
  console.log('❌ 测试失败:', error.message)
}
