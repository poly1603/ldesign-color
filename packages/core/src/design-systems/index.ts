/**
 * @ldesign/color - Design Systems Integration
 *
 * Generate color palettes compatible with popular design systems:
 * - Ant Design
 * - Bootstrap 5
 * - Carbon Design System
 * - Chakra UI
 * - Fluent UI (Microsoft)
 * - GitHub Primer
 * - Material Design
 * - Shopify Polaris
 * - Tailwind CSS
 *
 * @module design-systems
 */

export * from './antDesign'
export * from './bootstrap'
export * from './carbon'
export * from './chakraUI'
export * from './fluent'
// Re-export main generator function
export { type DesignSystem, generateDesignSystemPalette } from './generator'
export * from './materialDesign'
export * from './primer'
export * from './polaris'
export * from './tailwind'
