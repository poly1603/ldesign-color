/**
 * @ldesign/color 优化版本使用示例
 */

import {
  Color,
  Colors,
  batchConvert,
  batchManipulate,
  batchAnalyze,
  findSimilarColors,
  generateColorStats,
  getMemoryStats,
  cleanupMemory,
  setMemoryLimit,
} from '../src/index-optimized'

// 1. 基础使用
function basicUsage() {
  console.log('=== 基础使用 ===')

  // 创建颜色
  const primary = new Color('#3498db')
  console.log('主色:', primary.toHex())

  // 颜色操作
  const lighter = primary.lighten(20)
  const darker = primary.darken(20)
  const complementary = primary.complementary()

  console.log('浅色:', lighter.toHex())
  console.log('深色:', darker.toHex())
  console.log('补色:', complementary.toHex())

  // 重要：释放资源
  primary.dispose()
  lighter.dispose()
  darker.dispose()
  complementary.dispose()
}

// 2. 使用工厂方法
function factoryMethods() {
  console.log('\n=== 工厂方法 ===')

  // 从 RGB 创建
  const fromRGB = Color.fromRGB(52, 152, 219)
  console.log('从RGB:', fromRGB.toHex())

  // 从 HSL 创建
  const fromHSL = Color.fromHSL(204, 70, 53)
  console.log('从HSL:', fromHSL.toHex())

  // 随机颜色
  const random = Color.random()
  console.log('随机色:', random.toHex())

  // 释放资源
  fromRGB.dispose()
  fromHSL.dispose()
  random.dispose()
}

// 3. 批量处理示例
async function batchProcessing() {
  console.log('\n=== 批量处理 ===')

  // 生成测试颜色
  const colors = [
    '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000',
  ]

  // 批量转换为 HSL
  const hslColors = await batchConvert(colors, 'hsl')
  console.log('HSL颜色:', hslColors.slice(0, 3))

  // 批量调亮
  const lighterColors = await batchManipulate(colors, {
    type: 'lighten',
    value: 20,
  })
  console.log('调亮后:', lighterColors.slice(0, 3))

  // 批量分析
  const analysis = await batchAnalyze(colors)
  console.log('颜色分析:', analysis.slice(0, 3))
}

// 4. 高级功能
async function advancedFeatures() {
  console.log('\n=== 高级功能 ===')

  const testColors = [
    '#3498db', '#2980b9', '#5dade2',
    '#e74c3c', '#c0392b', '#ec7063',
    '#2ecc71', '#27ae60', '#58d68d',
  ]

  // 查找相似颜色
  const similar = await findSimilarColors('#3498db', testColors, 30)
  console.log('相似颜色:', similar)

  // 生成统计信息
  const stats = await generateColorStats(testColors)
  console.log('颜色统计:', stats)
}

// 5. 内存管理
function memoryManagement() {
  console.log('\n=== 内存管理 ===')

  // 设置内存限制
  setMemoryLimit(20) // 20MB

  // 查看当前内存状态
  let memStats = getMemoryStats()
  console.log('初始内存:', memStats)

  // 创建大量颜色
  const colors: Color[] = []
  for (let i = 0; i < 1000; i++) {
    colors.push(Color.random())
  }

  memStats = getMemoryStats()
  console.log('创建1000个颜色后:', memStats)

  // 释放所有颜色
  colors.forEach(c => c.dispose())
  colors.length = 0

  // 手动清理内存
  cleanupMemory()

  memStats = getMemoryStats()
  console.log('清理后:', memStats)
}

// 6. 最佳实践示例
async function bestPractices() {
  console.log('\n=== 最佳实践 ===')

  // 使用 try-finally 确保资源释放
  let color: Color | null = null
  try {
    color = new Color('#3498db')
    // 使用颜色...
    console.log('颜色亮度:', color.getLuminance())
  } finally {
    color?.dispose()
  }

  // 处理颜色数组时使用批量函数
  const brandColors = [
    '#3498db', // 主色
    '#2ecc71', // 成功
    '#e74c3c', // 错误
    '#f39c12', // 警告
  ]

  // 不推荐：循环处理
  // for (const hex of brandColors) {
  //   const c = new Color(hex)
  //   console.log(c.toRGB())
  //   c.dispose()
  // }

  // 推荐：批量处理
  const rgbColors = await batchConvert(brandColors, 'rgb')
  console.log('品牌色RGB:', rgbColors)
}

// 7. 性能对比
async function performanceComparison() {
  console.log('\n=== 性能对比 ===')

  const testCount = 10000
  const testColors = Array.from({ length: testCount }, () =>
    `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
  )

  // 测试批量转换性能
  console.time('批量转换')
  await batchConvert(testColors, 'hsl', { chunkSize: 100 })
  console.timeEnd('批量转换')

  // 测试内存效率
  const beforeMem = getMemoryStats().estimatedMemoryMB
  const colors: Color[] = []

  console.time('创建颜色对象')
  for (let i = 0; i < 1000; i++) {
    colors.push(new Color(testColors[i]))
  }
  console.timeEnd('创建颜色对象')

  const afterMem = getMemoryStats().estimatedMemoryMB
  console.log(`内存增长: ${(afterMem - beforeMem).toFixed(2)}MB`)
  console.log(`每个对象: ${((afterMem - beforeMem) * 1024 / 1000).toFixed(2)}KB`)

  // 清理
  colors.forEach(c => c.dispose())
}

// 主函数
async function main() {
  console.log('🎨 @ldesign/color 优化版本使用示例\n')

  // 基础功能
  basicUsage()
  factoryMethods()

  // 批量处理
  await batchProcessing()

  // 高级功能
  await advancedFeatures()

  // 内存管理
  memoryManagement()

  // 最佳实践
  await bestPractices()

  // 性能测试
  await performanceComparison()

  console.log('\n✅ 所有示例运行完成!')
}

// 运行示例
if (require.main === module) {
  main().catch(console.error)
}

export { main }

