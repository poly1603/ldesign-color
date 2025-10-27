/**
 * @ldesign/color - Constants
 *
 * Centralized constants for the color library.
 * All magic numbers, strings, and configuration values are defined here
 * for easy maintenance and consistency.
 *
 * @module constants
 */

// ============================================
// Mathematical Constants
// ============================================

/**
 * Reciprocal of 255 for RGB normalization (1/255)
 * Used in RGB to [0,1] conversions
 */
export const INV_255 = 1 / 255

/**
 * Reciprocal of 360 for hue normalization (1/360)
 * Used in hue angle to [0,1] conversions
 */
export const INV_360 = 1 / 360

/**
 * Reciprocal of 100 for percentage normalization (1/100 = 0.01)
 * Used in percentage to decimal conversions
 */
export const INV_100 = 0.01

/**
 * One third (1/3 = 0.333...)
 * Used in HSL/HSV hue calculations
 */
export const ONE_THIRD = 1 / 3

/**
 * Two thirds (2/3 = 0.666...)
 * Used in HSL/HSV hue calculations
 */
export const TWO_THIRDS = 2 / 3

/**
 * One sixth (1/6 = 0.166...)
 * Used in HSL hue-to-RGB calculations
 */
export const ONE_SIXTH = 1 / 6

/**
 * Degrees to radians conversion factor (π/180)
 */
export const DEG_TO_RAD = Math.PI / 180

/**
 * Radians to degrees conversion factor (180/π)
 */
export const RAD_TO_DEG = 180 / Math.PI

// ============================================
// Color Space Constants
// ============================================

/**
 * sRGB to Linear RGB conversion threshold
 */
export const SRGB_TO_LINEAR_THRESHOLD = 0.04045

/**
 * sRGB to Linear RGB conversion factor (1/12.92)
 */
export const SRGB_TO_LINEAR_FACTOR = 1 / 12.92

/**
 * sRGB to Linear RGB offset
 */
export const SRGB_TO_LINEAR_OFFSET = 0.055

/**
 * sRGB to Linear RGB gamma value
 */
export const SRGB_TO_LINEAR_GAMMA = 2.4

/**
 * Linear RGB to sRGB conversion threshold
 */
export const LINEAR_TO_SRGB_THRESHOLD = 0.0031308

/**
 * Linear RGB to sRGB slope
 */
export const LINEAR_TO_SRGB_SLOPE = 12.92

/**
 * Linear RGB to sRGB factor
 */
export const LINEAR_TO_SRGB_A = 1.055

/**
 * Linear RGB to sRGB gamma (1/2.4)
 */
export const LINEAR_TO_SRGB_GAMMA = 1 / 2.4

/**
 * D65 white point X coordinate
 */
export const D65_X = 95.047

/**
 * D65 white point Y coordinate
 */
export const D65_Y = 100.0

/**
 * D65 white point Z coordinate
 */
export const D65_Z = 108.883

/**
 * LAB epsilon constant (216/24389)
 */
export const LAB_EPSILON = 216 / 24389

/**
 * LAB kappa constant (24389/27)
 */
export const LAB_KAPPA = 24389 / 27

/**
 * LAB delta constant (6/29)
 */
export const LAB_DELTA = 6 / 29

// ============================================
// WCAG Constants
// ============================================

/**
 * WCAG AA normal text minimum contrast ratio
 */
export const WCAG_AA_NORMAL = 4.5

/**
 * WCAG AA large text minimum contrast ratio
 */
export const WCAG_AA_LARGE = 3.0

/**
 * WCAG AAA normal text minimum contrast ratio
 */
export const WCAG_AAA_NORMAL = 7.0

/**
 * WCAG AAA large text minimum contrast ratio
 */
export const WCAG_AAA_LARGE = 4.5

/**
 * Large text size threshold in points
 */
export const LARGE_TEXT_PT = 18

/**
 * Large text size threshold in pixels (approximate)
 */
export const LARGE_TEXT_PX = 24

/**
 * Bold large text size threshold in points
 */
export const LARGE_TEXT_BOLD_PT = 14

/**
 * Bold large text size threshold in pixels (approximate)
 */
export const LARGE_TEXT_BOLD_PX = 19

// ============================================
// Performance Constants
// ============================================

/**
 * Default object pool size
 */
export const DEFAULT_POOL_SIZE = 20

/**
 * Maximum object pool size
 */
export const MAX_POOL_SIZE = 50

/**
 * Default cache size
 */
export const DEFAULT_CACHE_SIZE = 100

/**
 * Maximum cache size
 */
export const MAX_CACHE_SIZE = 500

/**
 * Cache hit rate threshold for optimization (80%)
 */
export const CACHE_HIT_RATE_THRESHOLD = 0.8

/**
 * Cache utilization threshold for downsizing (80%)
 */
export const CACHE_UTILIZATION_HIGH = 0.8

/**
 * Cache utilization threshold for upsizing (20%)
 */
export const CACHE_UTILIZATION_LOW = 0.2

/**
 * Auto-optimization interval in milliseconds (1 minute)
 */
export const AUTO_OPTIMIZE_INTERVAL = 60000

/**
 * Cache persistence delay in milliseconds (5 seconds)
 */
export const CACHE_PERSIST_DELAY = 5000

/**
 * Maximum localStorage cache size in bytes (512KB)
 */
export const MAX_LOCALSTORAGE_SIZE = 512 * 1024

/**
 * Cache expiration time in milliseconds (2 hours)
 */
export const CACHE_EXPIRATION_TIME = 2 * 60 * 60 * 1000

/**
 * Memory limit in MB
 */
export const DEFAULT_MEMORY_LIMIT_MB = 50

/**
 * Cleanup interval in milliseconds (1 minute)
 */
export const CLEANUP_INTERVAL = 60000

// ============================================
// Color Perception Constants
// ============================================

/**
 * Perceived brightness coefficients for RGB (ITU-R BT.709)
 */
export const PERCEIVED_BRIGHTNESS = {
  RED: 0.299,
  GREEN: 0.587,
  BLUE: 0.114,
} as const

/**
 * Relative luminance coefficients (WCAG)
 */
export const LUMINANCE_COEFFICIENTS = {
  RED: 0.2126,
  GREEN: 0.7152,
  BLUE: 0.0722,
} as const

/**
 * Sepia tone transformation matrix coefficients
 */
export const SEPIA_MATRIX = {
  R: [0.393, 0.769, 0.189],
  G: [0.349, 0.686, 0.168],
  B: [0.272, 0.534, 0.131],
} as const

/**
 * Grayscale transformation coefficients
 */
export const GRAYSCALE_COEFFICIENTS = {
  RED: 0.299,
  GREEN: 0.587,
  BLUE: 0.114,
} as const

// ============================================
// Delta E Constants
// ============================================

/**
 * Delta E 2000 perceptual thresholds
 */
export const DELTA_E_THRESHOLDS = {
  /** Identical colors */
  IDENTICAL: 0,
  /** Imperceptible difference */
  IMPERCEPTIBLE: 1,
  /** Barely perceptible */
  BARELY_PERCEPTIBLE: 2,
  /** Perceptible at a glance */
  PERCEPTIBLE: 10,
  /** Significantly different */
  SIGNIFICANT: 50,
} as const

// ============================================
// Storage Keys
// ============================================

/**
 * Default localStorage key for theme storage
 */
export const DEFAULT_THEME_STORAGE_KEY = 'ldesign-theme'

/**
 * Default localStorage key for cache storage
 */
export const DEFAULT_CACHE_STORAGE_KEY = 'ldesign-color-cache'

/**
 * Default localStorage key for theme registry
 */
export const DEFAULT_THEME_REGISTRY_KEY = 'ldesign-theme-registry'

/**
 * Default CSS variable prefix
 */
export const DEFAULT_CSS_VAR_PREFIX = '--ld'

/**
 * Default theme prefix
 */
export const DEFAULT_THEME_PREFIX = 'ld'

// ============================================
// Theme Constants
// ============================================

/**
 * Maximum theme history size
 */
export const MAX_THEME_HISTORY = 5

/**
 * Maximum theme registry size
 */
export const MAX_THEME_REGISTRY = 50

/**
 * Theme cache expiration (24 hours)
 */
export const THEME_CACHE_EXPIRATION = 24 * 60 * 60 * 1000

// ============================================
// Color Temperature Ranges (in Kelvin)
// ============================================

export const COLOR_TEMPERATURE = {
  /** Warm color threshold */
  WARM_MIN: 2000,
  WARM_MAX: 4000,
  /** Neutral color threshold */
  NEUTRAL_MIN: 4000,
  NEUTRAL_MAX: 6500,
  /** Cool color threshold */
  COOL_MIN: 6500,
  COOL_MAX: 10000,
} as const

// ============================================
// Hue Angle Constants (in degrees)
// ============================================

export const HUE_ANGLES = {
  /** Red hue */
  RED: 0,
  /** Orange hue */
  ORANGE: 30,
  /** Yellow hue */
  YELLOW: 60,
  /** Yellow-green hue */
  YELLOW_GREEN: 90,
  /** Green hue */
  GREEN: 120,
  /** Cyan hue */
  CYAN: 180,
  /** Blue hue */
  BLUE: 240,
  /** Purple hue */
  PURPLE: 270,
  /** Magenta hue */
  MAGENTA: 300,
  /** Full circle */
  FULL_CIRCLE: 360,
} as const

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  INVALID_COLOR_INPUT: 'Invalid color input format',
  INVALID_RGB: 'Invalid RGB values: r, g, b must be 0-255',
  INVALID_HSL: 'Invalid HSL values: h: 0-360, s: 0-100, l: 0-100',
  INVALID_HSV: 'Invalid HSV values: h: 0-360, s: 0-100, v: 0-100',
  INVALID_HEX: 'Invalid HEX color format',
  INVALID_ALPHA: 'Invalid alpha value: must be 0-1',
  INVALID_COLOR_FORMAT: 'Invalid color format specified',
  THEME_NOT_FOUND: 'Theme not found',
  INVALID_THEME_DATA: 'Invalid theme data structure',
  CACHE_PERSIST_FAILED: 'Failed to persist cache to localStorage',
  CACHE_RESTORE_FAILED: 'Failed to restore cache from localStorage',
  MEMORY_LIMIT_EXCEEDED: 'Memory limit exceeded',
} as const

// ============================================
// Validation Ranges
// ============================================

export const VALIDATION_RANGES = {
  RGB: { min: 0, max: 255 },
  HUE: { min: 0, max: 360 },
  PERCENTAGE: { min: 0, max: 100 },
  ALPHA: { min: 0, max: 1 },
  LUMINANCE: { min: 0, max: 1 },
  CONTRAST: { min: 1, max: 21 },
} as const

// ============================================
// Default Values
// ============================================

export const DEFAULTS = {
  /** Default color (black) */
  COLOR: '#000000',
  /** Default alpha (opaque) */
  ALPHA: 1,
  /** Default saturation for palette generation */
  SATURATION: 50,
  /** Default lightness for palette generation */
  LIGHTNESS: 50,
  /** Default palette steps */
  PALETTE_STEPS: 10,
  /** Default gradient steps */
  GRADIENT_STEPS: 100,
  /** Default color difference threshold */
  COLOR_DIFFERENCE_THRESHOLD: 30,
  /** Default harmony angle */
  HARMONY_ANGLE: 30,
} as const

// ============================================
// Format Regular Expressions
// ============================================

/**
 * Regular expression for HEX color validation
 * Matches: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
 */
export const HEX_REGEX = /^#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i

/**
 * Regular expression for RGB/RGBA color parsing
 * Matches: rgb(r, g, b), rgba(r, g, b, a)
 */
export const RGB_REGEX = /^rgba?\(([^)]+)\)$/

/**
 * Regular expression for HSL/HSLA color parsing
 * Matches: hsl(h, s%, l%), hsla(h, s%, l%, a)
 */
export const HSL_REGEX = /^hsla?\(([^)]+)\)$/

// ============================================
// Hex Characters Lookup Table
// ============================================

/**
 * Hexadecimal characters for fast conversion
 */
export const HEX_CHARS = '0123456789ABCDEF'

/**
 * Pre-computed hex lookup table for 0-255
 * Speeds up RGB to HEX conversion
 */
export const HEX_LOOKUP: string[] = Array.from({ length: 256 }, (_, i) => {
  return HEX_CHARS[i >> 4] + HEX_CHARS[i & 0x0F]
})

// ============================================
// Named Colors Export
// ============================================

/**
 * Re-export named colors functionality from namedColors module
 */
export {
  getColorName,
  getNamedColor,
  getNamedColorNames,
  isNamedColor,
  namedColors,
  namedColorsMap,
} from './namedColors'
