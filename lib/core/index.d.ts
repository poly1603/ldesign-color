/**
 * @ldesign/color - Core Module
 *
 * Export all core color functionality
 */
export { generateSemanticCssVariables, generateThemedCssVariables, getThemeMode, initThemeMode, injectThemedCssVariables, saveThemeMode, setThemeMode, toggleThemeMode } from '../palette/cssVariables';
export { generateDarkSemanticColors, generateTailwindDarkGrayScale, generateTailwindDarkScale, generateThemePalettes, type ThemePalettes } from '../palette/darkMode';
export { areColorsSimilar, getBestTextColor, getColorDifference, getColorIntensity, getColorPurity, getColorTemperature, getContrast, getDominantChannel, getLuminance, getPerceivedBrightness, getRequiredContrast, isDark, isLight, isWCAGCompliant } from './analysis';
export { Color, Colors } from './Color';
export { hexToRgb, hslToHsv, hslToRgb, hsvToHsl, hsvToRgb, hwbToRgb, parseColorString, rgbToHex, rgbToHsl, rgbToHsv, rgbToHwb } from './conversions';
export { adjustBrightness, adjustContrast, blend, gammaCorrection, grayscale, mix, negative, posterize, sepia, shade, tint, tone } from './manipulations';
export { ANTD_SHADES, DEFAULT_SHADES, generateAccessiblePairs, generateNaturalGrayScale, generateNaturalScale, generateNaturalSemanticColors, generateNaturalTheme, generateSmartPalette, GRAY_SHADES, MATERIAL_SHADES, type ShadeConfig } from './naturalPalette';
export { applyTheme, generateCSSVariables, generateGrayScale, generateMaterialPalette, generateNumberedPalette, generateScale, generateSemanticColors, generateTailwindPalette, generateThemePalette, insertCSSVariables } from './palette';
export { applyThemeCssVars, type CssVarOptions, type CssVarSuffixFormat, generatePaletteCssVars, generateTailwindGrayScale, generateTailwindPalettes, generateTailwindScale, generateTailwindSemanticColors, generateTailwindTheme, generateThemeCssVars, insertCssVars, TAILWIND_SHADES } from './tailwindPalette';
