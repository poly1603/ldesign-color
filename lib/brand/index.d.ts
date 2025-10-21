/**
 * 品牌色管理器
 * 管理品牌色系统、生成品牌调色板、导出品牌指南
 */
import type { ColorInput } from '../types';
import { Color } from '../core/Color';
/**
 * 品牌色定义
 */
export interface BrandColors {
    primary: Color;
    secondary?: Color;
    accent?: Color;
    success?: Color;
    warning?: Color;
    danger?: Color;
    info?: Color;
    neutral?: Color;
}
/**
 * 品牌色调色板
 */
export interface BrandPalette {
    colors: BrandColors;
    shades: {
        [key in keyof BrandColors]?: {
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
            950?: string;
        };
    };
    semantics: {
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            disabled: string;
            inverse: string;
        };
        background: {
            primary: string;
            secondary: string;
            tertiary: string;
            overlay: string;
            elevated: string;
        };
        border: {
            light: string;
            medium: string;
            heavy: string;
            focus: string;
        };
        status: {
            success: string;
            warning: string;
            danger: string;
            info: string;
        };
    };
}
/**
 * 品牌指南选项
 */
export interface BrandGuideOptions {
    format?: 'json' | 'css' | 'scss' | 'less' | 'stylus';
    includeUsageExamples?: boolean;
    includeAccessibilityInfo?: boolean;
    includeColorTheory?: boolean;
}
/**
 * 品牌色配置
 */
export interface BrandConfig {
    name: string;
    description?: string;
    colors: Partial<BrandColors>;
    metadata?: {
        industry?: string;
        target?: string;
        mood?: string[];
        keywords?: string[];
    };
    constraints?: {
        minContrast?: number;
        maxColors?: number;
        colorSpace?: 'rgb' | 'hsl' | 'lab';
    };
}
/**
 * 品牌色管理器
 */
export declare class BrandColorManager {
    private config;
    private palette?;
    constructor(config: BrandConfig);
    /**
     * 初始化品牌色
     */
    private initializeColors;
    /**
     * 设置品牌色
     */
    setBrandColors(colors: Partial<BrandColors>): void;
    /**
     * 生成品牌调色板
     */
    generateBrandPalette(): BrandPalette;
    /**
     * 生成语义色
     */
    private generateSemantics;
    /**
     * 确保品牌一致性
     */
    ensureBrandConsistency(): {
        consistent: boolean;
        issues: string[];
        suggestions: string[];
    };
    /**
     * 检查色彩和谐度
     */
    private checkColorHarmony;
    /**
     * 导出品牌指南
     */
    exportBrandGuidelines(options?: BrandGuideOptions): string;
    /**
     * 生成使用示例
     */
    private generateUsageExamples;
    /**
     * 生成无障碍信息
     */
    private generateAccessibilityInfo;
    /**
     * 生成色彩理论信息
     */
    private generateColorTheory;
    /**
     * 检测色彩方案
     */
    private detectColorScheme;
    /**
     * 获取色彩心理学
     */
    private getColorPsychology;
    /**
     * 格式化输出
     */
    private formatOutput;
    /**
     * 转换为CSS
     */
    private toCSS;
    /**
     * 转换为SCSS
     */
    private toSCSS;
    /**
     * 转换为LESS
     */
    private toLESS;
    /**
     * 转换为Stylus
     */
    private toStylus;
}
export declare function createBrandManager(name: string, primary: ColorInput, options?: Partial<BrandConfig>): BrandColorManager;
