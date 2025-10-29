/**
 * ESLint Configuration for @ldesign/color-solid
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  solid: true,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
  ],
})

