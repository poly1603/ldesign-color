/**
 * @ldesign/color - Performance Monitor
 *
 * 运行时性能监控工具
 */
interface PerformanceMetric {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    count: number;
}
/**
 * 简单的性能监控器
 * 用于开发和调试时监控性能
 */
declare class PerformanceMonitor {
    private metrics;
    private enabled;
    /**
     * 启用性能监控
     */
    enable(): void;
    /**
     * 禁用性能监控
     */
    disable(): void;
    /**
     * 开始测量
     */
    start(name: string): void;
    /**
     * 结束测量
     */
    end(name: string): number | undefined;
    /**
     * 测量函数执行
     */
    measure<T>(name: string, fn: () => T): T;
    /**
     * 异步测量
     */
    measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>;
    /**
     * 获取指标
     */
    getMetric(name: string): PerformanceMetric | undefined;
    /**
     * 获取所有指标
     */
    getAllMetrics(): PerformanceMetric[];
    /**
     * 获取统计信息
     */
    getStats(name: string): {
        count: number;
        avgDuration: number;
        lastDuration: number;
    } | undefined;
    /**
     * 打印报告
     */
    report(): void;
    /**
     * 清除所有指标
     */
    clear(): void;
    /**
     * 重置指定指标
     */
    reset(name: string): void;
}
/**
 * 全局性能监控实例
 */
export declare const performanceMonitor: PerformanceMonitor;
/**
 * 性能装饰器（用于类方法）
 */
export declare function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
/**
 * 简单的性能测量函数
 */
export declare function measure<T>(name: string, fn: () => T): T;
/**
 * 异步性能测量函数
 */
export declare function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>;
export { PerformanceMonitor };
