/**
 * ESLint Configuration for @ldesign/color-vue
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
  ],
})

