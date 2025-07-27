/**
 * @ldesign/color 基础用法示例
 */

import { ColorGenerator, generateTheme, isValidColor } from '../src/index'

console.log('🎨 @ldesign/color 基础用法示例\n')

// 1. 快速生成主题
console.log('1. 快速生成主题')
const theme = generateTheme('#1890ff')
console.log('语义化颜色:', theme.semanticColors)
console.log('明亮模式主色调色阶:', theme.palettes.light.primary)
console.log('暗黑模式主色调色阶:', theme.palettes.dark.primary)
console.log('')

// 2. 使用ColorGenerator类
console.log('2. 使用ColorGenerator类')
const generator = new ColorGenerator({
  enableCache: true,
  cacheSize: 100,
})

const customTheme = generator.generate('#52c41a')
console.log('自定义生成的语义化颜色:', customTheme.semanticColors)
console.log('')

// 3. 颜色验证
console.log('3. 颜色验证')
const colors = ['#1890ff', '#52c41a', 'invalid-color', '#f5222d']
colors.forEach((color) => {
  console.log(`${color}: ${isValidColor(color) ? '✅ 有效' : '❌ 无效'}`)
})
console.log('')

// 4. 批量生成
console.log('4. 批量生成')
const testColors = ['#1890ff', '#52c41a', '#f5222d', '#722ed1']
testColors.forEach((color) => {
  const result = generator.generate(color)
  console.log(`${color} -> 成功色: ${result.semanticColors.success}`)
})

console.log('\n✨ 示例运行完成！')
