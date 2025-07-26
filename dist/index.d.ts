import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { InjectionKey } from 'vue';
import { JSX as JSX_2 } from 'vue/jsx-runtime';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { Reactive } from 'vue';
import { Ref } from 'vue';

/**
 * 调整颜色色相
 */
export declare function adjustHue(color: string, amount: number): string;

/**
 * 调整颜色亮度
 */
export declare function adjustLightness(color: string, amount: number): string;

/**
 * 调整颜色饱和度
 */
export declare function adjustSaturation(color: string, amount: number): string;

/**
 * 工具函数：获取颜色分析
 */
export declare function analyzeColor(color: string): Promise<ColorAnalysis>;

/**
 * 异步队列处理器
 */
export declare class AsyncQueue<T> {
    private queue;
    private concurrency;
    private running;
    constructor(concurrency?: number);
    /**
     * 添加任务到队列
     */
    add<R>(task: () => Promise<R>): Promise<R>;
    /**
     * 处理队列
     */
    private process;
    /**
     * 清空队列
     */
    clear(): void;
    /**
     * 获取队列长度
     */
    get length(): number;
}

/**
 * 批量转换颜色格式
 */
export declare function batchFormatColors(colors: string[], format: ColorFormat): string[];

/**
 * 批量生成主题的便捷函数
 */
export declare function batchGenerateThemes(colors: string[], config?: ColorGeneratorConfig): Promise<GeneratedTheme[]>;

/**
 * 批处理函数
 */
export declare class BatchProcessor<T, R> {
    private queue;
    private processor;
    private batchSize;
    private delay;
    private timeout;
    constructor(processor: (items: T[]) => Promise<R[]>, batchSize?: number, delay?: number);
    /**
     * 添加项目到批处理队列
     */
    add(item: T): Promise<R>;
    /**
     * 处理批次
     */
    private processBatch;
}

/**
 * 缓存项类型
 */
export declare interface CacheItem<T = any> {
    /** 缓存值 */
    value: T;
    /** 创建时间 */
    timestamp: number;
    /** 访问次数 */
    accessCount: number;
    /** 最后访问时间 */
    lastAccess: number;
}

/**
 * 生成缓存键的工具函数
 */
export declare class CacheKeyGenerator {
    /**
     * 为颜色生成缓存键
     */
    static forColor(color: string, ...params: any[]): string;
    /**
     * 为语义化颜色生成缓存键
     */
    static forSemanticColors(primaryColor: string): string;
    /**
     * 为色阶生成缓存键
     */
    static forPalette(color: string, isDark: boolean, format: string, steps?: number): string;
    /**
     * 为CSS变量生成缓存键
     */
    static forCSSVariables(colors: Record<string, any>, prefix: string): string;
    /**
     * 对象哈希函数
     */
    private static hashObject;
}

/**
 * 清理颜色字符串
 */
export declare function cleanColorString(color: string): string;

/**
 * 颜色分析结果
 */
export declare interface ColorAnalysis {
    /** 颜色值 */
    color: string;
    /** HSL值 */
    hsl: HSLColor;
    /** RGB值 */
    rgb: RGBColor;
    /** HSV值 */
    hsv: HSVColor;
    /** 亮度值 */
    luminance: number;
    /** 是否为深色 */
    isDark: boolean;
    /** 与白色的对比度 */
    contrastWithWhite: ColorContrast;
    /** 与黑色的对比度 */
    contrastWithBlack: ColorContrast;
}

/**
 * 颜色对比度信息
 */
export declare interface ColorContrast {
    /** 对比度比值 */
    ratio: number;
    /** 是否符合WCAG AA标准 */
    aa: boolean;
    /** 是否符合WCAG AAA标准 */
    aaa: boolean;
}

/**
 * 颜色格式类型
 */
export declare type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';

/**
 * 主要的颜色生成器类
 * 整合所有功能，提供高性能的颜色生成服务
 */
export declare class ColorGenerator {
    private config;
    private semanticGenerator;
    private paletteGenerator;
    private cssGenerator;
    private cache;
    private performanceMonitor;
    private worker;
    private workerPromises;
    constructor(config?: ColorGeneratorConfig);
    /**
     * 生成完整主题（同步版本）
     */
    generate(primaryColor: string): GeneratedTheme;
    /**
     * 异步生成完整主题
     */
    generateAsync(primaryColor: string): Promise<GeneratedTheme>;
    /**
     * 防抖生成函数
     */
    private debouncedGenerate;
    /**
     * 防抖生成（用于频繁调用场景）
     */
    generateDebounced(primaryColor: string, callback: (theme: GeneratedTheme) => void): void;
    /**
     * 使用Web Worker生成
     */
    private generateWithWorker;
    /**
     * 在主线程生成（异步版本）
     */
    private generateWithMainThread;
    /**
     * 内部生成函数
     */
    private generateInternal;
    /**
     * 初始化Web Worker
     */
    private initializeWorker;
    /**
     * 获取Worker代码
     */
    private getWorkerCode;
    /**
     * 获取内联Worker代码
     */
    private getInlineWorkerCode;
    /**
     * 发送Worker消息
     */
    private sendWorkerMessage;
    /**
     * 处理Worker消息
     */
    private handleWorkerMessage;
    /**
     * 处理Worker错误
     */
    private handleWorkerError;
    /**
     * 批量生成多个主题
     */
    batchGenerate(colors: string[]): Promise<GeneratedTheme[]>;
    /**
     * 清除缓存
     */
    clearCache(): void;
    /**
     * 获取性能指标
     */
    getPerformanceMetrics(): PerformanceMetrics;
    /**
     * 重置性能监控
     */
    resetPerformanceMetrics(): void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<ColorGeneratorConfig>): void;
    /**
     * 获取当前配置
     */
    getConfig(): Required<ColorGeneratorConfig>;
    /**
     * 销毁实例
     */
    destroy(): void;
}

/**
 * 颜色生成器配置
 */
export declare interface ColorGeneratorConfig {
    /** 是否启用缓存 */
    enableCache?: boolean;
    /** 缓存大小限制 */
    cacheSize?: number;
    /** 是否使用Web Worker */
    useWebWorker?: boolean;
    /** CSS变量前缀 */
    cssPrefix?: string;
    /** 是否自动注入CSS变量 */
    autoInject?: boolean;
    /** 是否在灰色中混入主色调 */
    grayMixPrimary?: boolean;
    /** 主色调混入比例 (0-1) */
    grayMixRatio?: number;
    /** 语义化颜色名称映射 */
    semanticNames?: {
        primary?: string;
        success?: string;
        warning?: string;
        danger?: string;
        gray?: string;
    };
}

/**
 * 颜色色阶类型
 */
export declare interface ColorPalette {
    /** 主色调12色阶 */
    primary: string[];
    /** 成功色12色阶 */
    success: string[];
    /** 警告色12色阶 */
    warning: string[];
    /** 危险色12色阶 */
    danger: string[];
    /** 灰色14色阶 */
    gray: string[];
}

/**
 * 颜色色阶展示组件
 */
export declare const ColorPaletteComponent: DefineComponent<ExtractPropTypes<    {
/**
* 颜色名称
*/
colorName: {
type: StringConstructor;
required: true;
};
/**
* 颜色色阶数组
*/
colors: {
type: PropType<string[]>;
required: true;
};
/**
* 是否显示颜色值
*/
showValues: {
type: BooleanConstructor;
default: boolean;
};
/**
* 是否可点击复制
*/
copyable: {
type: BooleanConstructor;
default: boolean;
};
}>, () => JSX_2.Element, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, "colorClick"[], "colorClick", PublicProps, Readonly<ExtractPropTypes<    {
/**
* 颜色名称
*/
colorName: {
type: StringConstructor;
required: true;
};
/**
* 颜色色阶数组
*/
colors: {
type: PropType<string[]>;
required: true;
};
/**
* 是否显示颜色值
*/
showValues: {
type: BooleanConstructor;
default: boolean;
};
/**
* 是否可点击复制
*/
copyable: {
type: BooleanConstructor;
default: boolean;
};
}>> & Readonly<{
onColorClick?: ((...args: any[]) => any) | undefined;
}>, {
showValues: boolean;
copyable: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

/**
 * 完整的颜色色阶（包含明暗模式）
 */
export declare interface ColorPalettes {
    /** 明亮模式色阶 */
    light: ColorPalette;
    /** 暗黑模式色阶 */
    dark: ColorPalette;
}

/**
 * 颜色选择器组件
 */
export declare const ColorPicker: DefineComponent<ExtractPropTypes<    {
/**
* 当前颜色值
*/
modelValue: {
type: StringConstructor;
default: string;
};
/**
* 是否禁用
*/
disabled: {
type: BooleanConstructor;
default: boolean;
};
/**
* 预设颜色
*/
presetColors: {
type: PropType<string[]>;
default: () => string[];
};
/**
* 是否显示预设颜色
*/
showPresets: {
type: BooleanConstructor;
default: boolean;
};
}>, () => JSX_2.Element, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("change" | "update:modelValue")[], "change" | "update:modelValue", PublicProps, Readonly<ExtractPropTypes<    {
/**
* 当前颜色值
*/
modelValue: {
type: StringConstructor;
default: string;
};
/**
* 是否禁用
*/
disabled: {
type: BooleanConstructor;
default: boolean;
};
/**
* 预设颜色
*/
presetColors: {
type: PropType<string[]>;
default: () => string[];
};
/**
* 是否显示预设颜色
*/
showPresets: {
type: BooleanConstructor;
default: boolean;
};
}>> & Readonly<{
onChange?: ((...args: any[]) => any) | undefined;
"onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
presetColors: string[];
modelValue: string;
disabled: boolean;
showPresets: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

/**
 * 颜色提供者组件
 * 为子组件提供颜色主题上下文
 */
export declare const ColorProvider: DefineComponent<ExtractPropTypes<    {
/**
* 主色调
*/
primaryColor: {
type: StringConstructor;
required: true;
};
/**
* 颜色生成器配置
*/
config: {
type: PropType<ColorGeneratorConfig>;
default: () => {};
};
/**
* 是否显示加载状态
*/
showLoading: {
type: BooleanConstructor;
default: boolean;
};
/**
* 加载文本
*/
loadingText: {
type: StringConstructor;
default: string;
};
/**
* 错误文本前缀
*/
errorPrefix: {
type: StringConstructor;
default: string;
};
}>, () => JSX_2.Element, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<    {
/**
* 主色调
*/
primaryColor: {
type: StringConstructor;
required: true;
};
/**
* 颜色生成器配置
*/
config: {
type: PropType<ColorGeneratorConfig>;
default: () => {};
};
/**
* 是否显示加载状态
*/
showLoading: {
type: BooleanConstructor;
default: boolean;
};
/**
* 加载文本
*/
loadingText: {
type: StringConstructor;
default: string;
};
/**
* 错误文本前缀
*/
errorPrefix: {
type: StringConstructor;
default: string;
};
}>> & Readonly<{}>, {
config: ColorGeneratorConfig;
showLoading: boolean;
loadingText: string;
errorPrefix: string;
}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

/**
 * 颜色主题注入键
 */
export declare const ColorThemeKey: InjectionKey<{
    theme: GeneratedTheme | null;
    loading: boolean;
    error: string | null;
    generateTheme: () => Promise<void>;
    updateColor: (color: string) => void;
}>;

/**
 * 创建默认的颜色生成器实例
 */
export declare function createColorGenerator(config?: ColorGeneratorConfig): ColorGenerator;

/**
 * 创建预设主题管理器实例
 */
export declare function createPresetThemeManager(): PresetThemeManager;

/**
 * CSS变量生成器
 * 负责将颜色色阶转换为CSS变量并注入到页面中
 */
export declare class CSSVariableGenerator {
    private config;
    private styleElement;
    constructor(config?: ColorGeneratorConfig);
    /**
     * 生成CSS变量字符串
     */
    generateCSSVariables(palettes: ColorPalettes): string;
    /**
     * 生成单个模式的变量
     */
    private generateModeVariables;
    /**
     * 生成语义化变量（指向具体色阶）
     */
    private generateSemanticVariables;
    /**
     * 将CSS变量注入到页面头部
     */
    injectToHead(cssVariables: string, styleId?: string): HTMLStyleElement;
    /**
     * 移除注入的CSS变量
     */
    removeFromHead(): void;
    /**
     * 批量生成多个主题的CSS变量
     */
    batchGenerateCSS(themes: {
        name: string;
        palettes: ColorPalettes;
    }[]): string;
    /**
     * 生成CSS变量的TypeScript类型定义
     */
    generateTypeDefinitions(): string;
    /**
     * 生成SCSS变量文件
     */
    generateSCSSVariables(palettes: ColorPalettes): string;
    /**
     * 生成Less变量文件
     */
    generateLessVariables(palettes: ColorPalettes): string;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<ColorGeneratorConfig>): void;
    /**
     * 获取当前配置
     */
    getConfig(): Required<ColorGeneratorConfig>;
}

/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;

/**
 * 默认预设主题
 */
export declare const DEFAULT_PRESET_THEMES: PresetTheme[];

/**
 * 确保颜色字符串以#开头
 */
export declare function ensureHashPrefix(color: string): string;

/**
 * 格式化颜色输出
 */
export declare function formatColor(color: string, format: ColorFormat): string;

/**
 * 生成的主题数据
 */
export declare interface GeneratedTheme {
    /** 语义化颜色 */
    semanticColors: SemanticColors;
    /** 颜色色阶 */
    palettes: ColorPalettes;
    /** CSS变量字符串 */
    cssVariables: string;
    /** 生成时间戳 */
    timestamp: number;
    /** CSS生成器实例 */
    cssGenerator?: any;
}

/**
 * 生成随机颜色
 */
export declare function generateRandomColor(): string;

/**
 * 快速生成主题的便捷函数
 */
export declare function generateTheme(primaryColor: string, config?: ColorGeneratorConfig): GeneratedTheme;

/**
 * 异步生成主题的便捷函数
 */
export declare function generateThemeAsync(primaryColor: string, config?: ColorGeneratorConfig): Promise<GeneratedTheme>;

/**
 * 生成颜色的类似色
 */
export declare function getAnalogousColors(color: string, count?: number): string[];

/**
 * 生成颜色的补色
 */
export declare function getComplementaryColor(color: string): string;

/**
 * 计算两个颜色的对比度
 */
export declare function getContrast(color1: string, color2: string): number;

/**
 * 获取颜色对比度信息
 */
export declare function getContrastInfo(color1: string, color2: string): ColorContrast;

/**
 * 计算颜色亮度
 */
export declare function getLuminance(color: string): number;

/**
 * 获取颜色的RGB字符串（用于CSS变量）
 */
export declare function getRgbString(color: string): string;

/**
 * 全局缓存管理器实例
 */
export declare const globalCacheManager: MemoryCacheManager;

/**
 * 全局预设主题管理器实例
 */
export declare const globalPresetThemeManager: PresetThemeManager;

/**
 * 将十六进制颜色转换为HSL
 */
export declare function hexToHsl(hex: string): HSLColor;

/**
 * 将十六进制颜色转换为HSV
 */
export declare function hexToHsv(hex: string): HSVColor;

/**
 * 将十六进制颜色转换为RGB
 */
export declare function hexToRgb(hex: string): RGBColor;

/**
 * HSL颜色值类型 [色相, 饱和度, 亮度]
 */
export declare type HSLColor = [number, number, number];

/**
 * 将HSL颜色转换为十六进制
 */
export declare function hslToHex(hsl: HSLColor): string;

/**
 * HSV颜色值类型 [色相, 饱和度, 明度]
 */
export declare type HSVColor = [number, number, number];

/**
 * 将HSV颜色转换为十六进制
 */
export declare function hsvToHex(hsv: HSVColor): string;

/**
 * 库信息
 */
export declare const info: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
};

/**
 * 判断颜色是否为深色
 */
export declare function isDarkColor(color: string): boolean;

/**
 * 验证颜色字符串是否有效
 */
export declare function isValidColor(color: string): boolean;

/**
 * 默认导出 - 包含最常用的功能
 */
declare const ldesignColor: {
    ColorGenerator: typeof ColorGenerator;
    createColorGenerator: typeof createColorGenerator;
    generateTheme: typeof generateTheme;
    generateThemeAsync: typeof generateThemeAsync;
    batchGenerateThemes: typeof batchGenerateThemes;
    presetConfigs: {
        /**
         * 高性能配置 - 启用所有优化
         */
        highPerformance: ColorGeneratorConfig;
        /**
         * 简单配置 - 基础功能
         */
        simple: ColorGeneratorConfig;
        /**
         * 开发配置 - 适合开发环境
         */
        development: ColorGeneratorConfig;
        /**
         * 生产配置 - 适合生产环境
         */
        production: ColorGeneratorConfig;
    };
    presetColors: {
        blue: string;
        lightBlue: string;
        darkBlue: string;
        green: string;
        lightGreen: string;
        darkGreen: string;
        red: string;
        lightRed: string;
        darkRed: string;
        orange: string;
        lightOrange: string;
        darkOrange: string;
        purple: string;
        lightPurple: string;
        darkPurple: string;
        cyan: string;
        lightCyan: string;
        darkCyan: string;
        yellow: string;
        lightYellow: string;
        darkYellow: string;
        pink: string;
        lightPink: string;
        darkPink: string;
        gray: string;
        lightGray: string;
        darkGray: string;
    };
    generateRandomColor: typeof generateRandomColor;
};
export default ldesignColor;

/**
 * LRU (Least Recently Used) 缓存实现
 */
export declare class LRUCache<T = any> {
    private cache;
    private maxSize;
    private ttl;
    constructor(maxSize?: number, ttl?: number);
    /**
     * 获取缓存项
     */
    get(key: string): T | null;
    /**
     * 设置缓存项
     */
    set(key: string, value: T): void;
    /**
     * 删除缓存项
     */
    delete(key: string): boolean;
    /**
     * 检查是否存在
     */
    has(key: string): boolean;
    /**
     * 清空缓存
     */
    clear(): void;
    /**
     * 获取缓存大小
     */
    get size(): number;
    /**
     * 获取缓存统计信息
     */
    getStats(): {
        size: number;
        maxSize: number;
        hitRate: number;
        oldestItem: number;
        newestItem: number;
    };
    /**
     * 清理过期项
     */
    cleanup(): number;
    /**
     * 检查项是否过期
     */
    private isExpired;
    /**
     * 驱逐最少使用的项
     */
    private evictLeastRecentlyUsed;
    /**
     * 获取所有键
     */
    keys(): string[];
    /**
     * 获取所有值
     */
    values(): T[];
    /**
     * 序列化缓存（用于持久化）
     */
    serialize(): string;
    /**
     * 反序列化缓存（用于恢复）
     */
    static deserialize<T>(serialized: string): LRUCache<T>;
}

/**
 * 内存缓存管理器
 */
export declare class MemoryCacheManager {
    private caches;
    private defaultConfig;
    /**
     * 获取或创建缓存实例
     */
    getCache<T>(name: string, config?: {
        maxSize?: number;
        ttl?: number;
    }): LRUCache<T>;
    /**
     * 删除缓存实例
     */
    deleteCache(name: string): boolean;
    /**
     * 清空所有缓存
     */
    clearAll(): void;
    /**
     * 清理所有缓存的过期项
     */
    cleanupAll(): number;
    /**
     * 获取所有缓存的统计信息
     */
    getAllStats(): Record<string, any>;
    /**
     * 获取缓存实例列表
     */
    getCacheNames(): string[];
}

/**
 * 内存使用监控
 */
export declare class MemoryMonitor {
    /**
     * 获取内存使用情况
     */
    static getMemoryUsage(): {
        used: number;
        total: number;
        percentage: number;
    } | null;
    /**
     * 检查是否需要清理内存
     */
    static shouldCleanup(threshold?: number): boolean;
}

/**
 * 混合两个颜色
 */
export declare function mixColors(color1: string, color2: string, ratio?: number): string;

/**
 * 色阶生成器
 * 基于 arco-design/color 库的算法，扩展支持12色阶和14色阶
 */
export declare class PaletteGenerator {
    /**
     * 生成完整的颜色色阶（包含明暗模式）
     */
    generateColorPalettes(semanticColors: SemanticColors, format?: ColorFormat, grayMixPrimary?: boolean, grayMixRatio?: number): ColorPalettes;
    /**
     * 生成明亮模式色阶
     */
    private generateLightPalette;
    /**
     * 生成暗黑模式色阶
     */
    private generateDarkPalette;
    /**
     * 生成12色阶（扩展arco的10色阶算法）
     */
    private generate12ColorPalette;
    /**
     * 生成14色阶灰色（专门为灰色设计更多层次）
     */
    private generate14GrayPalette;
    /**
     * 生成明亮模式单个色阶步骤
     */
    private generateLightColorStep;
    /**
     * 生成暗黑模式单个色阶步骤（重新设计，更简单可靠）
     */
    private generateDarkColorStep;
    /**
     * 生成明亮模式灰色步骤
     */
    private generateLightGrayStep;
    /**
     * 生成暗黑模式灰色步骤
     */
    private generateDarkGrayStep;
    /**
     * 批量生成多个颜色的色阶
     */
    batchGeneratePalettes(colors: string[], isDark?: boolean, format?: ColorFormat): string[][];
    /**
     * 生成自定义步数的色阶
     */
    generateCustomStepPalette(color: string, steps: number, isDark?: boolean, format?: ColorFormat): string[];
    private generateCustomColorStep;
}

/**
 * 色阶生成选项
 */
export declare interface PaletteOptions {
    /** 颜色格式 */
    format?: ColorFormat;
    /** 是否生成暗黑模式 */
    includeDark?: boolean;
    /** 自定义色阶数量 */
    customSteps?: {
        primary?: number;
        success?: number;
        warning?: number;
        danger?: number;
        gray?: number;
    };
}

/**
 * 性能监控数据
 */
export declare interface PerformanceMetrics {
    /** 语义化颜色生成耗时 */
    semanticColorGeneration: number;
    /** 色阶生成耗时 */
    paletteGeneration: number;
    /** CSS变量生成耗时 */
    cssVariableGeneration: number;
    /** 总耗时 */
    totalTime: number;
    /** 缓存命中率 */
    cacheHitRate: number;
}

/**
 * 性能监控类
 */
export declare class PerformanceMonitor {
    private startTimes;
    private metrics;
    private cacheHits;
    private cacheMisses;
    /**
     * 开始计时
     */
    startTimer(name: string): void;
    /**
     * 结束计时并记录
     */
    endTimer(name: string): number;
    /**
     * 记录缓存命中
     */
    recordCacheHit(): void;
    /**
     * 记录缓存未命中
     */
    recordCacheMiss(): void;
    /**
     * 获取性能指标
     */
    getMetrics(): PerformanceMetrics;
    /**
     * 重置指标
     */
    reset(): void;
}

/**
 * 常用的预设颜色
 */
export declare const presetColors: {
    blue: string;
    lightBlue: string;
    darkBlue: string;
    green: string;
    lightGreen: string;
    darkGreen: string;
    red: string;
    lightRed: string;
    darkRed: string;
    orange: string;
    lightOrange: string;
    darkOrange: string;
    purple: string;
    lightPurple: string;
    darkPurple: string;
    cyan: string;
    lightCyan: string;
    darkCyan: string;
    yellow: string;
    lightYellow: string;
    darkYellow: string;
    pink: string;
    lightPink: string;
    darkPink: string;
    gray: string;
    lightGray: string;
    darkGray: string;
};

/**
 * 预设的颜色配置
 */
export declare const presetConfigs: {
    /**
     * 高性能配置 - 启用所有优化
     */
    highPerformance: ColorGeneratorConfig;
    /**
     * 简单配置 - 基础功能
     */
    simple: ColorGeneratorConfig;
    /**
     * 开发配置 - 适合开发环境
     */
    development: ColorGeneratorConfig;
    /**
     * 生产配置 - 适合生产环境
     */
    production: ColorGeneratorConfig;
};

/**
 * 预设主题类型
 */
declare interface PresetTheme {
    /** 主题名称 */
    name: string;
    /** 主题颜色 */
    color: string;
    /** 主题描述 */
    description?: string;
    /** 是否启用 */
    enabled?: boolean;
}

/**
 * 预设主题管理器
 */
export declare class PresetThemeManager {
    private themes;
    /**
     * 获取所有预设主题（响应式）
     */
    getThemes(): Reactive<PresetTheme[]>;
    /**
     * 获取启用的预设主题（响应式）
     */
    getEnabledThemes(): ComputedRef<    {
    name: string;
    color: string;
    description?: string | undefined;
    enabled?: boolean | undefined;
    }[]>;
    /**
     * 添加预设主题
     */
    addTheme(theme: Omit<PresetTheme, 'enabled'>): void;
    /**
     * 移除预设主题
     */
    removeTheme(name: string): boolean;
    /**
     * 启用/禁用预设主题
     */
    toggleTheme(name: string, enabled?: boolean): boolean;
    /**
     * 更新预设主题
     */
    updateTheme(name: string, updates: Partial<PresetTheme>): boolean;
    /**
     * 根据名称查找主题
     */
    findTheme(name: string): PresetTheme | undefined;
    /**
     * 根据颜色查找主题
     */
    findThemeByColor(color: string): PresetTheme | undefined;
    /**
     * 重置为默认主题
     */
    resetToDefault(): void;
    /**
     * 禁用所有默认主题
     */
    disableDefaultThemes(): void;
    /**
     * 启用所有默认主题
     */
    enableDefaultThemes(): void;
    /**
     * 批量添加主题
     */
    addThemes(themes: Omit<PresetTheme, 'enabled'>[]): void;
    /**
     * 导出主题配置
     */
    exportThemes(): PresetTheme[];
    /**
     * 导入主题配置
     */
    importThemes(themes: PresetTheme[], replace?: boolean): void;
    /**
     * 获取主题数量统计
     */
    getStats(): ComputedRef<    {
    total: number;
    enabled: number;
    disabled: number;
    custom: number;
    }>;
}

/**
 * RGB颜色值类型 [红, 绿, 蓝]
 */
export declare type RGBColor = [number, number, number];

/**
 * 将RGB颜色转换为十六进制
 */
export declare function rgbToHex(rgb: RGBColor): string;

/**
 * 使用 requestIdleCallback 进行空闲时间处理
 */
export declare function runInIdleTime<T>(task: () => T, timeout?: number): Promise<T>;

/**
 * 语义化颜色生成配置
 */
declare interface SemanticColorConfig {
    /** 是否在灰色中混入主色调 */
    grayMixPrimary?: boolean;
    /** 主色调混入比例 (0-1) */
    grayMixRatio?: number;
}

/**
 * 语义化颜色生成器
 * 基于 a-nice-red 库的算法，根据主色调生成语义化颜色
 */
export declare class SemanticColorGenerator {
    /**
     * 根据主色调生成所有语义化颜色
     */
    generateSemanticColors(primaryColor: string, config?: SemanticColorConfig): SemanticColors;
    /**
     * 生成成功色（绿色系）
     * 基于主色调的色相调整到绿色范围
     */
    private generateSuccessColor;
    /**
     * 生成警告色（琥珀色/橙色系）
     * 固定在橙色范围内
     */
    private generateWarningColor;
    /**
     * 生成危险色（红色系）
     * 调整到红色范围
     */
    private generateDangerColor;
    /**
     * 生成灰色
     * 基于主色调生成中性灰色
     */
    private generateGrayColor;
    /**
     * 验证生成的语义化颜色是否符合可访问性要求
     */
    validateAccessibility(colors: SemanticColors): {
        [K in keyof SemanticColors]: {
            contrastWithWhite: number;
            contrastWithBlack: number;
            isAccessible: boolean;
        };
    };
    /**
     * 根据品牌色调整语义化颜色的生成策略
     */
    adjustForBrandColor(primaryColor: string, brandType: 'tech' | 'finance' | 'healthcare' | 'education' | 'retail'): SemanticColors;
    private enhanceVibrance;
    private enhanceStability;
    private enhanceSoftness;
    private enhanceFriendliness;
    private enhanceAttractiveness;
}

/**
 * 语义化颜色类型
 */
export declare interface SemanticColors {
    /** 主色调 */
    primary: string;
    /** 成功色 */
    success: string;
    /** 警告色 */
    warning: string;
    /** 危险色 */
    danger: string;
    /** 灰色 */
    gray: string;
}

/**
 * 主题预览组件
 */
export declare const ThemePreview: DefineComponent<    {}, () => JSX_2.Element, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;

/**
 * 批量颜色处理Hook
 */
export declare function useBatchColor(colors: Ref<string[]>): {
    themes: ComputedRef<    {
    semanticColors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    gray: string;
    };
    palettes: {
    light: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    dark: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    };
    cssVariables: string;
    timestamp: number;
    cssGenerator?: any;
    }[]>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    generateThemes: () => Promise<void>;
    colorGenerator: ColorGenerator;
};

/**
 * Vue组合式API - 颜色主题管理
 */
export declare function useColor(primaryColor: Ref<string> | string, config?: ColorGeneratorConfig): {
    theme: ComputedRef<    {
    semanticColors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    gray: string;
    };
    palettes: {
    light: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    dark: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    };
    cssVariables: string;
    timestamp: number;
    cssGenerator?: any;
    } | null>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    isValid: ComputedRef<boolean>;
    generateTheme: () => Promise<void>;
    generateThemeSync: () => void;
    generateThemeDebounced: () => void;
    clearCache: () => void;
    getPerformanceMetrics: () => PerformanceMetrics;
    resetPerformanceMetrics: () => void;
    updateConfig: (newConfig: Partial<ColorGeneratorConfig>) => void;
    injectCSS: () => void;
    removeCSS: () => void;
    colorGenerator: ColorGenerator;
};

/**
 * 颜色分析Hook
 */
export declare function useColorAnalysis(color: Ref<string> | string): {
    analysis: ComputedRef<    {
    color: string;
    isValid: boolean;
    } | null>;
};

/**
 * 使用颜色主题Hook
 */
export declare function useColorTheme(): {
    theme: GeneratedTheme | null;
    loading: boolean;
    error: string | null;
    generateTheme: () => Promise<void>;
    updateColor: (color: string) => void;
};

/**
 * 高性能版本的颜色Hook - 启用所有优化
 */
export declare function useHighPerformanceColor(primaryColor: Ref<string> | string, config?: Partial<ColorGeneratorConfig>): {
    theme: ComputedRef<    {
    semanticColors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    gray: string;
    };
    palettes: {
    light: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    dark: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    };
    cssVariables: string;
    timestamp: number;
    cssGenerator?: any;
    } | null>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    isValid: ComputedRef<boolean>;
    generateTheme: () => Promise<void>;
    generateThemeSync: () => void;
    generateThemeDebounced: () => void;
    clearCache: () => void;
    getPerformanceMetrics: () => PerformanceMetrics;
    resetPerformanceMetrics: () => void;
    updateConfig: (newConfig: Partial<ColorGeneratorConfig>) => void;
    injectCSS: () => void;
    removeCSS: () => void;
    colorGenerator: ColorGenerator;
};

/**
 * 简化版本的颜色Hook - 只关注基本功能
 */
export declare function useSimpleColor(primaryColor: Ref<string> | string): {
    theme: ComputedRef<    {
    semanticColors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    gray: string;
    };
    palettes: {
    light: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    dark: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
    gray: string[];
    };
    };
    cssVariables: string;
    timestamp: number;
    cssGenerator?: any;
    } | null>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<string | null>;
    generateTheme: () => Promise<void>;
};

/**
 * 主题切换Hook
 */
export declare function useThemeSwitch(): {
    currentTheme: ComputedRef<"light" | "dark">;
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
    isDark: ComputedRef<boolean>;
};

/**
 * 工具函数：验证颜色值
 */
export declare function validateColor(color: string): Promise<boolean>;

/**
 * 版本信息
 */
export declare const version = "1.0.0";

/**
 * Web Worker 消息类型
 */
export declare interface WorkerMessage {
    /** 消息ID */
    id: string;
    /** 消息类型 */
    type: 'generatePalettes' | 'generateSemanticColors';
    /** 消息数据 */
    data: any;
}

/**
 * Web Worker 响应类型
 */
export declare interface WorkerResponse {
    /** 消息ID */
    id: string;
    /** 是否成功 */
    success: boolean;
    /** 响应数据 */
    data?: any;
    /** 错误信息 */
    error?: string;
}

export { }


declare global {
    namespace JSX {
        interface Element extends VNode {
        }
        interface IntrinsicElements {
            [elem: string]: any;
        }
    }
}

