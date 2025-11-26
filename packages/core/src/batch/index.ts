/**
 * @ldesign/color - Batch Processing
 *
 * High-performance batch processing for large color datasets.
 * Supports Web Workers for parallel processing and streaming for memory efficiency.
 *
 * @module batch
 */

import type { ColorFormat, ColorInput } from '../types'
import { Color } from '../core/Color'

// ============================================
// Batch Conversion
// ============================================

/**
 * Batch conversion options
 */
export interface BatchOptions {
  /** Output format for converted colors */
  format?: ColorFormat
  /** Use Web Worker for parallel processing */
  useWorker?: boolean
  /** Batch size for chunked processing */
  chunkSize?: number
  /** Progress callback */
  onProgress?: (processed: number, total: number) => void
  /** Use SharedArrayBuffer for zero-copy data transfer (requires COOP/COEP headers) */
  useSharedMemory?: boolean
}

/**
 * Batch processing statistics
 */
export interface BatchStats {
  /** Total items processed */
  processed: number
  /** Number of errors */
  errors: number
  /** Processing time in milliseconds */
  duration: number
  /** Items per second */
  throughput: number
}

/**
 * Batch convert colors to specified format
 *
 * Efficiently converts large arrays of colors using chunked processing
 * to avoid blocking the main thread.
 *
 * @param inputs - Array of color inputs
 * @param format - Target format
 * @param options - Batch processing options
 * @returns Array of converted color strings
 * @performance O(n) - Linear with chunking for better responsiveness
 * @example
 * ```ts
 * const colors = ['#ff0000', '#00ff00', '#0000ff', /* ... 1000 more ... *\/];
 * const hexColors = await batchConvert(colors, 'hex', {
 *   chunkSize: 100,
 *   onProgress: (done, total) => console.log(`${done}/${total}`)
 * });
 * ```
 */
export async function batchConvert(
  inputs: ColorInput[],
  format: ColorFormat,
  options: BatchOptions = {},
): Promise<string[]> {
  const startTime = performance.now()
  const {
    chunkSize = 100,
    onProgress,
    useSharedMemory = false,
  } = options

  // 如果支持SharedArrayBuffer且启用,使用优化路径
  if (useSharedMemory && typeof SharedArrayBuffer !== 'undefined') {
    const results = await batchConvertShared(inputs, format, { chunkSize, onProgress })
    return results
  }

  const results: string[] = []
  const totalChunks = Math.ceil(inputs.length / chunkSize)
  let errorCount = 0

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, inputs.length)
    const chunk = inputs.slice(start, end)

    // Process chunk
    const chunkResults = chunk.map((input) => {
      try {
        const color = new Color(input)
        const result = color.toString(format)
        color.dispose() // Return to pool
        return result
      }
      catch {
        errorCount++
        return '#000000' // Fallback color
      }
    })

    results.push(...chunkResults)

    // Report progress
    if (onProgress) {
      onProgress(end, inputs.length)
    }

    // Yield to event loop between chunks
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  const duration = performance.now() - startTime
  
  // Log performance stats in development
  if (process.env.NODE_ENV !== 'production' && errorCount > 0) {
    console.warn(`Batch conversion completed with ${errorCount} errors in ${duration.toFixed(2)}ms`)
  }

  return results
}

/**
 * Batch convert using SharedArrayBuffer (zero-copy)
 *
 * 使用共享内存进行批量转换,避免数据复制开销
 * 要求网页设置COOP和COEP响应头
 *
 * @private
 */
async function batchConvertShared(
  inputs: ColorInput[],
  format: ColorFormat,
  options: { chunkSize: number, onProgress?: (processed: number, total: number) => void },
): Promise<string[]> {
  const { chunkSize, onProgress } = options
  const results: string[] = []
  
  // 预分配SharedArrayBuffer用于RGB数据传输
  // 每个颜色4字节: [R, G, B, A]
  const bufferSize = Math.min(chunkSize, inputs.length) * 4
  const sharedBuffer = new SharedArrayBuffer(bufferSize)
  const sharedArray = new Uint8Array(sharedBuffer)
  
  const totalChunks = Math.ceil(inputs.length / chunkSize)
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, inputs.length)
    const chunk = inputs.slice(start, end)
    
    // 转换为RGB并写入共享内存
    chunk.forEach((input, idx) => {
      try {
        const color = new Color(input)
        const [r, g, b, a] = color.toRGBDirect()
        const offset = idx * 4
        sharedArray[offset] = r
        sharedArray[offset + 1] = g
        sharedArray[offset + 2] = b
        sharedArray[offset + 3] = Math.round(a * 255)
        color.dispose()
      }
      catch {
        // 失败时使用黑色
        const offset = idx * 4
        sharedArray[offset] = 0
        sharedArray[offset + 1] = 0
        sharedArray[offset + 2] = 0
        sharedArray[offset + 3] = 255
      }
    })
    
    // 从共享内存读取并格式化
    for (let i = 0; i < chunk.length; i++) {
      const offset = i * 4
      const r = sharedArray[offset]
      const g = sharedArray[offset + 1]
      const b = sharedArray[offset + 2]
      const a = sharedArray[offset + 3] / 255
      
      const color = Color.fromRGB(r, g, b, a)
      results.push(color.toString(format))
      color.dispose()
    }
    
    if (onProgress) {
      onProgress(end, inputs.length)
    }
    
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  return results
}

/**
 * Batch manipulation operation
 */
export type BatchOperation
  = | { type: 'lighten', amount: number }
  | { type: 'darken', amount: number }
  | { type: 'saturate', amount: number }
  | { type: 'desaturate', amount: number }
  | { type: 'rotate', degrees: number }
  | { type: 'setAlpha', value: number }
  | { type: 'grayscale' }
  | { type: 'invert' }

/**
 * Batch manipulate colors
 *
 * Apply the same manipulation to multiple colors efficiently.
 *
 * @param inputs - Array of input colors
 * @param operations - Array of operations to apply
 * @param options - Batch processing options
 * @returns Array of manipulated colors
 * @performance O(n * m) where m is number of operations
 * @example
 * ```ts
 * const results = await batchManipulate(
 *   ['#ff0000', '#00ff00', '#0000ff'],
 *   [
 *     { type: 'lighten', amount: 20 },
 *     { type: 'saturate', amount: 10 }
 *   ]
 * );
 * ```
 */
export async function batchManipulate(
  inputs: ColorInput[],
  operations: BatchOperation[],
  options: BatchOptions = {},
): Promise<Color[]> {
  const {
    chunkSize = 100,
    onProgress,
  } = options

  const results: Color[] = []
  const totalChunks = Math.ceil(inputs.length / chunkSize)

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, inputs.length)
    const chunk = inputs.slice(start, end)

    // Process chunk
    const chunkResults = chunk.map((input) => {
      let color = new Color(input)

      // Apply operations
      for (const op of operations) {
        const newColor = applyOperation(color, op)
        if (newColor !== color) {
          color.dispose()
          color = newColor
        }
      }

      return color
    })

    results.push(...chunkResults)

    // Report progress
    if (onProgress) {
      onProgress(end, inputs.length)
    }

    // Yield to event loop
    await new Promise(resolve => setTimeout(resolve, 0))
  }

  return results
}

/**
 * Apply single operation to color
 */
function applyOperation(color: Color, operation: BatchOperation): Color {
  switch (operation.type) {
    case 'lighten':
      return color.lighten(operation.amount)
    case 'darken':
      return color.darken(operation.amount)
    case 'saturate':
      return color.saturate(operation.amount)
    case 'desaturate':
      return color.desaturate(operation.amount)
    case 'rotate':
      return color.rotate(operation.degrees)
    case 'setAlpha':
      return color.setAlpha(operation.value)
    case 'grayscale':
      return color.grayscale()
    case 'invert':
      return color.invert()
    default:
      return color
  }
}

// ============================================
// Streaming Processing
// ============================================

/**
 * Color stream processor
 *
 * Processes colors in a streaming fashion to handle very large datasets
 * with minimal memory footprint.
 */
export class ColorStreamProcessor {
  private processedCount = 0
  private errorCount = 0
  private startTime = 0

  /**
   * Process color stream with transformation function
   *
   * @param inputs - Iterable of color inputs
   * @param transform - Transformation function
   * @param options - Processing options
   * @returns Async iterable of results
   * @example
   * ```ts
   * const processor = new ColorStreamProcessor();
   * const stream = processor.process(
   *   colorIterator,
   *   (color) => color.lighten(20).toHex()
   * );
   *
   * for await (const hex of stream) {
   *   console.log(hex);
   * }
   * ```
   */
  async* process<T>(
    inputs: Iterable<ColorInput> | AsyncIterable<ColorInput>,
    transform: (color: Color) => T,
    options: {
      chunkSize?: number
      onError?: (error: Error, input: ColorInput) => void
    } = {},
  ): AsyncIterable<T> {
    const { chunkSize = 100, onError } = options
    let chunk: T[] = []
    
    // 记录开始时间
    if (this.processedCount === 0) {
      this.startTime = performance.now()
    }

    // Handle both sync and async iterables
    const iterator = Symbol.asyncIterator in inputs
      ? (inputs as AsyncIterable<ColorInput>)[Symbol.asyncIterator]()
      : (function* () { yield* inputs as Iterable<ColorInput> })()

    for await (const input of iterator as any) {
      try {
        const color = new Color(input)
        const result = transform(color)
        color.dispose()

        chunk.push(result)
        this.processedCount++

        // Yield chunk when full
        if (chunk.length >= chunkSize) {
          yield* chunk
          chunk = []

          // Yield to event loop
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }
      catch (error) {
        this.errorCount++
        if (onError) {
          onError(error as Error, input)
        }
      }
    }

    // Yield remaining items
    if (chunk.length > 0) {
      yield* chunk
    }
  }

  /**
   * Get processing statistics
   */
  getStats(): BatchStats {
    const duration = performance.now() - this.startTime
    const throughput = duration > 0 ? (this.processedCount / duration) * 1000 : 0
    
    return {
      processed: this.processedCount,
      errors: this.errorCount,
      duration,
      throughput,
    }
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.processedCount = 0
    this.errorCount = 0
    this.startTime = performance.now()
  }
}

// ============================================
// Parallel Processing (Web Worker)
// ============================================

/**
 * Process colors in parallel using Web Workers
 *
 * Note: This requires a Web Worker implementation.
 * For now, this is a placeholder for future implementation.
 *
 * @param inputs - Array of color inputs
 * @param operation - Operation to perform
 * @param workerCount - Number of workers to use
 * @returns Processed colors
 * @example
 * ```ts
 * // Future implementation
 * const results = await batchProcessParallel(
 *   largeColorArray,
 *   { type: 'lighten', amount: 20 },
 *   4 // Use 4 workers
 * );
 * ```
 */
export async function batchProcessParallel(
  inputs: ColorInput[],
  operation: BatchOperation,
  _workerCount = 4,
): Promise<Color[]> {
  // Check if Web Workers are supported
  if (typeof Worker === 'undefined') {
    console.warn('Web Workers not supported, falling back to batch processing')
    return batchManipulate(inputs, [operation])
  }

  // TODO: Implement Worker-based parallel processing
  // For now, fall back to regular batch processing
  return batchManipulate(inputs, [operation])
}

// ============================================
// Utility Functions
// ============================================

/**
 * Count colors by criteria
 *
 * @param colors - Input colors
 * @param predicate - Filter predicate
 * @returns Count of matching colors
 * @example
 * ```ts
 * const lightCount = await countColors(colors, c => c.isLight());
 * const vibrantCount = await countColors(colors, c => c.saturation > 70);
 * ```
 */
export async function countColors(
  colors: ColorInput[],
  predicate: (color: Color) => boolean,
): Promise<number> {
  let count = 0

  for (const input of colors) {
    const color = new Color(input)
    if (predicate(color)) {
      count++
    }
    color.dispose()

    // Yield periodically
    if (count % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  return count
}

/**
 * Group colors by criteria
 *
 * @param colors - Input colors
 * @param groupBy - Grouping function
 * @returns Map of groups
 * @example
 * ```ts
 * const byTemperature = await groupColors(
 *   colors,
 *   c => c.isLight() ? 'light' : 'dark'
 * );
 * ```
 */
export async function groupColors<K extends string | number>(
  colors: ColorInput[],
  groupBy: (color: Color) => K,
): Promise<Map<K, Color[]>> {
  const groups = new Map<K, Color[]>()

  for (const input of colors) {
    const color = new Color(input)
    const key = groupBy(color)

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(color)
  }

  return groups
}
