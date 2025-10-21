/**
 * @ldesign/color - Natural Palette Generation
 *
 * Advanced color palette generation with natural-looking scales
 * Based on algorithms from a-nice-red and tailwindcss-palette-generator
 */
import type { ColorInput } from '../types';
/**
 * Generate semantic colors based on primary color using a-nice-red algorithm
 * This creates more natural looking semantic colors by considering the primary color's hue range
 */
export declare function generateNaturalSemanticColors(primaryColor: ColorInput): {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    gray: string;
};
/**
 * Shade configuration for natural-looking palettes
 */
export interface ShadeConfig {
    name: string | number;
    lightness: number;
}
/**
 * Default shade configurations (12 levels)
 */
export declare const DEFAULT_SHADES: ShadeConfig[];
/**
 * Gray shade configurations (14 levels)
 */
export declare const GRAY_SHADES: ShadeConfig[];
/**
 * Material Design shade configuration (12 levels)
 */
export declare const MATERIAL_SHADES: ShadeConfig[];
/**
 * Ant Design shade configuration (12 levels)
 */
export declare const ANTD_SHADES: ShadeConfig[];
/**
 * Generate a natural-looking color scale - Optimized memory usage
 */
export declare function generateNaturalScale(baseColor: ColorInput, options?: {
    shades?: ShadeConfig[];
    preserve?: boolean;
    adjustSaturation?: boolean;
}): {
    [key: string | number]: string;
};
/**
 * Generate natural gray scale with slight tint
 */
export declare function generateNaturalGrayScale(options?: {
    tintHue?: number;
    shades?: ShadeConfig[];
}): {
    [key: string | number]: string;
};
/**
 * Generate a complete natural theme palette
 */
export declare function generateNaturalTheme(primaryColor: ColorInput, options?: {
    shades?: ShadeConfig[];
    generateSemantics?: boolean;
    includeGrays?: boolean;
    preserve?: boolean;
}): {
    primary: {
        [key: string | number]: string;
    };
    success?: {
        [key: string | number]: string;
    };
    warning?: {
        [key: string | number]: string;
    };
    danger?: {
        [key: string | number]: string;
    };
    info?: {
        [key: string | number]: string;
    };
    gray?: {
        [key: string | number]: string;
    };
};
/**
 * Smart color generation based on relationships
 */
export declare function generateSmartPalette(colors: ColorInput[], options?: {
    names?: string[];
    shades?: ShadeConfig[];
    preserve?: boolean;
}): {
    [key: string]: {
        [key: string | number]: string;
    };
};
/**
 * Generate accessible color pairs
 */
export declare function generateAccessiblePairs(baseColor: ColorInput, targetContrast?: number): {
    foreground: string;
    background: string;
    contrast: number;
};
