/**
 * @ldesign/color - Optimized Cache Utilities
 *
 * High-performance LRU cache with minimal memory overhead
 */
/**
 * Optimized LRU Cache using Map's built-in ordering
 * Reduces memory overhead by leveraging native Map iteration order
 */
export declare class ColorCache<T = any> {
    private cache;
    private maxSize;
    constructor(maxSize?: number);
    /**
     * Get a value from the cache - Optimized O(1)
     */
    get(key: string): T | undefined;
    /**
     * Set a value in the cache - Optimized memory usage
     */
    set(key: string, value: T): void;
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
     * Get cache statistics - Minimal memory footprint
     */
    getStats(): {
        size: number;
        maxSize: number;
        utilization: number;
    };
}
/**
 * Global cache instance for shared caching - reduced size to save memory
 */
export declare const globalColorCache: ColorCache<any>;
export declare function memoize<T extends (...args: any[]) => any>(fn: T, getKey?: (...args: Parameters<T>) => string, maxSize?: number): T;
/**
 * Create a cache key from multiple values
 */
export declare function createCacheKey(...values: any[]): string;
