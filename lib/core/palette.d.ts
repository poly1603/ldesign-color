/**
 * @ldesign/color - Palette Generation
 *
 * Functions for generating color palettes, scales, and CSS variables
 */
import type { ColorInput } from '../types';
import { Color } from './Color';
/**
 * Generate a color scale with multiple shades - Optimized
 */
export declare function generateScale(baseColor: ColorInput, steps?: number, options?: {
    mode?: 'lightness' | 'saturation' | 'both';
    curve?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}): Color[];
/**
 * Generate a numbered color palette - Optimized
 */
export declare function generateNumberedPalette(baseColor: ColorInput, options?: {
    lightSteps?: number[];
    darkSteps?: number[];
}): {
    [key: number]: string;
};
/**
 * Generate semantic colors (success, warning, danger)
 */
export declare function generateSemanticColors(primaryColor: ColorInput): {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
};
/**
 * Generate gray scale
 */
export declare function generateGrayScale(steps?: number): Color[];
/**
 * Generate a complete theme palette
 */
export declare function generateThemePalette(primaryColor: ColorInput, options?: {
    generateScales?: boolean;
    scaleSteps?: number;
    includeGrays?: boolean;
    graySteps?: number;
}): {
    primary: string | {
        [key: number]: string;
    };
    success: string | {
        [key: number]: string;
    };
    warning: string | {
        [key: number]: string;
    };
    danger: string | {
        [key: number]: string;
    };
    info: string | {
        [key: number]: string;
    };
    gray?: {
        [key: number]: string;
    };
};
/**
 * Generate CSS variables from theme palette
 */
export declare function generateCSSVariables(theme: any, options?: {
    prefix?: string;
    selector?: string;
    format?: 'hex' | 'rgb' | 'hsl';
}): string;
/**
 * Insert CSS variables into document head
 */
export declare function insertCSSVariables(theme: any, options?: {
    prefix?: string;
    selector?: string;
    format?: 'hex' | 'rgb' | 'hsl';
    id?: string;
}): void;
/**
 * Generate and insert a complete theme
 */
export declare function applyTheme(primaryColor: ColorInput, options?: {
    prefix?: string;
    selector?: string;
    format?: 'hex' | 'rgb' | 'hsl';
    generateScales?: boolean;
    includeGrays?: boolean;
    autoInsert?: boolean;
}): {
    theme: any;
    css: string;
    apply: () => void;
};
/**
 * Generate Material Design palette
 */
export declare function generateMaterialPalette(baseColor: ColorInput): {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    A100?: string;
    A200?: string;
    A400?: string;
    A700?: string;
};
/**
 * Generate Tailwind CSS palette
 */
export declare function generateTailwindPalette(baseColor: ColorInput): {
    [key: string]: string;
};
