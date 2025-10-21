/**
 * @ldesign/color - Use Color Plugin
 *
 * Composable for using color plugin in Vue components
 */
import { type ColorPlugin } from './index';
/**
 * Use color plugin
 *
 * @example
 * ```vue
 * <script setup>
 * import { useColorPlugin } from '@ldesign/color/plugin'
 *
 * const color = useColorPlugin()
 *
 * // Apply theme
 * await color.applyPresetTheme('blue')
 *
 * // Get current theme
 * const theme = color.getCurrentTheme()
 * </script>
 * ```
 */
export declare function useColorPlugin(): ColorPlugin;
