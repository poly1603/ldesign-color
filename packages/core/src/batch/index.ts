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
  const {
    chunkSize = 100,
    onProgress,
  } = options

  const results: string[] = []
  const totalChunks = Math.ceil(inputs.length / chunkSize)

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, inputs.length)
    const chunk = inputs.slice(start, end)

    // Process chunk
    const chunkResults = chunk.map((input) => {
      const color = new Color(input)
      const result = color.toString(format)
      color.dispose() // Return to pool
      return result
    })

    results.push(...chunkResults)

    // Report progress
    if (onProgress) {
      onProgress(end, inputs.length)
    }

    // Yield to event loop between chunks
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
  getStats(): { processed: number, errors: number } {
    return {
      processed: this.processedCount,
      errors: this.errorCount,
    }
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.processedCount = 0
    this.errorCount = 0
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
