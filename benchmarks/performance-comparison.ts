/**
 * 性能对比测试
 * 比较优化前后的性能差异
 */

import { Color as OptimizedColor } from '../src/core/Color-optimized'
import { Color as OriginalColor } from '../src/core/Color'
import {
  batchConvert as optimizedBatchConvert,
  batchManipulate as optimizedBatchManipulate,
} from '../src/performance/batch-optimized'
import {
  batchConvert as originalBatchConvert,
  batchManipulate as originalBatchManipulate,
} from '../src/batch'
import { getMemoryStats } from '../src/utils/memoryManager'

// 性能测试工具
class PerformanceTester {
  private results: Array<{
    test: string
    original: number
    optimized: number
    improvement: string
  }> = []

  async runTest(
    testName: string,
    originalFn: () => Promise<void>,
    optimizedFn: () => Promise<void>,
    iterations = 1000,
  ) {
    console.log(`\n运行测试: ${testName}`)

    // 预热
    for (let i = 0; i < 10; i++) {
      await originalFn()
      await optimizedFn()
    }

    // 测试原始版本
    const originalStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      await originalFn()
    }
    const originalTime = performance.now() - originalStart

    // 测试优化版本
    const optimizedStart = performance.now()
    for (let i = 0; i < iterations; i++) {
      await optimizedFn()
    }
    const optimizedTime = performance.now() - optimizedStart

    const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1)

    this.results.push({
      test: testName,
      original: originalTime,
      optimized: optimizedTime,
      improvement: `${improvement}%`,
    })

    console.log(`  原始版本: ${originalTime.toFixed(2)}ms`)
    console.log(`  优化版本: ${optimizedTime.toFixed(2)}ms`)
    console.log(`  性能提升: ${improvement}%`)
  }

  printSummary() {
    console.log('\n\n========== 性能测试总结 ==========')
    console.table(this.results)

    const avgImprovement = this.results.reduce((acc, r) =>
      acc + parseFloat(r.improvement), 0) / this.results.length

    console.log(`\n平均性能提升: ${avgImprovement.toFixed(1)}%`)
  }
}

// 运行性能测试
async function runPerformanceComparison() {
  const tester = new PerformanceTester()

  // 测试1: Color对象创建
  await tester.runTest(
    'Color对象创建 (HEX)',
    async () => {
      const color = new OriginalColor('#3498db')
      color.dispose()
    },
    async () => {
      const color = new OptimizedColor('#3498db')
      color.dispose()
    },
    10000,
  )

  // 测试2: RGB转换
  await tester.runTest(
    'RGB转换',
    async () => {
      const color = new OriginalColor('#3498db')
      const rgb = color.toRGB()
      OriginalColor.returnRGB(rgb)
      color.dispose()
    },
    async () => {
      const color = new OptimizedColor('#3498db')
      const rgb = color.toRGB()
      color.dispose()
    },
    10000,
  )

  // 测试3: HSL转换
  await tester.runTest(
    'HSL转换',
    async () => {
      const color = new OriginalColor('#3498db')
      const hsl = color.toHSL()
      color.dispose()
    },
    async () => {
      const color = new OptimizedColor('#3498db')
      const hsl = color.toHSL()
      color.dispose()
    },
    10000,
  )

  // 测试4: 颜色操作
  await tester.runTest(
    '颜色操作 (lighten)',
    async () => {
      const color = new OriginalColor('#3498db')
      const lighter = color.lighten(20)
      color.dispose()
      lighter.dispose()
    },
    async () => {
      const color = new OptimizedColor('#3498db')
      const lighter = color.lighten(20)
      color.dispose()
      lighter.dispose()
    },
    5000,
  )

  // 测试5: 批量转换
  const testColors = Array.from({ length: 100 }, () =>
    `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
  )

  await tester.runTest(
    '批量转换 (100色)',
    async () => {
      await originalBatchConvert(testColors, 'hex')
    },
    async () => {
      await optimizedBatchConvert(testColors, 'hex')
    },
    100,
  )

  // 测试6: 批量操作
  await tester.runTest(
    '批量操作 (100色)',
    async () => {
      await originalBatchManipulate(testColors, [
        { type: 'lighten', amount: 20 },
      ])
    },
    async () => {
      await optimizedBatchManipulate(testColors, {
        type: 'lighten',
        value: 20,
      })
    },
    50,
  )

  // 打印总结
  tester.printSummary()

  // 内存统计
  console.log('\n\n========== 内存使用统计 ==========')
  const memStats = getMemoryStats()
  console.table(memStats)
}

// 内存使用测试
async function runMemoryTest() {
  console.log('\n\n========== 内存使用测试 ==========')

  // 测试前内存
  const beforeStats = getMemoryStats()
  console.log('\n测试前:')
  console.log(`  预估内存使用: ${beforeStats.estimatedMemoryMB.toFixed(2)}MB`)

  // 创建大量颜色对象
  console.log('\n创建10000个颜色对象...')
  const colors: OptimizedColor[] = []
  for (let i = 0; i < 10000; i++) {
    colors.push(OptimizedColor.random())
  }

  const afterCreateStats = getMemoryStats()
  console.log('\n创建后:')
  console.log(`  预估内存使用: ${afterCreateStats.estimatedMemoryMB.toFixed(2)}MB`)
  console.log(`  内存增长: ${(afterCreateStats.estimatedMemoryMB - beforeStats.estimatedMemoryMB).toFixed(2)}MB`)
  console.log(`  每个对象平均: ${((afterCreateStats.estimatedMemoryMB - beforeStats.estimatedMemoryMB) * 1024 / 10000).toFixed(2)}KB`)

  // 释放颜色对象
  console.log('\n释放所有对象...')
  colors.forEach(c => c.dispose())
  colors.length = 0

  const afterReleaseStats = getMemoryStats()
  console.log('\n释放后:')
  console.log(`  预估内存使用: ${afterReleaseStats.estimatedMemoryMB.toFixed(2)}MB`)
  console.log(`  内存回收: ${(afterCreateStats.estimatedMemoryMB - afterReleaseStats.estimatedMemoryMB).toFixed(2)}MB`)
}

// 主函数
async function main() {
  console.log('🚀 Color包性能优化对比测试')
  console.log('='.repeat(50))

  // 运行性能对比
  await runPerformanceComparison()

  // 运行内存测试
  await runMemoryTest()

  console.log('\n\n✅ 所有测试完成！')
}

// 如果直接运行
if (require.main === module) {
  main().catch(console.error)
}

export { runPerformanceComparison, runMemoryTest }

