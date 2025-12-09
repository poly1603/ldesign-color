/**
 * @ldesign/color - Enhanced Type Definitions
 *
 * Advanced type definitions with template literals, utility types,
 * and precise constraints for better type safety and IntelliSense.
 *
 * @module types/enhanced
 */

// ============================================
// Template Literal Types
// ============================================

/**
 * Hex color string type (strict)
 *
 * Matches: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
 */
export type HexColor = `#${string}`

/**
 * RGB color string type
 *
 * Matches: rgb(r, g, b), rgba(r, g, b, a)
 */
export type RGBString = `rgb${string}` | `rgba${string}`

/**
 * HSL color string type
 *
 * Matches: hsl(h, s%, l%), hsla(h, s%, l%, a)
 */
export type HSLString = `hsl${string}` | `hsla${string}`

/**
 * CSS color string (any valid CSS color)
 */
export type CSSColorString = HexColor | RGBString | HSLString | string

/**
 * Design system name (literal union)
 */
export type DesignSystemName
  = | 'ant-design'
  | 'chakra-ui'
  | 'material-design'
  | 'material-design-3'
  | 'carbon'
  | 'fluent'
  | 'tailwind'

/**
 * Shade number for design systems
 */
export type ShadeNumber
  = | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 // Ant Design
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 // Tailwind/Chakra

// ============================================
// Utility Types
// ============================================

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific properties optional
 */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Exact type (no extra properties allowed)
 */
export type Exact<T> = T & { [K in Exclude<keyof any, keyof T>]?: never }

/**
 * Deep readonly
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/**
 * Value of object type
 */
export type ValueOf<T> = T[keyof T]

/**
 * Extract function return type
 */
export type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never

/**
 * Extract function parameters
 */
export type ParametersOf<T> = T extends (...args: infer P) => any ? P : never

// ============================================
// Constrained Number Types
// ============================================

/**
 * Number in range [0, 255] for RGB channels
 */
export type RGB_Channel = number & { __brand: 'RGB_Channel' }

/**
 * Number in range [0, 360] for hue
 */
export type Hue = number & { __brand: 'Hue' }

/**
 * Number in range [0, 100] for saturation/lightness
 */
export type Percentage = number & { __brand: 'Percentage' }

/**
 * Number in range [0, 1] for alpha/ratio
 */
export type Alpha = number & { __brand: 'Alpha' }

/**
 * Positive number
 */
export type PositiveNumber = number & { __brand: 'Positive' }

/**
 * Non-negative number (including 0)
 */
export type NonNegativeNumber = number & { __brand: 'NonNegative' }

// ============================================
// Enhanced Color Object Types
// ============================================

/**
 * RGB with branded channel types
 */
export interface StrictRGB {
  r: RGB_Channel
  g: RGB_Channel
  b: RGB_Channel
  a?: Alpha
}

/**
 * HSL with branded types
 */
export interface StrictHSL {
  h: Hue
  s: Percentage
  l: Percentage
  a?: Alpha
}

/**
 * HSV with branded types
 */
export interface StrictHSV {
  h: Hue
  s: Percentage
  v: Percentage
  a?: Alpha
}

// ============================================
// Function Signature Types
// ============================================

/**
 * Color manipulation function signature
 */
export type ColorManipulationFn = (amount: number) => any

/**
 * Color conversion function signature
 */
export type ColorConversionFn<T> = () => T

/**
 * Color comparison function signature
 */
export type ColorComparisonFn = (other: any) => number | boolean

/**
 * Batch operation function signature
 */
export type BatchOperationFn<T, R> = (items: T[], options?: any) => Promise<R[]>

// ============================================
// Design System Palette Types
// ============================================

/**
 * Ant Design palette type (1-10)
 */
export type AntDesignPalette = {
  [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]: HexColor;
}

/**
 * Chakra UI scale type (50-900)
 */
export type ChakraUIScale = {
  [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]: HexColor;
}

/**
 * Tailwind scale type (50-950)
 */
export type TailwindScale = {
  [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950]: HexColor;
}

/**
 * Material Design palette type
 */
export type MaterialDesignPalette = {
  [K in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]: HexColor;
} & {
  A100?: HexColor
  A200?: HexColor
  A400?: HexColor
  A700?: HexColor
}

// ============================================
// Configuration Object Types
// ============================================

/**
 * Base configuration with common fields
 */
export interface BaseConfig {
  /** Enable/disable feature */
  enabled?: boolean
  /** Debug mode */
  debug?: boolean
  /** Performance monitoring */
  monitor?: boolean
}

/**
 * Cache configuration
 */
export interface CacheConfig extends BaseConfig {
  /** Maximum cache size */
  maxSize?: PositiveNumber
  /** Cache strategy */
  strategy?: 'LRU' | 'LFU' | 'FIFO'
  /** Persistence key */
  persistKey?: string
}

/**
 * Pool configuration
 */
export interface PoolConfig extends BaseConfig {
  /** Maximum pool size */
  maxSize?: PositiveNumber
  /** Minimum pool size */
  minSize?: NonNegativeNumber
  /** Initial pool size */
  initialSize?: NonNegativeNumber
}

// ============================================
// Result Types with Branding
// ============================================

/**
 * Success result
 */
export interface Success<T> {
  success: true
  data: T
}

/**
 * Error result
 */
export interface Failure {
  success: false
  error: Error
  code?: string
}

/**
 * Result type (success or failure)
 */
export type Result<T> = Success<T> | Failure

/**
 * Async result
 */
export type AsyncResult<T> = Promise<Result<T>>

// ============================================
// Validation Types
// ============================================

/**
 * Validator function
 */
export type Validator<T> = (value: T) => boolean

/**
 * Validated type
 */
export interface Validated<T> {
  value: T
  isValid: boolean
  errors?: string[]
}

/**
 * Validation result
 */
export type ValidationResult<T> = Validated<T>

// ============================================
// Event Types
// ============================================

/**
 * Event listener function
 */
export type EventListener<T = any> = (event: T) => void

/**
 * Disposable (has cleanup method)
 */
export interface Disposable {
  dispose: () => void
}

/**
 * Observable (can be subscribed to)
 */
export interface Observable<T> {
  subscribe: (listener: EventListener<T>) => () => void
}

// ============================================
// Builder Pattern Types
// ============================================

/**
 * Fluent builder interface
 */
export interface FluentBuilder<T> {
  build: () => T
}

/**
 * Color builder pattern
 */
export interface ColorBuilder extends FluentBuilder<any> {
  withRed: (value: RGB_Channel) => this
  withGreen: (value: RGB_Channel) => this
  withBlue: (value: RGB_Channel) => this
  withAlpha: (value: Alpha) => this
  withHue: (value: Hue) => this
  withSaturation: (value: Percentage) => this
  withLightness: (value: Percentage) => this
}

// ============================================
// Mixin Types
// ============================================

/**
 * Constructor type
 */
export type Constructor<T = {}> = new (...args: any[]) => T

/**
 * Mixin function type
 */
export type Mixin<T extends Constructor, R> = (base: T) => Constructor<R>

// ============================================
// Performance Types
// ============================================

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** Operations per second */
  opsPerSecond: number
  /** Average time per operation (ms) */
  avgTime: number
  /** Total operations */
  totalOps: number
  /** Total time (ms) */
  totalTime: number
}

/**
 * Memory metrics
 */
export interface MemoryMetrics {
  /** Heap used (bytes) */
  heapUsed: number
  /** Heap total (bytes) */
  heapTotal: number
  /** External (bytes) */
  external: number
  /** Array buffers (bytes) */
  arrayBuffers: number
}

// ============================================
// Type Guards
// ============================================

/**
 * Type guard for Success result
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result.success === true
}

/**
 * Type guard for Failure result
 */
export function isFailure<T>(result: Result<T>): result is Failure {
  return result.success === false
}

/**
 * Type guard for Disposable
 */
export function isDisposable(value: any): value is Disposable {
  return value && typeof value.dispose === 'function'
}

/**
 * Type guard for Observable
 */
export function isObservable<T>(value: any): value is Observable<T> {
  return value && typeof value.subscribe === 'function'
}

// ============================================
// Helper Types for API
// ============================================

/**
 * Options with progress callback
 */
export interface ProgressOptions {
  onProgress?: (current: number, total: number, percentage: number) => void
}

/**
 * Options with error handler
 */
export interface ErrorOptions {
  onError?: (error: Error) => void
}

/**
 * Options with completion callback
 */
export interface CompletionOptions {
  onComplete?: () => void
}

/**
 * Combined async operation options
 */
export interface AsyncOperationOptions extends ProgressOptions, ErrorOptions, CompletionOptions {
  /** Operation timeout (ms) */
  timeout?: number
  /** Retry count */
  retries?: number
  /** Retry delay (ms) */
  retryDelay?: number
}

// ============================================
// Branded Primitive Types
// ============================================

/**
 * Create a branded type
 */
export type Brand<T, B> = T & { __brand: B }

/**
 * Remove brand from type
 */
export type Unbrand<T> = T extends Brand<infer U, any> ? U : T

/**
 * Opaque type (cannot be assigned from base type)
 */
export type Opaque<T, K> = T & { readonly __opaque__: K }

// ============================================
// Advanced Utility Types
// ============================================

/**
 * Merge two types
 */
export type Merge<T, U> = Omit<T, keyof U> & U

/**
 * Override properties
 */
export type Override<T, U> = Omit<T, keyof U> & U

/**
 * Make nested property required
 */
export type RequireNested<T, K extends string> = T & {
  [P in K]: P extends `${infer First}.${infer Rest}`
  ? First extends keyof T
  ? Required<T>[First] extends object
  ? RequireNested<Required<T>[First], Rest>
  : Required<T>[First]
  : never
  : P extends keyof T
  ? Required<T>[P]
  : never;
}

/**
 * Flatten nested type
 */
export type Flatten<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T

/**
 * Non-nullable deep
 */
export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]> extends object
  ? DeepNonNullable<NonNullable<T[P]>>
  : NonNullable<T[P]>;
}

/**
 * Mutable (remove readonly)
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
}

/**
 * Deep mutable
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
}

// ============================================
// Function Types
// ============================================

/**
 * Async function type
 */
export type AsyncFn<Args extends any[] = any[], R = any> = (...args: Args) => Promise<R>

/**
 * Sync function type
 */
export type SyncFn<Args extends any[] = any[], R = any> = (...args: Args) => R

/**
 * Function or async function
 */
export type AnyFn<Args extends any[] = any[], R = any> = SyncFn<Args, R> | AsyncFn<Args, R>

/**
 * Callback function
 */
export type Callback<T = void> = (value: T) => void

/**
 * Predicate function
 */
export type Predicate<T> = (value: T) => boolean

/**
 * Mapper function
 */
export type Mapper<T, R> = (value: T, index: number) => R

/**
 * Reducer function
 */
export type Reducer<T, R> = (accumulator: R, current: T, index: number) => R

// ============================================
// Array Types
// ============================================

/**
 * Non-empty array
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Tuple of specific length
 */
export type Tuple<T, N extends number> = N extends N
  ? number extends N
  ? T[]
  : _TupleOf<T, N, []>
  : never

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>

/**
 * Fixed-length array (up to 10)
 */
export type FixedArray<T, N extends number>
  = N extends 0 ? []
  : N extends 1 ? [T]
  : N extends 2 ? [T, T]
  : N extends 3 ? [T, T, T]
  : N extends 4 ? [T, T, T, T]
  : N extends 5 ? [T, T, T, T, T]
  : N extends 6 ? [T, T, T, T, T, T]
  : N extends 7 ? [T, T, T, T, T, T, T]
  : N extends 8 ? [T, T, T, T, T, T, T, T]
  : N extends 9 ? [T, T, T, T, T, T, T, T, T]
  : N extends 10 ? [T, T, T, T, T, T, T, T, T, T]
  : T[]

// ============================================
// Object Types
// ============================================

/**
 * Object with string keys
 */
export type StringRecord<T = any> = Record<string, T>

/**
 * Object with number keys
 */
export type NumberRecord<T = any> = Record<number, T>

/**
 * Entries of object
 */
export type Entries<T> = Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>

/**
 * Keys of object as union
 */
export type Keys<T> = keyof T

/**
 * Values of object as union
 */
export type Values<T> = T[keyof T]

// ============================================
// Conditional Types
// ============================================

/**
 * If condition is true, return Then, else Else
 */
export type If<Condition extends boolean, Then, Else>
  = Condition extends true ? Then : Else

/**
 * Check if type is any
 */
export type IsAny<T> = 0 extends (1 & T) ? true : false

/**
 * Check if type is never
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * Check if type is unknown
 */
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false

/**
 * Check if two types are equal
 */
export type Equals<X, Y>
  = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// ============================================
// Promise Types
// ============================================

/**
 * Unwrap Promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Promisify function
 */
export type Promisify<T> = T extends (...args: infer Args) => infer R
  ? (...args: Args) => Promise<Awaited<R>>
  : never

/**
 * Promisify all methods in object
 */
export type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
  ? Promisify<T[K]>
  : T[K];
}

// ============================================
// Export Enhanced Types
// ============================================

/**
 * Re-export base types from main types file
 */
export type {
  AnimationConfig,
  BlendMode,
  CMYK,
  ColorBlindnessType,
  ColorFormat,
  ColorInput,
  ColorOptions,
  ColorWheelConfig,
  CSSVariablesOptions,
  EasingFunction,
  ExportOptions,
  GradientConfig,
  // HarmonyType, // exported from ../harmony
  HSL,
  HSV,
  HWB,
  InterpolationSpace,
  Keyframe,
  LAB,
  LCH,
  OKLAB,
  OKLCH,
  Plugin,
  PluginConfig,
  PluginType,
  RGB,
  TextSize,
  VisualizationType,
  WCAGLevel,
  XYZ,
} from '../types'

// Re-export HarmonyType from harmony module
export type { HarmonyType } from '../harmony'
