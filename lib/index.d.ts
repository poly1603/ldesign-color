/**
 * @ldesign/color
 *
 * A powerful, performant, and easy-to-use color manipulation library
 *
 * @packageDocumentation
 */
import { Color } from './core';
export { autoAdjustForWCAG, ColorAccessibility, getAccessibilityReport, simulateColorBlindness, suggestAccessiblePairs } from './accessibility';
export type { ColorBlindnessType } from './accessibility';
export { ColorAI, colorAI, createColorAI } from './ai/colorAI';
export type { AIColorOptions, AIColorSuggestion, ColorContext } from './ai/colorAI';
export { analyzeColorDistribution, ColorAnalyzer, extractPalette, findDominantColors, generateColorReport } from './analyzer';
export type { AnalyzerOptions, ColorDistribution, ColorStatistics } from './analyzer';
export { BrandColorManager, createBrandManager } from './brand';
export type { BrandColors, BrandConfig, BrandPalette } from './brand';
export { getColorName, getNamedColor, getNamedColorNames, isNamedColor, namedColors } from './constants/namedColors';
export * from './core';
export * from './core/tailwindPalette';
export { animatedGradient, conicGradient, GradientGenerator, linearGradient, meshGradient, radialGradient, smoothGradient } from './gradient';
export type { GradientStop, LinearGradientOptions, RadialGradientOptions } from './gradient';
export { deDE, enUS, esES, frFR, getLocale, itIT, jaJP, koKR, locales, ptBR, ruRU, zhCN } from './locales';
export type { ColorLocale, LocaleKey } from './locales';
export { batchAnalyze, BatchColorProcessor, batchConvert, batchManipulate, batchProcess, ColorPerformance, LazyColorLoader, lazyLoad, preloadModules } from './performance';
export type { BatchOptions, PerformanceMetrics } from './performance';
export { ColorPluginSymbol, createColorPlugin } from './plugin';
export type { ColorPlugin, ColorPluginOptions } from './plugin';
export { useColorPlugin } from './plugin/useColorPlugin';
export { ColorSchemeGenerator, evaluateHarmony, generateAdaptiveScheme, generateAllSchemes, generateColorScheme } from './schemes';
export type { ColorScheme, ColorSchemeOptions, ColorSchemeType } from './schemes';
export * from './themes/presets';
export { defaultThemeManager, ThemeManager } from './themes/themeManager';
export type { ThemeOptions, ThemeState } from './themes/themeManager';
export * from './types';
export { AdvancedColorCache, globalColorCache as advancedGlobalCache } from './utils/advancedCache';
export type { CacheStats, CacheStrategy } from './utils/advancedCache';
export { ColorCache, createCacheKey, globalColorCache, memoize } from './utils/cache';
export { ColorConversionError, ColorError, ColorManipulationError, ErrorLogger, ErrorRecovery, InputValidationError, logError, retryExecute, safeExecute, ThemeOperationError } from './utils/errors';
export type { ErrorCategory, ErrorSeverity, RecoverySuggestion } from './utils/errors';
export { average, clamp, degreesToRadians, euclideanDistance, lerp, mapRange, normalize, radiansToDegrees, randomInt, randomRange, round } from './utils/math';
export { cleanupMemory, getMemoryStats, memoryManager, resetMemory, setAutoCleanup, setMemoryLimit } from './utils/memoryManager';
export type { MemoryStats } from './utils/memoryManager';
export { isColorInput, isValidColorFormat, parseColorInput, sanitizeAlpha, sanitizeChannel, validateHex, validateHSL, validateHSV, validateHWB, validateRGB } from './utils/validators';
export declare const VERSION = "1.0.0";
export default Color;
