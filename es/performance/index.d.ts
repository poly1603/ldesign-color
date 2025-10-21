/**
 * 性能优化模块
 * Web Workers支持、批量操作优化、懒加载
 */
import type { ColorInput } from '../types';
import { Color } from '../core/Color';
/**
 * 批量操作选项
 */
export interface BatchOptions {
    parallel?: boolean;
    chunkSize?: number;
    useWorker?: boolean;
    onProgress?: (progress: number) => void;
}
/**
 * 性能监控数据
 */
export interface PerformanceMetrics {
    operationCount: number;
    totalTime: number;
    averageTime: number;
    cacheHitRate: number;
    memoryUsage?: number;
}
/**
 * 批量颜色处理�?
 */
export declare class BatchColorProcessor {
    private worker?;
    private workerReady;
    private pendingTasks;
    private metrics;
    constructor();
    /**
     * 初始化Web Worker
     */
    private initWorker;
    /**
     * 批量处理颜色
     */
    batchProcess<T>(colors: ColorInput[], processor: (color: Color) => T, options?: BatchOptions): Promise<T[]>;
    /**
     * 批量转换颜色格式
     */
    batchConvert(colors: ColorInput[], format: 'hex' | 'rgb' | 'hsl' | 'hsv', options?: BatchOptions): Promise<string[]>;
    /**
     * 批量颜色操作
     */
    batchManipulate(colors: ColorInput[], operation: 'lighten' | 'darken' | 'saturate' | 'desaturate' | 'rotate', amount: number, options?: BatchOptions): Promise<Color[]>;
    /**
     * 批量分析颜色
     */
    batchAnalyze(colors: ColorInput[], options?: BatchOptions): Promise<Array<{
        luminance: number;
        isLight: boolean;
        hsl: {
            h: number;
            s: number;
            l: number;
        };
    }>>;
    /**
     * 数组分块
     */
    private chunkArray;
    /**
     * 生成任务ID
     */
    private generateTaskId;
    /**
     * 更新性能指标
     */
    private updateMetrics;
    /**
     * 获取性能指标
     */
    getMetrics(): PerformanceMetrics;
    /**
     * 重置性能指标
     */
    resetMetrics(): void;
    /**
     * 销毁Worker
     */
    destroy(): void;
}
/**
 * 懒加载管理器
 */
export declare class LazyColorLoader {
    private loadedModules;
    private loadingPromises;
    /**
     * 懒加载高级功能模�?
     */
    loadModule(moduleName: string): Promise<any>;
    /**
     * 动态导入模�?
     */
    private dynamicImport;
    /**
     * 预加载关键模�?
     */
    preloadCriticalModules(): Promise<void>;
    /**
     * 检查模块是否已加载
     */
    isModuleLoaded(moduleName: string): boolean;
    /**
     * 获取已加载的模块列表
     */
    getLoadedModules(): string[];
}
/**
 * 性能优化工具�?
 */
export declare class ColorPerformance {
    private static batchProcessor;
    private static lazyLoader;
    /**
     * 批量处理
     */
    static batch: {
        process: <T>(colors: ColorInput[], processor: (color: Color) => T, options?: BatchOptions) => Promise<T[]>;
        convert: (colors: ColorInput[], format: "hex" | "rgb" | "hsl" | "hsv", options?: BatchOptions) => Promise<string[]>;
        manipulate: (colors: ColorInput[], operation: "lighten" | "darken" | "saturate" | "desaturate" | "rotate", amount: number, options?: BatchOptions) => Promise<Color[]>;
        analyze: (colors: ColorInput[], options?: BatchOptions) => Promise<Array<{
            luminance: number;
            isLight: boolean;
            hsl: {
                h: number;
                s: number;
                l: number;
            };
        }>>;
    };
    /**
     * 懒加�?
     */
    static lazy: {
        load: (moduleName: string) => Promise<any>;
        preload: () => Promise<void>;
        isLoaded: (moduleName: string) => boolean;
        getLoaded: () => string[];
    };
    /**
     * 性能监控
     */
    static monitor: {
        getMetrics: () => PerformanceMetrics;
        resetMetrics: () => void;
    };
    /**
     * 优化建议
     */
    static getOptimizationSuggestions(): string[];
}
export declare const batchProcess: <T>(colors: ColorInput[], processor: (color: Color) => T, options?: BatchOptions) => Promise<T[]>;
export declare const batchConvert: (colors: ColorInput[], format: "hex" | "rgb" | "hsl" | "hsv", options?: BatchOptions) => Promise<string[]>;
export declare const batchManipulate: (colors: ColorInput[], operation: "lighten" | "darken" | "saturate" | "desaturate" | "rotate", amount: number, options?: BatchOptions) => Promise<Color[]>;
export declare const batchAnalyze: (colors: ColorInput[], options?: BatchOptions) => Promise<Array<{
    luminance: number;
    isLight: boolean;
    hsl: {
        h: number;
        s: number;
        l: number;
    };
}>>;
export declare const lazyLoad: (moduleName: string) => Promise<any>;
export declare const preloadModules: () => Promise<void>;
