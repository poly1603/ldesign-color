/**
 * @ldesign/color - Core Performance Benchmarks
 *
 * Performance benchmarks for core color operations.
 * Run with: npm run bench
 */

import { batchConvert, batchManipulate } from '../src/batch'
import { Color } from '../src/core/Color'
import { hslToRgb, rgbToHsl } from '../src/core/conversions'
import { generateDesignSystemPalette } from '../src/design-systems/generator'
import { clusterColors } from '../src/utils/colorUtils'

// ============================================
// Benchmark Utilities
// ============================================

interface BenchmarkResult {
  name: string
  ops: number
  time: number
  opsPerSecond: number
  avgTime: number
}

function benchmark(
  name: string,
  fn: () => void,
  iterations = 10000,
): BenchmarkResult {
  // Warmup
  for (let i = 0; i < 100; i++) fn()

  // Measure
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  const end = performance.now()

  const time = end - start
  const opsPerSecond = Math.round((iterations / time) * 1000)
  const avgTime = time / iterations

  return {
    name,
    ops: iterations,
    time,
    opsPerSecond,
    avgTime,
  }
}

async function benchmarkAsync(
  name: string,
  fn: () => Promise<void>,
  iterations = 100,
): Promise<BenchmarkResult> {
  // Warmup
  for (let i = 0; i < 10; i++) await fn()

  // Measure
  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    await fn()
  }
  const end = performance.now()

  const time = end - start
  const opsPerSecond = Math.round((iterations / time) * 1000)
  const avgTime = time / iterations

  return {
    name,
    ops: iterations,
    time,
    opsPerSecond,
    avgTime,
  }
}

function printResult(result: BenchmarkResult): void {
  console.log(`\n${result.name}`)
  console.log(`  ⚡ ${result.opsPerSecond.toLocaleString()} ops/sec`)
  console.log(`  ⏱️  ${result.avgTime.toFixed(3)}ms per operation`)
  console.log(`  📊 ${result.ops} operations in ${result.time.toFixed(2)}ms`)
}

// ============================================
// Core Benchmarks
// ============================================

export async function runCoreBenchmarks(): Promise<void> {
  console.log('\n🚀 Core Performance Benchmarks\n')
  console.log('='.repeat(50))

  // Color creation
  const createFromHex = benchmark(
    'Color creation from HEX',
    () => {
      const c = new Color('#3498db')
      c.dispose()
    },
  )
  printResult(createFromHex)

  const createFromRGB = benchmark(
    'Color.fromRGB()',
    () => {
      const c = Color.fromRGB(52, 152, 219)
      c.dispose()
    },
  )
  printResult(createFromRGB)

  // Conversions
  const color = new Color('#3498db')

  const toHexBench = benchmark(
    'Color.toHex()',
    () => color.toHex(),
  )
  printResult(toHexBench)

  const toRGBBench = benchmark(
    'Color.toRGB()',
    () => {
      const rgb = color.toRGB()
      Color.returnRGB(rgb)
    },
  )
  printResult(toRGBBench)

  const toHSLBench = benchmark(
    'Color.toHSL()',
    () => color.toHSL(),
  )
  printResult(toHSLBench)

  // Direct conversion
  const rgbToHslBench = benchmark(
    'rgbToHsl() direct',
    () => rgbToHsl({ r: 52, g: 152, b: 219 }),
  )
  printResult(rgbToHslBench)

  const hslToRgbBench = benchmark(
    'hslToRgb() direct',
    () => hslToRgb({ h: 204, s: 70, l: 53 }),
  )
  printResult(hslToRgbBench)

  // Manipulations
  const lightenBench = benchmark(
    'Color.lighten()',
    () => {
      const c = color.lighten(20)
      c.dispose()
    },
  )
  printResult(lightenBench)

  const mixBench = benchmark(
    'Color.mix()',
    () => {
      const c = color.mix('#e74c3c', 50)
      c.dispose()
    },
  )
  printResult(mixBench)

  // Advanced color spaces
  const toOKLCHBench = benchmark(
    'Color.toOKLCH()',
    () => color.toOKLCH(),
    1000, // Fewer iterations for slower operations
  )
  printResult(toOKLCHBench)

  const deltaE2000Bench = benchmark(
    'Color.deltaE2000()',
    () => color.deltaE2000('#e74c3c'),
    1000,
  )
  printResult(deltaE2000Bench)

  const deltaEOKLABBench = benchmark(
    'Color.deltaEOKLAB()',
    () => color.deltaEOKLAB('#e74c3c'),
    5000,
  )
  printResult(deltaEOKLABBench)
}

// ============================================
// Batch Processing Benchmarks
// ============================================

export async function runBatchBenchmarks(): Promise<void> {
  console.log('\n\n⚡ Batch Processing Benchmarks\n')
  console.log('='.repeat(50))

  // Generate test colors
  const testColors = Array.from({ length: 1000 }, () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  })

  // Batch convert
  const batchConvertBench = await benchmarkAsync(
    'batchConvert() - 1000 colors',
    async () => {
      await batchConvert(testColors, 'hex', { chunkSize: 100 })
    },
    10,
  )
  printResult(batchConvertBench)

  // Batch manipulate
  const batchManipulateBench = await benchmarkAsync(
    'batchManipulate() - 1000 colors, 3 operations',
    async () => {
      await batchManipulate(testColors, [
        { type: 'lighten', amount: 20 },
        { type: 'saturate', amount: 10 },
        { type: 'rotate', degrees: 30 },
      ], { chunkSize: 100 })
    },
    5,
  )
  printResult(batchManipulateBench)
}

// ============================================
// Design System Benchmarks
// ============================================

export function runDesignSystemBenchmarks(): void {
  console.log('\n\n🎨 Design System Benchmarks\n')
  console.log('='.repeat(50))

  const antBench = benchmark(
    'generateAntDesignPalette()',
    () => generateDesignSystemPalette('#3498db', 'ant-design'),
    1000,
  )
  printResult(antBench)

  const chakraBench = benchmark(
    'generateChakraUIScale()',
    () => generateDesignSystemPalette('#3498db', 'chakra-ui'),
    1000,
  )
  printResult(chakraBench)

  const tailwindBench = benchmark(
    'generateTailwindScale()',
    () => generateDesignSystemPalette('#3498db', 'tailwind'),
    1000,
  )
  printResult(tailwindBench)
}

// ============================================
// Advanced Utilities Benchmarks
// ============================================

export async function runUtilityBenchmarks(): Promise<void> {
  console.log('\n\n🛠️  Utility Function Benchmarks\n')
  console.log('='.repeat(50))

  // Generate test colors
  const colors = Array.from({ length: 100 }, () => Color.random())

  // Clustering
  const clusterBench = benchmark(
    'clusterColors() - 100 colors, k=5',
    () => clusterColors(colors, 5),
    10,
  )
  printResult(clusterBench)

  // Sorting
  const sortBench = benchmark(
    'sortColors() - 100 colors by hue',
    () => {
      const { sortColors } = require('../src/utils/colorUtils')
      sortColors(colors, 'hue')
    },
    100,
  )
  printResult(sortBench)
}

// ============================================
// Memory Benchmarks
// ============================================

export function runMemoryBenchmarks(): void {
  console.log('\n\n💾 Memory Benchmarks\n')
  console.log('='.repeat(50))

  const { memoryManager } = require('../src/utils/memoryManager')
  const { poolManager } = require('../src/utils/objectPool')

  // Before
  const memBefore = memoryManager.getMemoryStats()

  // Create many colors
  const colors: Color[] = []
  for (let i = 0; i < 1000; i++) {
    colors.push(Color.random())
  }

  // After
  const memAfter = memoryManager.getMemoryStats()

  console.log('\n创建 1000 个 Color 对象:')
  console.log(`  内存使用: ${memBefore.estimatedMemoryMB.toFixed(2)} MB -> ${memAfter.estimatedMemoryMB.toFixed(2)} MB`)
  console.log(`  增长: ${(memAfter.estimatedMemoryMB - memBefore.estimatedMemoryMB).toFixed(2)} MB`)

  // Pool stats
  const poolStats = poolManager.getAllStats()
  console.log('\n对象池统计:')
  Object.entries(poolStats).forEach(([name, stats]: [string, any]) => {
    console.log(`  ${name}:`)
    console.log(`    池大小: ${stats.poolSize}/${stats.maxSize}`)
    console.log(`    命中率: ${(stats.hitRate * 100).toFixed(1)}%`)
    console.log(`    利用率: ${stats.utilization.toFixed(1)}%`)
  })

  // Cleanup
  colors.forEach(c => c.dispose())

  const memCleanup = memoryManager.getMemoryStats()
  console.log(`\n清理后: ${memCleanup.estimatedMemoryMB.toFixed(2)} MB`)
}

// ============================================
// Run All Benchmarks
// ============================================

export async function runAllBenchmarks(): Promise<void> {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════╗')
  console.log('║   @ldesign/color Performance Benchmarks   ║')
  console.log('╚═══════════════════════════════════════════╝')

  await runCoreBenchmarks()
  await runBatchBenchmarks()
  runDesignSystemBenchmarks()
  await runUtilityBenchmarks()
  runMemoryBenchmarks()

  console.log('\n\n✅ All benchmarks completed!\n')
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  runAllBenchmarks().catch(console.error)
}
