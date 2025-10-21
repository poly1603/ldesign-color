/**
 * @ldesign/color - Color Analysis
 *
 * Functions for analyzing color properties like luminance and contrast
 *
 * @module core/analysis
 * @see https://www.w3.org/TR/WCAG21/
 */
import type { RGB, TextSize, WCAGLevel } from '../types';
/**
 * Calculate relative luminance of a color using WCAG 2.1 formula
 *
 * Luminance measures brightness on a scale of 0 (black) to 1 (white).
 *
 * @param rgb - RGB color object with r, g, b values (0-255)
 * @returns Relative luminance value between 0 and 1
 *
 * @example
 * ```ts
 * const luminance = getLuminance({ r: 255, g: 0, b: 0 })
 * console.log(luminance) // 0.2126
 * ```
 *
 * @performance O(1) - Constant time with optimized calculations
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
export declare function getLuminance(rgb: RGB): number;
/**
 * Calculate contrast ratio between two colors using WCAG 2.1 formula
 *
 * Contrast ratio ranges from 1:1 (no contrast) to 21:1 (maximum contrast).
 *
 * @param rgb1 - First RGB color object
 * @param rgb2 - Second RGB color object
 * @returns Contrast ratio between 1 and 21
 *
 * @example
 * ```ts
 * const contrast = getContrast(
 *   { r: 255, g: 255, b: 255 }, // White
 *   { r: 0, g: 0, b: 0 }         // Black
 * )
 * console.log(contrast) // 21 (maximum contrast)
 * ```
 *
 * @performance O(1) - Optimized luminance calculation
 * @see https://www.w3.org/TR/WCAG20-TECHS/G18.html
 */
export declare function getContrast(rgb1: RGB, rgb2: RGB): number;
/**
 * Check if two colors meet WCAG contrast requirements
 *
 * WCAG Contrast Requirements:
 * - AA Normal text: 4.5:1
 * - AA Large text: 3:1
 * - AAA Normal text: 7:1
 * - AAA Large text: 4.5:1
 *
 * @param foreground - Text color (RGB)
 * @param background - Background color (RGB)
 * @param level - WCAG level ('AA' or 'AAA'), defaults to 'AA'
 * @param size - Text size ('normal' or 'large'), defaults to 'normal'
 * @returns True if colors meet WCAG requirements
 *
 * @example
 * ```ts
 * const isCompliant = isWCAGCompliant(
 *   { r: 0, g: 0, b: 0 },
 *   { r: 255, g: 255, b: 255 },
 *   'AA',
 *   'normal'
 * )
 * console.log(isCompliant) // true
 * ```
 *
 * @performance O(1) - Fast contrast calculation
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export declare function isWCAGCompliant(foreground: RGB, background: RGB, level?: WCAGLevel, size?: TextSize): boolean;
/**
 * Get the required contrast ratio for WCAG compliance
 */
export declare function getRequiredContrast(level: WCAGLevel, size: TextSize): number;
/**
 * Calculate perceived brightness using weighted formula
 *
 * Uses perceptual brightness formula that accounts for human vision
 * sensitivity to different colors (more sensitive to green than red/blue).
 *
 * @param rgb - RGB color object
 * @returns Perceived brightness value between 0 and 255
 *
 * @example
 * ```ts
 * const brightness = getPerceivedBrightness({ r: 255, g: 0, b: 0 })
 * console.log(brightness) // ~76 (red appears darker than its RGB value suggests)
 * ```
 *
 * @performance O(1) - Optimized with pre-computed coefficients
 * @see http://alienryderflex.com/hsp.html
 */
export declare function getPerceivedBrightness(rgb: RGB): number;
/**
 * Check if a color is perceived as light
 */
export declare function isLight(rgb: RGB): boolean;
/**
 * Check if a color is perceived as dark
 */
export declare function isDark(rgb: RGB): boolean;
/**
 * Get the best text color (black or white) for a background
 */
export declare function getBestTextColor(background: RGB): RGB;
/**
 * Calculate color difference using Euclidean distance
 */
export declare function getColorDifference(rgb1: RGB, rgb2: RGB): number;
/**
 * Check if two colors are visually similar
 */
export declare function areColorsSimilar(rgb1: RGB, rgb2: RGB, threshold?: number): boolean;
/**
 * Get dominant color channel
 */
export declare function getDominantChannel(rgb: RGB): 'red' | 'green' | 'blue' | 'neutral';
/**
 * Calculate color intensity (0-1)
 */
export declare function getColorIntensity(rgb: RGB): number;
/**
 * Get color temperature classification
 */
export declare function getColorTemperature(rgb: RGB): 'cool' | 'warm' | 'neutral';
/**
 * Calculate the purity/saturation of a color (0-1)
 */
export declare function getColorPurity(rgb: RGB): number;
