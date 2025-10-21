/**
 * @ldesign/color - Color Manipulations
 *
 * Functions for manipulating colors including mixing and blending
 */
import type { BlendMode, RGB } from '../types';
/**
 * Mix two colors by a given amount
 */
export declare function mix(rgb1: RGB, rgb2: RGB, amount: number): RGB;
/**
 * Blend two colors using various blend modes
 */
export declare function blend(base: RGB, overlay: RGB, mode: BlendMode): RGB;
/**
 * Apply tint to a color (mix with white)
 */
export declare function tint(rgb: RGB, amount: number): RGB;
/**
 * Apply shade to a color (mix with black)
 */
export declare function shade(rgb: RGB, amount: number): RGB;
/**
 * Apply tone to a color (mix with gray)
 */
export declare function tone(rgb: RGB, amount: number): RGB;
/**
 * Adjust brightness of a color
 */
export declare function adjustBrightness(rgb: RGB, amount: number): RGB;
/**
 * Adjust contrast of a color
 */
export declare function adjustContrast(rgb: RGB, amount: number): RGB;
/**
 * Apply gamma correction to a color
 */
export declare function gammaCorrection(rgb: RGB, gamma: number): RGB;
export declare function sepia(rgb: RGB, amount?: number): RGB;
export declare function grayscale(rgb: RGB): RGB;
/**
 * Apply negative/invert to a color
 */
export declare function negative(rgb: RGB): RGB;
/**
 * Apply posterize effect to a color
 */
export declare function posterize(rgb: RGB, levels: number): RGB;
