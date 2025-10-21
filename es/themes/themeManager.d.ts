/**
 * 主题管理�?- 处理主题的应用、存储和恢复
 */
import type { PresetTheme } from './presets';
export interface ThemeOptions {
    prefix?: string;
    storageKey?: string;
    autoApply?: boolean;
    includeSemantics?: boolean;
    includeGrays?: boolean;
    nameMap?: Record<string, string>;
}
export interface ThemeState {
    primaryColor: string;
    themeName?: string;
    isDark?: boolean;
    prefix?: string;
    createdAt?: number;
    updatedAt?: number;
    customColors?: Record<string, string>;
    parent?: string;
    version?: string;
    author?: string;
    description?: string;
}
export declare class ThemeManager {
    private storageKey;
    private prefix;
    private currentTheme;
    private listeners;
    private systemThemeMediaQuery?;
    private systemThemeHandler?;
    private themeHistory;
    private maxHistorySize;
    private themeRegistry;
    private aiIntegration?;
    private destroyed;
    private themeCache;
    constructor(options?: ThemeOptions);
    /**
     * 应用主题
     */
    applyTheme(colorOrName: string, options?: ThemeOptions): ThemeState;
    /**
     * 应用预设主题
     */
    applyPresetTheme(name: string, options?: ThemeOptions): ThemeState;
    /**
     * 获取当前主题
     */
    getCurrentTheme(): ThemeState | null;
    /**
     * 导出主题配置
     */
    exportTheme(): string;
    /**
     * 导入主题配置
     */
    importTheme(themeData: string | ThemeState): ThemeState;
    /**
     * 检测系统主题偏�?
     */
    detectSystemTheme(): 'light' | 'dark';
    /**
     * 监听系统主题变化 - 修复内存泄漏
     */
    watchSystemTheme(callback: (mode: 'light' | 'dark') => void): () => void;
    /**
     * 清理系统主题监听器
     */
    private cleanupSystemThemeWatcher;
    /**
     * 下载主题配置文件 - 修复内存泄漏
     */
    downloadTheme(filename?: string): void;
    /**
     * 保存主题到本地存�?
     */
    private save;
    /**
     * 从本地存储恢复主�?
     */
    restore(): ThemeState | null;
    /**
     * 清除存储的主�?
     */
    clear(): void;
    /**
     * 添加主题变化监听�?
     */
    onChange(listener: (theme: ThemeState) => void): () => void;
    /**
     * 通知所有监听器
     */
    private notifyListeners;
    /**
     * 获取所有预设主�?
     */
    getPresets(): PresetTheme[];
    /**
     * 主题继承 - 创建基于父主题的新主�?
     */
    createChildTheme(parentName: string, childName: string, overrides: Partial<ThemeState>): ThemeState;
    /**
     * 获取主题 - 优化内存使用，使用缓存
     */
    getTheme(name: string): ThemeState | undefined;
    /**
     * 注册主题 - 优化内存使用
     */
    registerTheme(name: string, theme: ThemeState): void;
    /**
     * 保存主题注册�?
     */
    private saveThemeRegistry;
    /**
     * 加载主题注册�?
     */
    private loadThemeRegistry;
    /**
     * 版本管理 - 更新主题版本
     */
    updateThemeVersion(themeName: string, version: string): void;
    /**
     * 主题历史管理 - 优化内存使用
     */
    addToHistory(theme: ThemeState): void;
    /**
     * 获取主题历史
     */
    getThemeHistory(): ThemeState[];
    /**
     * 回滚到历史主�?
     */
    rollbackTheme(steps?: number): ThemeState | null;
    /**
     * 集成AI配色建议 - 延迟加载，节省内存
     */
    enableAIIntegration(apiKey?: string): Promise<void>;
    /**
     * 获取AI配色建议
     */
    getAISuggestions(context?: any): Promise<any>;
    /**
     * 基于AI建议应用主题
     */
    applyAISuggestedTheme(context?: any, index?: number): Promise<ThemeState | null>;
    /**
     * 比较两个主题
     */
    compareThemes(theme1Name: string, theme2Name: string): {
        differences: string[];
        similarity: number;
    };
    /**
     * 批量导出主题
     */
    exportAllThemes(): string;
    /**
     * 批量导入主题 - 优化内存使用
     */
    importAllThemes(data: string): void;
    /**
     * 销毁主题管理器，清理所有资源
     */
    destroy(): void;
}
export declare const defaultThemeManager: ThemeManager;
/**
 * 快捷方法：应用主�?
 */
export declare function applyTheme(colorOrName: string, options?: ThemeOptions): ThemeState;
/**
 * 快捷方法：应用预设主�?
 */
export declare function applyPresetTheme(name: string, options?: ThemeOptions): ThemeState;
/**
 * 快捷方法：恢复主�?
 */
export declare function restoreTheme(): ThemeState | null;
/**
 * 快捷方法：获取当前主�?
 */
export declare function getCurrentTheme(): ThemeState | null;
