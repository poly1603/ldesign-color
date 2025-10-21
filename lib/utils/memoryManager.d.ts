/**
 * @ldesign/color - Memory Management Utilities
 *
 * Central memory management for preventing memory leaks and optimizing usage
 */
/**
 * Memory usage statistics
 */
export interface MemoryStats {
    colorPoolSize: number;
    colorCacheSize: number;
    advancedCacheSize: number;
    totalCacheItems: number;
    estimatedMemoryMB: number;
}
/**
 * Memory manager for color library
 */
export declare class MemoryManager {
    private static instance;
    private cleanupInterval;
    private readonly CLEANUP_INTERVAL;
    private readonly MAX_MEMORY_MB;
    private memoryCheckTimer;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): MemoryManager;
    /**
     * Handle page visibility changes
     */
    private handleVisibilityChange;
    /**
     * Start automatic cleanup interval
     */
    private startAutoCleanup;
    /**
     * Stop automatic cleanup interval
     */
    private stopAutoCleanup;
    /**
     * Perform automatic cleanup
     */
    private performAutoCleanup;
    /**
     * Get current memory statistics
     */
    getMemoryStats(): MemoryStats;
    /**
     * Reduce memory usage when page is hidden
     */
    reduceMemoryUsage(): void;
    /**
     * Perform moderate cleanup
     */
    moderateCleanup(): void;
    /**
     * Perform aggressive cleanup
     */
    aggressiveCleanup(): void;
    /**
     * Manual cleanup - call this to free memory
     */
    cleanup(): void;
    /**
     * Reset all caches and pools
     */
    reset(): void;
    /**
     * Set maximum memory limit
     */
    setMemoryLimit(limitMB: number): void;
    /**
     * Enable/disable auto cleanup
     */
    setAutoCleanup(enabled: boolean): void;
    /**
     * Perform garbage collection hint (if available)
     */
    requestGarbageCollection(): void;
}
export declare const memoryManager: MemoryManager;
export declare function cleanupMemory(): void;
export declare function resetMemory(): void;
export declare function getMemoryStats(): MemoryStats;
export declare function setMemoryLimit(limitMB: number): void;
export declare function setAutoCleanup(enabled: boolean): void;
