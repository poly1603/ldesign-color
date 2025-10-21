/**
 * @ldesign/color - Validators
 *
 * Validation and parsing functions for color inputs
 */
import type { ColorInput, HSL, HSV, HWB, RGB } from '../types';
/**
 * Validate RGB color values - Optimized
 */
export declare function validateRGB(rgb: RGB): boolean;
/**
 * Validate HSL color values
 */
export declare function validateHSL(hsl: HSL): boolean;
/**
 * Validate HSV color values
 */
export declare function validateHSV(hsv: HSV): boolean;
/**
 * Validate HWB color values
 */
export declare function validateHWB(hwb: HWB): boolean;
export declare function validateHex(hex: string): boolean;
/**
 * Check if a value is a valid color input - Optimized
 */
export declare function isColorInput(value: any): value is ColorInput;
/**
 * Parse any color input into RGB
 */
export declare function parseColorInput(input: ColorInput): {
    rgb: RGB;
    alpha: number;
};
/**
 * Sanitize color channel value - Optimized
 */
export declare function sanitizeChannel(value: number, max?: number): number;
/**
 * Sanitize alpha value - Optimized
 */
export declare function sanitizeAlpha(value: number | undefined): number;
/**
 * Validate color format string
 */
export declare function isValidColorFormat(format: string): boolean;
