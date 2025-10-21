/**
 * 智能颜色方案生成�?
 * 提供多种配色方案生成算法
 */
import { Color } from '../core/Color';
/**
 * 配色方案类型
 */
export type ColorSchemeType = 'monochromatic' | 'analogous' | 'complementary' | 'split-complementary' | 'triadic' | 'tetradic' | 'square' | 'compound';
/**
 * 配色方案选项
 */
export interface ColorSchemeOptions {
    count?: number;
    includeBase?: boolean;
    variation?: number;
    preserveLightness?: boolean;
    preserveSaturation?: boolean;
    enhanceHarmony?: boolean;
}
/**
 * 配色方案结果
 */
export interface ColorScheme {
    type: ColorSchemeType;
    base: Color;
    colors: Color[];
    description: string;
    harmony?: number;
}
/**
 * 智能颜色方案生成�?
 */
export declare class ColorSchemeGenerator {
    /**
     * 生成配色方案
     */
    static generate(baseColor: Color, type: ColorSchemeType, options?: ColorSchemeOptions): ColorScheme;
    /**
     * 自动选择配色方案
     */
    static generateAdaptive(baseColor: Color, options?: ColorSchemeOptions): ColorScheme;
    /**
     * 批量生成多种配色方案
     */
    static generateAll(baseColor: Color, options?: ColorSchemeOptions): ColorScheme[];
    /**
     * 生成单色系方案
     */
    private static generateMonochromatic;
    /**
     * 生成类似色方案
     */
    private static generateAnalogous;
    /**
     * 生成互补色方案
     */
    private static generateComplementary;
    /**
     * 生成分裂互补方案
     */
    private static generateSplitComplementary;
    /**
     * 生成三角色方案
     */
    private static generateTriadic;
    /**
     * 生成四角色方案
     */
    private static generateTetradic;
    /**
     * 生成正方形方案
     */
    private static generateSquare;
    /**
     * 生成复合色方案
     */
    private static generateCompound;
    /**
     * 调整颜色以增强和谐度
     */
    private static adjustHarmony;
    /**
     * 评估配色方案的和谐度
     */
    static evaluateHarmony(scheme: ColorScheme): number;
}
export declare const generateColorScheme: typeof ColorSchemeGenerator.generate;
export declare const generateAdaptiveScheme: typeof ColorSchemeGenerator.generateAdaptive;
export declare const generateAllSchemes: typeof ColorSchemeGenerator.generateAll;
export declare const evaluateHarmony: typeof ColorSchemeGenerator.evaluateHarmony;
