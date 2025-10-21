/**
 * @ldesign/color - Color Conversions
 *
 * Functions for converting between different color formats
 */
import type { HSL, HSV, HWB, RGB } from '../types';
export declare function rgbToHex(rgb: RGB): string;
/**
 * Convert Hex string to RGB - Optimized
 */
export declare function hexToRgb(hex: string): RGB;
/**
 * Convert RGB to HSL - Optimized with object pooling
 */
export declare function rgbToHsl(rgb: RGB): HSL;
/**
 * Convert HSL to RGB - Optimized inline calculations with object pooling
 */
export declare function hslToRgb(hsl: HSL): RGB;
/**
 * Convert RGB to HSV
 */
export declare function rgbToHsv(rgb: RGB): HSV;
/**
 * Convert HSV to RGB
 */
export declare function hsvToRgb(hsv: HSV): RGB;
/**
 * Convert RGB to HWB
 */
export declare function rgbToHwb(rgb: RGB): HWB;
/**
 * Convert HWB to RGB
 */
export declare function hwbToRgb(hwb: HWB): RGB;
/**
 * Convert HSL to HSV
 */
export declare function hslToHsv(hsl: HSL): HSV;
/**
 * Convert HSV to HSL
 */
export declare function hsvToHsl(hsv: HSV): HSL;
/**
 * Parse CSS color string
 */
export declare function parseColorString(input: string): RGB | null;
