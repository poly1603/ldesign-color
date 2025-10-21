/**
 * @ldesign/color - Math Utilities
 *
 * Mathematical utility functions for color calculations
 */
/**
 * Clamp a value between min and max
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Round a number to specified decimal places
 */
export declare function round(value: number, decimals?: number): number;
/**
 * Convert degrees to radians
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * Convert radians to degrees
 */
export declare function radiansToDegrees(radians: number): number;
/**
 * Linear interpolation between two values
 */
export declare function lerp(start: number, end: number, t: number): number;
/**
 * Modulo operation that handles negative numbers correctly
 */
export declare function mod(n: number, m: number): number;
/**
 * Check if two numbers are approximately equal
 */
export declare function approximatelyEqual(a: number, b: number, epsilon?: number): boolean;
/**
 * Calculate the euclidean distance between two points
 */
export declare function euclideanDistance(x1: number, y1: number, x2: number, y2: number): number;
/**
 * Calculate the distance between two 3D points
 */
export declare function distance3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number;
/**
 * Map a value from one range to another
 */
export declare function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
/**
 * Calculate the average of an array of numbers
 */
export declare function average(numbers: number[]): number;
/**
 * Calculate the weighted average of an array of numbers
 */
export declare function weightedAverage(values: number[], weights: number[]): number;
/**
 * Generate a random number between min and max
 */
export declare function randomRange(min: number, max: number): number;
/**
 * Generate a random integer between min and max (inclusive)
 */
export declare function randomInt(min: number, max: number): number;
/**
 * Normalize a value between 0 and 1
 */
export declare function normalize(value: number, min: number, max: number): number;
/**
 * Calculate the standard deviation of an array of numbers
 */
export declare function standardDeviation(numbers: number[]): number;
/**
 * Calculate the factorial of a number
 */
export declare function factorial(n: number): number;
/**
 * Calculate the greatest common divisor of two numbers
 */
export declare function gcd(a: number, b: number): number;
/**
 * Calculate the least common multiple of two numbers
 */
export declare function lcm(a: number, b: number): number;
