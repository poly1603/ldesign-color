/**
 * Color 色彩空间转换性能测试
 * 
 * 使用 @ldesign/benchmark 框架测试色彩空间转换性能
 */

import { createBenchmark } from '@ldesign/benchmark'
import { rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb } from '../packages/core/src/core/conversions'
import type { RGB, HSL, HSV } from '../packages/core/src/types'

/**
 * 测试数据
 */
const testRGB: RGB = { r: 59, g: 130, b: 246 }
const testHSL: HSL = { h: 220, s: 90, l: 60 }
const testHSV: HSV = { h: 220, s: 76, v: 96 }

/**
 * 随机 RGB 颜色
 */
function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

/**
 * 随机 HSL 颜色
 */
function randomHSL(): HSL {
  return {
    h: Math.floor(Math.random() * 361),
    s: Math.floor(Math.random() * 101),
    l: Math.floor(Math.random() * 101),
  }
}

/**
 * 随机 HSV 颜色
 */
function randomHSV(): HSV {
  return {
    h: Math.floor(Math.random() * 361),
    s: Math.floor(Math.random() * 101),
    v: Math.floor(Math.random() * 101),
  }
}

/**
 * 运行 benchmark
 */
async function main() {
  console.log('🎨 Color 色彩空间转换性能测试\n')

  // RGB ↔ HSL 转换
  const rgbHslBench = createBenchmark('RGB ↔ HSL 转换')

  rgbHslBench.add('RGB → HSL (固定值)', () => {
    rgbToHsl(testRGB)
  })

  rgbHslBench.add('RGB → HSL (随机值)', () => {
    rgbToHsl(randomRGB())
  })

  rgbHslBench.add('HSL → RGB (固定值)', () => {
    hslToRgb(testHSL)
  })

  rgbHslBench.add('HSL → RGB (随机值)', () => {
    hslToRgb(randomHSL())
  })

  await rgbHslBench.run()
  rgbHslBench.printResults()

  // RGB ↔ HSV 转换
  const rgbHsvBench = createBenchmark('RGB ↔ HSV 转换')

  rgbHsvBench.add('RGB → HSV (固定值)', () => {
    rgbToHsv(testRGB)
  })

  rgbHsvBench.add('RGB → HSV (随机值)', () => {
    rgbToHsv(randomRGB())
  })

  rgbHsvBench.add('HSV → RGB (固定值)', () => {
    hsvToRgb(testHSV)
  })

  rgbHsvBench.add('HSV → RGB (随机值)', () => {
    hsvToRgb(randomHSV())
  })

  await rgbHsvBench.run()
  rgbHsvBench.printResults()

  // 批量转换
  const batchBench = createBenchmark('批量转换 (1000 次)')

  const rgbColors = Array.from({ length: 1000 }, randomRGB)
  const hslColors = Array.from({ length: 1000 }, randomHSL)
  const hsvColors = Array.from({ length: 1000 }, randomHSV)

  batchBench.add('批量 RGB → HSL', () => {
    for (let i = 0; i < rgbColors.length; i++) {
      rgbToHsl(rgbColors[i])
    }
  })

  batchBench.add('批量 HSL → RGB', () => {
    for (let i = 0; i < hslColors.length; i++) {
      hslToRgb(hslColors[i])
    }
  })

  batchBench.add('批量 RGB → HSV', () => {
    for (let i = 0; i < rgbColors.length; i++) {
      rgbToHsv(rgbColors[i])
    }
  })

  batchBench.add('批量 HSV → RGB', () => {
    for (let i = 0; i < hsvColors.length; i++) {
      hsvToRgb(hsvColors[i])
    }
  })

  await batchBench.run()
  batchBench.printResults()

  console.log('\n✅ 测试完成!')
}

main().catch(console.error)

