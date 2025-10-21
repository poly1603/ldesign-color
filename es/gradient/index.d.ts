/**
 * 渐变色生成器
 * 支持线性、径向、锥形和网格渐变
 */
import type { ColorInput } from '../types';
import { Color } from '../core/Color';
/**
 * 渐变色停止点
 */
export interface GradientStop {
    color: Color;
    position?: number;
}
/**
 * 渐变选项
 */
export interface GradientOptions {
    stops?: GradientStop[];
    smoothing?: boolean;
    colorSpace?: 'rgb' | 'hsl' | 'lab';
}
/**
 * 线性渐变选项
 */
export interface LinearGradientOptions extends GradientOptions {
    angle?: number;
    repeating?: boolean;
}
/**
 * 径向渐变选项
 */
export interface RadialGradientOptions extends GradientOptions {
    shape?: 'circle' | 'ellipse';
    size?: 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner';
    position?: {
        x: string | number;
        y: string | number;
    };
}
/**
 * 锥形渐变选项
 */
export interface ConicGradientOptions extends GradientOptions {
    startAngle?: number;
    position?: {
        x: string | number;
        y: string | number;
    };
}
/**
 * 网格渐变选项
 */
export interface MeshGradientOptions {
    colors: Color[][];
    smoothness?: number;
    resolution?: number;
}
/**
 * 渐变生成器类
 */
export declare class GradientGenerator {
    /**
     * 生成线性渐�?
     */
    static linear(colors: ColorInput[], options?: LinearGradientOptions): string;
    /**
     * 生成径向渐变
     */
    static radial(colors: ColorInput[], options?: RadialGradientOptions): string;
    /**
     * 生成锥形渐变
     */
    static conic(colors: ColorInput[], options?: ConicGradientOptions): string;
    /**
     * 生成网格渐变（CSS Paint API�?
     */
    static mesh(colors: Color[][], options?: Partial<MeshGradientOptions>): {
        css: string;
        canvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
    };
    /**
     * 生成平均分布的停止点 - 保留原方法以兼容
     */
    private static generateEvenStops;
    /**
     * 优化的生成平均分布停止点 - 延迟创建Color对象
     */
    private static generateEvenStopsOptimized;
    /**
     * 绘制双线性渐变（用于网格渐变�?
     */
    private static drawBilinearGradient;
    /**
     * 生成平滑渐变（使用贝塞尔曲线插值）
     */
    static smooth(colors: ColorInput[], steps?: number): Color[];
    /**
     * 贝塞尔曲线颜色插值 - 优化递归内存使用
     */
    private static bezierInterpolation;
    /**
     * 生成动画渐变配置
     */
    static animated(colors: ColorInput[], duration?: number, type?: 'linear' | 'radial' | 'conic'): {
        css: string;
        keyframes: string;
    };
    /**
     * 生成渐变的CSS变量
     */
    static toCSSVariables(gradientName: string, colors: ColorInput[], prefix?: string): Record<string, string>;
}
export declare const linearGradient: typeof GradientGenerator.linear;
export declare const radialGradient: typeof GradientGenerator.radial;
export declare const conicGradient: typeof GradientGenerator.conic;
export declare const meshGradient: typeof GradientGenerator.mesh;
export declare const smoothGradient: typeof GradientGenerator.smooth;
export declare const animatedGradient: typeof GradientGenerator.animated;
