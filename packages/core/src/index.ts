/**
 * @ldesign/color-core
 *
 * A powerful, performant, and framework-agnostic color manipulation library
 *
 * @packageDocumentation
 */

// Export all types
// Default export
import { Color } from './core'

// ========== 主题色彩生成（核心功能） ==========
// 基于主色调自动生成完整色彩体系的核心 API
export {
  generateThemeColors,
  generateCSSVariables,
  injectCSSVariables,
  COLOR_SHADES,
} from './theme'

export type {
  ColorShade,
  ColorScale,
  SemanticColors,
  ThemeColors,
  ColorGeneratorOptions,
  CSSVariablesOptions,
} from './theme'

// Accessibility tools
export {
  autoAdjustForWCAG,
  ColorAccessibility,
  getAccessibilityReport,
  simulateColorBlindness,
  suggestAccessiblePairs,
} from './accessibility'

export type { ColorBlindnessType } from './accessibility'

// AI color assistant
export {
  ColorAI,
  colorAI,
  createColorAI,
} from './ai/colorAI'

export type { AIColorOptions, AIColorSuggestion, ColorContext } from './ai/colorAI'
// Color analyzer
export {
  analyzeColorDistribution,
  ColorAnalyzer,
  extractPalette,
  findDominantColors,
  generateColorReport,
} from './analyzer'
export type { AnalyzerOptions, ColorDistribution, ColorStatistics } from './analyzer'

// Export interpolation
export {
  ColorInterpolator,
  gradient,
  interpolate,
  mix as interpolateMix,
} from './animation/interpolation'

// Export advanced interpolation
export {
  BezierColorInterpolator,
  CatmullRomInterpolator,
  BSplineInterpolator,
  MonotoneInterpolator,
  bezierGradient,
  catmullRomGradient,
  bSplineGradient,
  monotoneGradient,
} from './animation/advanced-interpolation'

// Batch Processing
export * from './batch'
// Brand manager
export {
  BrandColorManager,
  createBrandManager,
} from './brand'

export type { BrandColors, BrandConfig, BrandPalette } from './brand'

// Export constants
export * from './constants'

// Export core functionality
export * from './core'

// Export color science functions (advanced color difference calculations)
export {
  deltaE76,
  deltaE94,
  deltaECMC,
  colorSimilarity,
  findNearestColor,
  findNearestColors,
  areColorsDistinguishable,
  colorDistanceMatrix,
  analyzePaletteDiversity,
} from './core/color-science'

export type {
  DeltaEOptions,
  ColorSimilarity,
  PaletteDiversityAnalysis,
} from './core/color-science'

// Export color spaces (deltaE2000 and deltaEOKLAB already exported from colorSpaces)
export {
  deltaE2000,
  deltaEOKLAB,
  labToLCH,
  labToRGB,
  labToXYZ,
  lchToLAB,
  lchToRGB,
  oklabToOKLCH,
  oklabToRGB,
  oklchToOKLAB,
  oklchToRGB,
  rgbToLAB,
  rgbToLCH,
  rgbToOKLAB,
  rgbToOKLCH,
  rgbToXYZ,
  xyzToLAB,
  xyzToRGB,
} from './core/colorSpaces'
// Note: TAILWIND_SHADES is already exported from ./core

// Design Systems (includes generateTailwindPalette, generateTailwindScale, generateTailwindSemanticColors)
export * from './design-systems'
// Gradient generator
export {
  animatedGradient,
  conicGradient,
  GradientGenerator,
  linearGradient,
  meshGradient,
  radialGradient,
  smoothGradient,
} from './gradient'

export type { GradientStop, LinearGradientOptions, RadialGradientOptions } from './gradient'
// Color Harmony
export * from './harmony'

// Locales
export {
  deDE,
  enUS,
  esES,
  frFR,
  getLocale,
  itIT,
  jaJP,
  koKR,
  locales,
  ptBR,
  ruRU,
  zhCN,
} from './locales'
export type { ColorLocale, LocaleKey } from './locales'

// Performance optimization
export {
  batchAnalyze,
  BatchColorProcessor,
  batchConvert,
  batchManipulate,
  batchProcess,
  ColorPerformance,
  LazyColorLoader,
  lazyLoad,
  preloadModules,
} from './performance'
export type { BatchOptions, PerformanceMetrics } from './performance'

// Plugin system
export { ColorPluginSymbol, createColorPlugin } from './plugin'
export type { ColorPlugin, ColorPluginOptions } from './plugin'

export { useColorPlugin } from './plugin/useColorPlugin'
// Color schemes generator
export {
  ColorSchemeGenerator,
  evaluateHarmony,
  generateAdaptiveScheme,
  generateAllSchemes,
  generateColorScheme,
} from './schemes'

export type { ColorScheme, ColorSchemeOptions, ColorSchemeType } from './schemes'
// Theme management
export * from './themes/presets'

export { defaultThemeManager, ThemeManager } from './themes/themeManager'
export type { ThemeOptions, ThemeState } from './themes/themeManager'

export { defaultThemeModeManager, ThemeModeManager, setThemeMode, getThemeMode, toggleThemeMode, getEffectiveTheme } from './themes/themeModeManager'
export type { ThemeMode, EffectiveTheme, ThemeModeOptions, ThemeModeState } from './themes/themeModeManager'

export { BaseThemeAdapter } from './themes/BaseThemeAdapter'
export type {
  ThemeAdapterOptions,
  ThemeAdapterState,
  ThemeChangeCallback,
} from './themes/BaseThemeAdapter'

export * from './types'

// Color Space Conversion
export {
  optimizedRGBToHSL,
  batchRGBToHSL,
  batchHSLToRGB,
  batchRGBToHSV,
  batchHSVToRGB,
  initColorSpace,
  getLUTStats,
  clearLUT,
  rebuildLUT,
} from './utils/color-space'

// Export utilities
export {
  ColorCache,
  createCacheKey,
  globalColorCache,
  memoize,
} from './utils/cache'

export type {
  ColorCacheConfig,
  ColorCacheStats,
  EvictionStrategy,
} from './utils/cache'

// Color operation cache
export {
  ColorOperationCache,
  colorCache,
  cached,
} from './utils/operation-cache'
// Advanced Utilities
export * from './utils/colorUtils'

// Error handling
export {
  ColorConversionError,
  ColorError,
  ColorManipulationError,
  ErrorLogger,
  ErrorRecovery,
  InputValidationError,
  logError,
  retryExecute,
  safeExecute,
  ThemeOperationError,
} from './utils/errors'
export type { ErrorCategory, ErrorSeverity, RecoverySuggestion } from './utils/errors'

export {
  average,
  clamp,
  degreesToRadians,
  euclideanDistance,
  lerp,
  mapRange,
  normalize,
  radiansToDegrees,
  randomInt,
  randomRange,
  round,
} from './utils/math'

// Memory management
export {
  cleanupMemory,
  getMemoryStats,
  memoryManager,
  resetMemory,
  setAutoCleanup,
  setMemoryLimit,
} from './utils/memoryManager'

export type { MemoryStats } from './utils/memoryManager'

// Object Pool Management
export { hslPool, hsvPool, ObjectPool, poolManager, rgbPool } from './utils/objectPool'

export {
  isColorInput,
  isValidColorFormat,
  parseColorInput,
  sanitizeAlpha,
  sanitizeChannel,
  validateHex,
  validateHSL,
  validateHSV,
  validateHWB,
  validateRGB,
} from './utils/validators'

// Enhanced validators (detailed validation with better error messages)
export {
  validateRGBSafe,
  validateHSLSafe,
  validateAmount,
  validateAlpha,
  validateRotation,
  validateArrayLength,
  validatePositiveInteger,
  validateInterpolationSpace,
  validateColorFormat,
  validateBlendMode,
  isRGB,
  isHSL,
  isHSV,
  isHWB,
  validateColorInput,
  validatePercentage,
  validateRange,
} from './utils/enhanced-validators'

// Version
export const VERSION = '1.0.0'
export default Color
