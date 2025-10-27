/**
 * @ldesign/color - Design Systems Integration
 *
 * Generate color palettes compatible with popular design systems:
 * - Ant Design
 * - Chakra UI
 * - Material Design
 * - Carbon Design System
 * - Fluent UI (Microsoft)
 *
 * @module design-systems
 */

export * from './antDesign'
export * from './carbon'
export * from './chakraUI'
export * from './fluent'
// Re-export main generator function
export { type DesignSystem, generateDesignSystemPalette } from './generator'
export * from './materialDesign'

export * from './tailwind'
