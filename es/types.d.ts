/**
 * @ldesign/color - Type Definitions
 *
 * All type definitions for the color library
 */
/**
 * RGB color representation
 */
export interface RGB {
    r: number;
    g: number;
    b: number;
    a?: number;
}
/**
 * HSL color representation
 */
export interface HSL {
    h: number;
    s: number;
    l: number;
    a?: number;
}
/**
 * HSV/HSB color representation
 */
export interface HSV {
    h: number;
    s: number;
    v: number;
    a?: number;
}
/**
 * HWB color representation
 */
export interface HWB {
    h: number;
    w: number;
    b: number;
    a?: number;
}
/**
 * CIE LAB color space
 */
export interface LAB {
    l: number;
    a: number;
    b: number;
    alpha?: number;
}
/**
 * CIE LCH color space (cylindrical LAB)
 */
export interface LCH {
    l: number;
    c: number;
    h: number;
    alpha?: number;
}
/**
 * CIE XYZ color space
 */
export interface XYZ {
    x: number;
    y: number;
    z: number;
    alpha?: number;
}
/**
 * OKLAB color space (perceptually uniform)
 */
export interface OKLAB {
    l: number;
    a: number;
    b: number;
    alpha?: number;
}
/**
 * OKLCH color space
 */
export interface OKLCH {
    l: number;
    c: number;
    h: number;
    alpha?: number;
}
/**
 * CMYK color space
 */
export interface CMYK {
    c: number;
    m: number;
    y: number;
    k: number;
    a?: number;
}
/**
 * All possible color input types
 */
export type ColorInput = string | RGB | HSL | HSV | HWB | LAB | LCH | XYZ | OKLAB | OKLCH | CMYK | number[] | {
    toHex: () => string;
    toRGB: () => RGB;
};
/**
 * Color format types
 */
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'hwb' | 'lab' | 'lch' | 'xyz' | 'oklab' | 'oklch' | 'cmyk' | 'name';
/**
 * Blend modes for color mixing
 */
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'linear-burn' | 'linear-dodge' | 'vivid-light' | 'pin-light' | 'hard-mix' | 'hue' | 'saturation' | 'color' | 'luminosity';
/**
 * Interpolation spaces for color mixing
 */
export type InterpolationSpace = 'rgb' | 'hsl' | 'hsv' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch';
/**
 * Color harmony types
 */
export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary' | 'double-complementary' | 'square' | 'monochromatic';
/**
 * WCAG contrast levels
 */
export type WCAGLevel = 'AA' | 'AAA';
/**
 * WCAG text sizes
 */
export type TextSize = 'normal' | 'large';
/**
 * Color blindness types
 */
export type ColorBlindnessType = 'protanopia' | 'protanomaly' | 'deuteranopia' | 'deuteranomaly' | 'tritanopia' | 'tritanomaly' | 'achromatopsia' | 'achromatomaly';
/**
 * Color temperature descriptor
 */
export interface ColorTemperature {
    kelvin: number;
    name: 'cool' | 'neutral' | 'warm';
    description: string;
}
/**
 * Color psychological properties
 */
export interface ColorPsychology {
    emotion: string[];
    energy: 'low' | 'medium' | 'high';
    weight: 'light' | 'medium' | 'heavy';
    temperature: 'cool' | 'neutral' | 'warm';
    associations: string[];
}
/**
 * Color statistics
 */
export interface ColorStatistics {
    dominantChannel: 'red' | 'green' | 'blue';
    brightness: number;
    saturation: number;
    luminance: number;
    contrast: number;
}
/**
 * Color palette configuration
 */
export interface PaletteConfig {
    baseColor?: ColorInput;
    count?: number;
    type?: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'custom';
    variations?: 'lightness' | 'saturation' | 'both';
}
/**
 * Theme colors
 */
export interface ThemeColors {
    primary: string;
    secondary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
    light?: string;
    dark?: string;
    [key: string]: string | undefined;
}
/**
 * Color scheme
 */
export interface ColorScheme {
    name: string;
    colors: string[];
    description?: string;
    tags?: string[];
}
/**
 * Easing function type
 */
export type EasingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'ease-in-quad' | 'ease-out-quad' | 'ease-in-out-quad' | 'ease-in-cubic' | 'ease-out-cubic' | 'ease-in-out-cubic' | 'ease-in-quart' | 'ease-out-quart' | 'ease-in-out-quart' | 'ease-in-quint' | 'ease-out-quint' | 'ease-in-out-quint' | 'ease-in-sine' | 'ease-out-sine' | 'ease-in-out-sine' | 'ease-in-expo' | 'ease-out-expo' | 'ease-in-out-expo' | 'ease-in-circ' | 'ease-out-circ' | 'ease-in-out-circ' | 'ease-in-back' | 'ease-out-back' | 'ease-in-out-back' | 'ease-in-elastic' | 'ease-out-elastic' | 'ease-in-out-elastic' | 'ease-in-bounce' | 'ease-out-bounce' | 'ease-in-out-bounce';
/**
 * Animation configuration
 */
export interface AnimationConfig {
    duration: number;
    delay?: number;
    easing?: EasingFunction | ((t: number) => number);
    iterations?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    onUpdate?: (color: any) => void;
    onComplete?: () => void;
}
/**
 * Keyframe definition
 */
export interface Keyframe {
    color: ColorInput;
    offset: number;
    easing?: EasingFunction;
}
/**
 * Visualization types
 */
export type VisualizationType = 'wheel' | 'spectrum' | 'gradient' | 'cube' | 'cylinder' | 'cone' | 'sphere';
/**
 * Color wheel configuration
 */
export interface ColorWheelConfig {
    size?: number;
    segments?: number;
    rings?: number;
    innerRadius?: number;
    showLabels?: boolean;
}
/**
 * Gradient configuration
 */
export interface GradientConfig {
    type?: 'linear' | 'radial' | 'conic';
    angle?: number;
    stops?: Array<{
        color: ColorInput;
        offset: number;
    }>;
    smoothness?: number;
}
/**
 * 3D point representation
 */
export interface Point3D {
    x: number;
    y: number;
    z: number;
    color?: string;
}
/**
 * SVG path data
 */
export interface SVGPath {
    d: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
}
/**
 * Plugin types
 */
export type PluginType = 'colorSpace' | 'blendMode' | 'analyzer' | 'generator' | 'validator' | 'transformer';
/**
 * Plugin configuration
 */
export interface PluginConfig {
    name: string;
    type: PluginType;
    version: string;
    description?: string;
    author?: string;
    dependencies?: string[];
}
/**
 * Plugin interface
 */
export interface Plugin {
    config: PluginConfig;
    install: (target: any) => void;
    uninstall?: () => void;
}
/**
 * Color options
 */
export interface ColorOptions {
    format?: ColorFormat;
    alpha?: boolean;
    cache?: boolean;
    round?: boolean;
}
/**
 * CSS variables options
 */
export interface CSSVariablesOptions {
    prefix?: string;
    selector?: string;
    colors: ThemeColors;
}
/**
 * Export format options
 */
export interface ExportOptions {
    format: 'css' | 'scss' | 'less' | 'json' | 'js';
    includeAlpha?: boolean;
    includeNames?: boolean;
    wrapper?: string;
}
