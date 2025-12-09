/**
 * @ldesign/color - Advanced Color Utilities
 *
 * Advanced utility functions for color manipulation including:
 * - Color sorting algorithms
 * - Color clustering (K-means)
 * - Nearest color finding
 * - Color distance calculations
 *
 * @module utils/colorUtils
 */

import { oklabToRGB, rgbToOKLAB } from '../core/colorSpaces'
import { Color } from '../core/Color'

// ============================================
// Color Sorting
// ============================================

/**
 * Sorting criteria for colors
 */
export type ColorSortCriteria
  = | 'hue' // Sort by hue angle
  | 'saturation' // Sort by saturation
  | 'lightness' // Sort by lightness
  | 'brightness' // Sort by HSV brightness
  | 'luminance' // Sort by relative luminance
  | 'red' // Sort by red channel
  | 'green' // Sort by green channel
  | 'blue' // Sort by blue channel
  | 'chroma' // Sort by chroma/saturation
  | 'temperature' // Sort by color temperature (warm to cool)

/**
 * Sort colors by specified criteria
 *
 * @param colors - Array of colors to sort
 * @param criteria - Sorting criteria
 * @param descending - Sort in descending order (default: false)
 * @returns Sorted array of colors
 * @performance O(n log n) - Uses optimized sorting
 * @example
 * ```ts
 * const colors = ['#ff0000', '#00ff00', '#0000ff'].map(c => new Color(c));
 * const sorted = sortColors(colors, 'hue');
 * ```
 */
export function sortColors(
  colors: Color[],
  criteria: ColorSortCriteria = 'hue',
  descending = false,
): Color[] {
  const sorted = [...colors]

  const comparator = getComparatorFunction(criteria)
  sorted.sort((a, b) => {
    const result = comparator(a, b)
    return descending ? -result : result
  })

  return sorted
}

/**
 * Get comparator function for sorting criteria
 */
function getComparatorFunction(criteria: ColorSortCriteria): (a: Color, b: Color) => number {
  switch (criteria) {
    case 'hue':
      return (a, b) => a.hue - b.hue

    case 'saturation':
      return (a, b) => a.saturation - b.saturation

    case 'lightness':
      return (a, b) => a.lightness - b.lightness

    case 'brightness':
      return (a, b) => a.brightness - b.brightness

    case 'luminance':
      return (a, b) => a.getLuminance() - b.getLuminance()

    case 'red':
      return (a, b) => a.red - b.red

    case 'green':
      return (a, b) => a.green - b.green

    case 'blue':
      return (a, b) => a.blue - b.blue

    case 'chroma': {
      return (a, b) => {
        const chromaA = Math.max(a.red, a.green, a.blue) - Math.min(a.red, a.green, a.blue)
        const chromaB = Math.max(b.red, b.green, b.blue) - Math.min(b.red, b.green, b.blue)
        return chromaA - chromaB
      }
    }

    case 'temperature': {
      return (a, b) => {
        // Warm colors (red/yellow) have higher values
        const tempA = (a.red - a.blue) / 255
        const tempB = (b.red - b.blue) / 255
        return tempA - tempB
      }
    }

    default:
      return (a, b) => a.hue - b.hue
  }
}

// ============================================
// Nearest Color Finding
// ============================================

/**
 * Distance metric for color comparison
 */
export type DistanceMetric
  = | 'euclidean' // Simple RGB Euclidean distance
  | 'deltaE2000' // CIE Delta E 2000 (perceptually accurate)
  | 'deltaEOKLAB' // OKLAB distance (faster, perceptually good)
  | 'hsl' // HSL color space distance
  | 'hsv' // HSV color space distance

/**
 * Find the nearest color from a palette
 *
 * @param target - Target color to match
 * @param palette - Array of colors to search
 * @param metric - Distance metric to use
 * @returns Nearest color from palette
 * @performance O(n) - Linear search with optimized distance calculation
 * @example
 * ```ts
 * const target = new Color('#3498db');
 * const palette = [
 *   new Color('#e74c3c'),
 *   new Color('#2ecc71'),
 *   new Color('#3498db')
 * ];
 * const nearest = findNearestColor(target, palette, 'deltaEOKLAB');
 * ```
 */
export function findNearestColor(
  target: Color,
  palette: Color[],
  metric: DistanceMetric = 'deltaEOKLAB',
): Color | null {
  if (palette.length === 0)
    return null

  let nearestColor = palette[0]
  let minDistance = getColorDistance(target, palette[0], metric)

  for (let i = 1; i < palette.length; i++) {
    const distance = getColorDistance(target, palette[i], metric)
    if (distance < minDistance) {
      minDistance = distance
      nearestColor = palette[i]
    }
  }

  return nearestColor
}

/**
 * Find N nearest colors from a palette
 *
 * @param target - Target color to match
 * @param palette - Array of colors to search
 * @param count - Number of nearest colors to return
 * @param metric - Distance metric to use
 * @returns Array of nearest colors sorted by distance
 * @performance O(n log n) - Partial sort for top N
 * @example
 * ```ts
 * const target = new Color('#3498db');
 * const nearest = findNearestColors(target, palette, 5, 'deltaEOKLAB');
 * ```
 */
export function findNearestColors(
  target: Color,
  palette: Color[],
  count: number,
  metric: DistanceMetric = 'deltaEOKLAB',
): Color[] {
  if (palette.length === 0 || count <= 0)
    return []

  // Calculate distances for all colors
  const distances = palette.map(color => ({
    color,
    distance: getColorDistance(target, color, metric),
  }))

  // Sort by distance and take top N
  distances.sort((a, b) => a.distance - b.distance)

  return distances.slice(0, count).map(item => item.color)
}

/**
 * Calculate distance between two colors using specified metric
 *
 * @param color1 - First color
 * @param color2 - Second color
 * @param metric - Distance metric to use
 * @returns Distance value (scale depends on metric)
 */
export function getColorDistance(
  color1: Color,
  color2: Color,
  metric: DistanceMetric,
): number {
  switch (metric) {
    case 'euclidean':
      return color1.distance(color2)

    case 'deltaE2000':
      return color1.deltaE2000(color2)

    case 'deltaEOKLAB':
      return color1.deltaEOKLAB(color2)

    case 'hsl': {
      const hsl1 = color1.toHSL()
      const hsl2 = color2.toHSL()
      // Weighted HSL distance
      const dh = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h))
      const ds = Math.abs(hsl1.s - hsl2.s)
      const dl = Math.abs(hsl1.l - hsl2.l)
      return Math.sqrt(dh * dh + ds * ds + dl * dl)
    }

    case 'hsv': {
      const hsv1 = color1.toHSV()
      const hsv2 = color2.toHSV()
      const dh = Math.min(Math.abs(hsv1.h - hsv2.h), 360 - Math.abs(hsv1.h - hsv2.h))
      const ds = Math.abs(hsv1.s - hsv2.s)
      const dv = Math.abs(hsv1.v - hsv2.v)
      return Math.sqrt(dh * dh + ds * ds + dv * dv)
    }

    default:
      return color1.deltaEOKLAB(color2)
  }
}

// ============================================
// Color Clustering
// ============================================

/**
 * Cluster result containing cluster centers and assignments
 */
export interface ClusterResult {
  /** Cluster center colors */
  centers: Color[]
  /** Assignment of each input color to cluster index */
  assignments: number[]
  /** Inertia (sum of squared distances to centers) */
  inertia: number
}

/**
 * K-means clustering of colors
 *
 * Groups colors into K clusters based on perceptual similarity.
 * Uses OKLAB color space for perceptually uniform clustering.
 *
 * @param colors - Array of colors to cluster
 * @param k - Number of clusters
 * @param options - Clustering options
 * @returns Cluster result with centers and assignments
 * @performance O(n * k * iterations) - Typically converges in 10-20 iterations
 * @example
 * ```ts
 * const colors = extractColorsFromImage(image);
 * const result = clusterColors(colors, 5);
 * console.log(result.centers); // 5 dominant colors
 * ```
 */
export function clusterColors(
  colors: Color[],
  k: number,
  options: {
    maxIterations?: number
    metric?: DistanceMetric
    randomSeed?: number
  } = {},
): ClusterResult {
  const {
    maxIterations = 20,
    metric = 'deltaEOKLAB',
  } = options

  if (colors.length === 0 || k <= 0) {
    return { centers: [], assignments: [], inertia: 0 }
  }

  if (k >= colors.length) {
    return {
      centers: [...colors],
      assignments: colors.map((_, i) => i),
      inertia: 0,
    }
  }

  // Initialize centers using k-means++ for better convergence
  const centers = initializeCentersKMeansPlusPlus(colors, k, metric)
  const assignments: number[] = Array.from({ length: colors.length }, () => 0)

  // Iterate until convergence or max iterations
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false

    // Assignment step: assign each color to nearest center
    for (let i = 0; i < colors.length; i++) {
      let minDist = Infinity
      let bestCluster = 0

      for (let j = 0; j < k; j++) {
        const dist = getColorDistance(colors[i], centers[j], metric)
        if (dist < minDist) {
          minDist = dist
          bestCluster = j
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster
        changed = true
      }
    }

    // If no assignments changed, we've converged
    if (!changed)
      break

    // Update step: recalculate cluster centers
    updateCenters(colors, centers, assignments, k)
  }

  // Calculate inertia (total squared distance to centers)
  let inertia = 0
  for (let i = 0; i < colors.length; i++) {
    const dist = getColorDistance(colors[i], centers[assignments[i]], metric)
    inertia += dist * dist
  }

  return { centers, assignments, inertia }
}

/**
 * Initialize cluster centers using k-means++ algorithm
 * Provides better initial centers for faster convergence
 */
function initializeCentersKMeansPlusPlus(
  colors: Color[],
  k: number,
  metric: DistanceMetric,
): Color[] {
  const centers: Color[] = []

  // Choose first center randomly
  centers.push(colors[Math.floor(Math.random() * colors.length)].clone())

  // Choose remaining centers with probability proportional to distance squared
  for (let i = 1; i < k; i++) {
    const distances = colors.map((color) => {
      let minDist = Infinity
      for (const center of centers) {
        const dist = getColorDistance(color, center, metric)
        minDist = Math.min(minDist, dist)
      }
      return minDist * minDist // Square the distance
    })

    const totalDist = distances.reduce((sum, d) => sum + d, 0)
    let random = Math.random() * totalDist

    for (let j = 0; j < distances.length; j++) {
      random -= distances[j]
      if (random <= 0) {
        centers.push(colors[j].clone())
        break
      }
    }
  }

  return centers
}

/**
 * Update cluster centers based on assigned colors
 */
function updateCenters(
  colors: Color[],
  centers: Color[],
  assignments: number[],
  k: number,
): void {
  // Calculate mean color for each cluster in OKLAB space
  const clusterSums = Array.from({ length: k }, () => ({ l: 0, a: 0, b: 0, count: 0 }))

  for (let i = 0; i < colors.length; i++) {
    const cluster = assignments[i]
    const oklab = rgbToOKLAB(colors[i].toRGB())

    clusterSums[cluster].l += oklab.l
    clusterSums[cluster].a += oklab.a
    clusterSums[cluster].b += oklab.b
    clusterSums[cluster].count++
  }

  // Update centers
  for (let i = 0; i < k; i++) {
    if (clusterSums[i].count > 0) {
      const count = clusterSums[i].count
      const meanOKLAB = {
        l: clusterSums[i].l / count,
        a: clusterSums[i].a / count,
        b: clusterSums[i].b / count,
      }

      const rgb = oklabToRGB(meanOKLAB)
      centers[i] = Color.fromRGB(rgb.r, rgb.g, rgb.b)
    }
  }
}

/**
 * Find optimal number of clusters using elbow method
 *
 * @param colors - Array of colors
 * @param maxK - Maximum number of clusters to test
 * @returns Recommended number of clusters
 * @performance O(n * maxK² * iterations)
 * @example
 * ```ts
 * const colors = extractColorsFromImage(image);
 * const optimalK = findOptimalClusters(colors, 10);
 * const clusters = clusterColors(colors, optimalK);
 * ```
 */
export function findOptimalClusters(
  colors: Color[],
  maxK = 10,
): number {
  if (colors.length <= 1)
    return 1

  const inertias: number[] = []

  // Test clustering for k = 1 to maxK
  for (let k = 1; k <= Math.min(maxK, colors.length); k++) {
    const result = clusterColors(colors, k)
    inertias.push(result.inertia)
  }

  // Find elbow point (maximum rate of change decrease)
  let elbowK = 1
  let maxDelta = 0

  for (let k = 1; k < inertias.length - 1; k++) {
    const delta1 = inertias[k - 1] - inertias[k]
    const delta2 = inertias[k] - inertias[k + 1]
    const deltaDelta = delta1 - delta2

    if (deltaDelta > maxDelta) {
      maxDelta = deltaDelta
      elbowK = k + 1
    }
  }

  return elbowK
}

// ============================================
// Color Quantization
// ============================================

/**
 * Reduce the number of colors in a palette using quantization
 *
 * @param colors - Input colors
 * @param targetCount - Target number of colors
 * @param method - Quantization method ('kmeans' or 'median-cut')
 * @returns Quantized color palette
 * @example
 * ```ts
 * const colors = extractColorsFromImage(image);
 * const palette = quantizeColors(colors, 16, 'kmeans');
 * ```
 */
export function quantizeColors(
  colors: Color[],
  targetCount: number,
  method: 'kmeans' | 'median-cut' = 'kmeans',
): Color[] {
  if (method === 'kmeans') {
    const result = clusterColors(colors, targetCount)
    return result.centers
  }
  else {
    // Median cut algorithm
    return medianCutQuantization(colors, targetCount)
  }
}

/**
 * Median cut quantization algorithm
 *
 * Recursively splits color space along the dimension with greatest range.
 */
function medianCutQuantization(colors: Color[], targetCount: number): Color[] {
  if (colors.length === 0 || targetCount <= 0)
    return []
  if (colors.length <= targetCount)
    return colors

  const buckets: Color[][] = [colors]

  while (buckets.length < targetCount) {
    // Find bucket with largest range
    let maxRange = -1
    let maxBucketIndex = 0
    let maxDimension: 'r' | 'g' | 'b' = 'r'

    for (let i = 0; i < buckets.length; i++) {
      const { range, dimension } = getBucketRange(buckets[i])
      if (range > maxRange) {
        maxRange = range
        maxBucketIndex = i
        maxDimension = dimension
      }
    }

    // Split the bucket
    const bucket = buckets[maxBucketIndex]
    const [bucket1, bucket2] = splitBucket(bucket, maxDimension)

    buckets.splice(maxBucketIndex, 1, bucket1, bucket2)

    if (bucket1.length === 0 || bucket2.length === 0) {
      break // Can't split further
    }
  }

  // Calculate average color for each bucket
  return buckets.map(bucket => getAverageColor(bucket))
}

/**
 * Get the range and dimension with largest range for a bucket
 */
function getBucketRange(bucket: Color[]): { range: number, dimension: 'r' | 'g' | 'b' } {
  if (bucket.length === 0)
    return { range: 0, dimension: 'r' }

  let minR = 255; let maxR = 0
  let minG = 255; let maxG = 0
  let minB = 255; let maxB = 0

  for (const color of bucket) {
    minR = Math.min(minR, color.red)
    maxR = Math.max(maxR, color.red)
    minG = Math.min(minG, color.green)
    maxG = Math.max(maxG, color.green)
    minB = Math.min(minB, color.blue)
    maxB = Math.max(maxB, color.blue)
  }

  const rangeR = maxR - minR
  const rangeG = maxG - minG
  const rangeB = maxB - minB

  if (rangeR >= rangeG && rangeR >= rangeB) {
    return { range: rangeR, dimension: 'r' }
  }
  else if (rangeG >= rangeB) {
    return { range: rangeG, dimension: 'g' }
  }
  else {
    return { range: rangeB, dimension: 'b' }
  }
}

/**
 * Split bucket along specified dimension at median
 */
function splitBucket(bucket: Color[], dimension: 'r' | 'g' | 'b'): [Color[], Color[]] {
  // Sort by dimension
  const sorted = [...bucket].sort((a, b) => {
    switch (dimension) {
      case 'r': return a.red - b.red
      case 'g': return a.green - b.green
      case 'b': return a.blue - b.blue
      default: return 0
    }
  })

  const mid = Math.floor(sorted.length / 2)
  return [sorted.slice(0, mid), sorted.slice(mid)]
}

/**
 * Get average color of a bucket in OKLAB space
 */
function getAverageColor(bucket: Color[]): Color {
  if (bucket.length === 0)
    return new Color()

  let sumL = 0; let sumA = 0; let sumB = 0

  for (const color of bucket) {
    const oklab = rgbToOKLAB(color.toRGB())
    sumL += oklab.l
    sumA += oklab.a
    sumB += oklab.b
  }

  const count = bucket.length
  const avgOKLAB = {
    l: sumL / count,
    a: sumA / count,
    b: sumB / count,
  }

  const rgb = oklabToRGB(avgOKLAB)
  return Color.fromRGB(rgb.r, rgb.g, rgb.b)
}

// ============================================
// Color Filtering
// ============================================

/**
 * Filter colors by criteria
 *
 * @param colors - Input colors
 * @param criteria - Filter criteria
 * @returns Filtered colors
 * @example
 * ```ts
 * const vibrant = filterColors(colors, {
 *   minSaturation: 50,
 *   minLightness: 30,
 *   maxLightness: 70
 * });
 * ```
 */
export function filterColors(
  colors: Color[],
  criteria: {
    minHue?: number
    maxHue?: number
    minSaturation?: number
    maxSaturation?: number
    minLightness?: number
    maxLightness?: number
    minLuminance?: number
    maxLuminance?: number
  },
): Color[] {
  return colors.filter((color) => {
    const hsl = color.toHSL()
    const luminance = color.getLuminance()

    if (criteria.minHue !== undefined && hsl.h < criteria.minHue)
      return false
    if (criteria.maxHue !== undefined && hsl.h > criteria.maxHue)
      return false
    if (criteria.minSaturation !== undefined && hsl.s < criteria.minSaturation)
      return false
    if (criteria.maxSaturation !== undefined && hsl.s > criteria.maxSaturation)
      return false
    if (criteria.minLightness !== undefined && hsl.l < criteria.minLightness)
      return false
    if (criteria.maxLightness !== undefined && hsl.l > criteria.maxLightness)
      return false
    if (criteria.minLuminance !== undefined && luminance < criteria.minLuminance)
      return false
    if (criteria.maxLuminance !== undefined && luminance > criteria.maxLuminance)
      return false

    return true
  })
}

// ============================================
// Color Deduplication
// ============================================

/**
 * Remove duplicate or very similar colors from array
 *
 * @param colors - Input colors
 * @param threshold - Similarity threshold (lower = more strict)
 * @param metric - Distance metric to use
 * @returns Deduplicated colors
 * @performance O(n²) - Can be slow for large arrays
 * @example
 * ```ts
 * const unique = deduplicateColors(colors, 2, 'deltaEOKLAB');
 * ```
 */
export function deduplicateColors(
  colors: Color[],
  threshold = 2,
  metric: DistanceMetric = 'deltaEOKLAB',
): Color[] {
  if (colors.length === 0)
    return []

  const unique: Color[] = [colors[0]]

  for (let i = 1; i < colors.length; i++) {
    let isDuplicate = false

    for (const uniqueColor of unique) {
      const distance = getColorDistance(colors[i], uniqueColor, metric)
      if (distance < threshold) {
        isDuplicate = true
        break
      }
    }

    if (!isDuplicate) {
      unique.push(colors[i])
    }
  }

  return unique
}

// ============================================
// Color Statistics
// ============================================

/**
 * Calculate color distribution statistics
 *
 * @param colors - Input colors
 * @returns Distribution statistics
 * @example
 * ```ts
 * const stats = getColorStatistics(palette);
 * console.log(stats.averageLuminance);
 * ```
 */
export function getColorStatistics(colors: Color[]): {
  count: number
  averageHue: number
  averageSaturation: number
  averageLightness: number
  averageLuminance: number
  hueDiversity: number
  saturationRange: [number, number]
  lightnessRange: [number, number]
} {
  if (colors.length === 0) {
    return {
      count: 0,
      averageHue: 0,
      averageSaturation: 0,
      averageLightness: 0,
      averageLuminance: 0,
      hueDiversity: 0,
      saturationRange: [0, 0],
      lightnessRange: [0, 0],
    }
  }

  let sumHue = 0; let sumSat = 0; let sumLight = 0; let sumLum = 0
  let minSat = 100; let maxSat = 0
  let minLight = 100; let maxLight = 0
  const hues: number[] = []

  for (const color of colors) {
    const hsl = color.toHSL()
    const lum = color.getLuminance()

    sumHue += hsl.h
    sumSat += hsl.s
    sumLight += hsl.l
    sumLum += lum

    hues.push(hsl.h)

    minSat = Math.min(minSat, hsl.s)
    maxSat = Math.max(maxSat, hsl.s)
    minLight = Math.min(minLight, hsl.l)
    maxLight = Math.max(maxLight, hsl.l)
  }

  const count = colors.length

  // Calculate hue diversity (standard deviation)
  const avgHue = sumHue / count
  const hueVariance = hues.reduce((sum, h) => {
    const diff = Math.min(Math.abs(h - avgHue), 360 - Math.abs(h - avgHue))
    return sum + diff * diff
  }, 0) / count

  return {
    count,
    averageHue: avgHue,
    averageSaturation: sumSat / count,
    averageLightness: sumLight / count,
    averageLuminance: sumLum / count,
    hueDiversity: Math.sqrt(hueVariance),
    saturationRange: [minSat, maxSat],
    lightnessRange: [minLight, maxLight],
  }
}

// ============================================
// Color Palette Extraction
// ============================================

/**
 * Extract dominant colors from a color array
 *
 * Uses clustering to find the most representative colors.
 *
 * @param colors - Input colors
 * @param count - Number of colors to extract
 * @param options - Extraction options
 * @returns Array of dominant colors
 * @example
 * ```ts
 * const dominant = extractDominantColors(imageColors, 5);
 * ```
 */
export function extractDominantColors(
  colors: Color[],
  count: number,
  options: {
    deduplicate?: boolean
    deduplicationThreshold?: number
    sortBy?: ColorSortCriteria
  } = {},
): Color[] {
  let processedColors = colors

  // Deduplicate if requested
  if (options.deduplicate) {
    processedColors = deduplicateColors(
      processedColors,
      options.deduplicationThreshold ?? 2,
    )
  }

  // Cluster colors
  const result = clusterColors(processedColors, Math.min(count, processedColors.length))

  // Sort if requested
  if (options.sortBy) {
    return sortColors(result.centers, options.sortBy)
  }

  return result.centers
}

// ============================================
// Color Palette Validation
// ============================================

/**
 * Check if color palette has good diversity
 *
 * @param colors - Colors to check
 * @returns True if palette has good diversity
 * @example
 * ```ts
 * const isGood = hasGoodDiversity(palette);
 * ```
 */
export function hasGoodDiversity(colors: Color[]): boolean {
  if (colors.length < 2)
    return false

  const stats = getColorStatistics(colors)

  // Check for diversity in hue, saturation, and lightness
  const hasSaturationRange = (stats.saturationRange[1] - stats.saturationRange[0]) > 30
  const hasLightnessRange = (stats.lightnessRange[1] - stats.lightnessRange[0]) > 30
  const hasHueDiversity = stats.hueDiversity > 20

  // At least 2 of 3 criteria should be met
  const criteriaMet = [hasSaturationRange, hasLightnessRange, hasHueDiversity].filter(Boolean).length

  return criteriaMet >= 2
}

/**
 * Find colors that don't meet WCAG contrast requirements with any background
 *
 * @param colors - Colors to check
 * @param backgrounds - Background colors to test against
 * @param level - WCAG level
 * @returns Colors that fail contrast requirements
 */
export function findLowContrastColors(
  colors: Color[],
  backgrounds: Color[],
  level: 'AA' | 'AAA' = 'AA',
): Color[] {
  return colors.filter((color) => {
    return !backgrounds.some(bg => color.isWCAGCompliant(bg, level))
  })
}
