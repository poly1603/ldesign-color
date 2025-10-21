/**
 * @ldesign/color - Advanced Cache Utilities
 *
 * Advanced caching with LRU/LFU strategies, persistence and prewarming
 */
/**
 * 缓存策略类型
 */
export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO';
/**
 * 缓存统计信息
 */
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    maxSize: number;
    utilization: number;
}
/**
 * Advanced Cache implementation with multiple strategies
 */
export declare class AdvancedColorCache<T = any> {
    private cache;
    private maxSize;
    private strategy;
    private stats;
    private persistKey?;
    private persistTimer;
    private isDirty;
    private persistDelay;
    constructor(maxSize?: number, strategy?: CacheStrategy, persistKey?: string);
    /**
     * Get a value from the cache
     */
    get(key: string): T | undefined;
    /**
     * Set a value in the cache
     */
    set(key: string, value: T): void;
    /**
     * 延迟持久化（防抖）
     */
    private schedulePersist;
    /**
     * 根据策略移除缓存项
     */
    private evict;
    /**
     * Check if a key exists in the cache
     */
    has(key: string): boolean;
    /**
     * Delete a key from the cache
     */
    delete(key: string): boolean;
    /**
     * Clear the entire cache
     */
    clear(): void;
    /**
     * Get the current size of the cache
     */
    get size(): number;
    /**
     * Get cache statistics
     */
    getStats(): CacheStats;
    /**
     * 缓存预热
     */
    prewarm(data: Array<{
        key: string;
        value: T;
    }>): void;
    /**
     * 持久化缓存到localStorage
     */
    persist(): void;
    /**
     * 从localStorage恢复缓存
     */
    restore(): void;
    /**
     * 获取最常用的缓存项
     */
    getMostFrequent(count?: number): Array<{
        key: string;
        value: T;
        frequency: number;
    }>;
    /**
     * 优化缓存大小
     */
    optimize(): void;
    /**
     * 设置缓存策略
     */
    setStrategy(strategy: CacheStrategy): void;
    /**
     * 获取缓存快照
     */
    snapshot(): Array<{
        key: string;
        value: T;
    }>;
    /**
     * 清理所有资源，防止内存泄漏
     */
    destroy(): void;
}
/**
 * Global cache instance with LFU strategy for shared caching
 * 减少全局缓存大小，避免内存占用过高
 */
export declare const globalColorCache: AdvancedColorCache<any>;
export declare function memoize<T extends (...args: any[]) => any>(fn: T, options?: {
    maxSize?: number;
    strategy?: CacheStrategy;
    getKey?: (...args: Parameters<T>) => string;
}): T;
/**
 * Create a cache key from multiple values
 */
export declare function createCacheKey(...values: any[]): string;
