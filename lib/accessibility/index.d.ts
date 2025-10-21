/**
 * 颜色无障碍工具
 * 提供色盲模拟、对比度检查和自动调整等功能
 */
import type { TextSize, WCAGLevel } from '../types';
import { Color } from '../core/Color';
/**
 * 色盲类型
 */
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 'achromatopsia' | 'achromatomaly';
/**
 * 颜色无障碍工具类
 */
export declare class ColorAccessibility {
    /**
     * 模拟色盲视觉
     */
    static simulateColorBlindness(color: Color, type: ColorBlindnessType): Color;
    /**
     * 自动调整颜色以满足WCAG标准
     */
    static autoAdjustForWCAG(foreground: Color, background: Color, level?: WCAGLevel, textSize?: TextSize): Color;
    /**
     * 生成无障碍颜色组合建议
     */
    static suggestAccessiblePairs(baseColor: Color, count?: number): Array<{
        color: Color;
        contrast: number;
        wcagAA: boolean;
        wcagAAA: boolean;
    }>;
    /**
     * 检查颜色组合的可访问性报告
     */
    static getAccessibilityReport(foreground: Color, background: Color): {
        contrast: number;
        wcagAA: {
            normal: boolean;
            large: boolean;
        };
        wcagAAA: {
            normal: boolean;
            large: boolean;
        };
        recommendation: string;
    };
    private static getRecommendation;
}
export declare const simulateColorBlindness: typeof ColorAccessibility.simulateColorBlindness;
export declare const autoAdjustForWCAG: typeof ColorAccessibility.autoAdjustForWCAG;
export declare const suggestAccessiblePairs: typeof ColorAccessibility.suggestAccessiblePairs;
export declare const getAccessibilityReport: typeof ColorAccessibility.getAccessibilityReport;
