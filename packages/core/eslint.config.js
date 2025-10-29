/**
 * ESLint Configuration for @ldesign/color-core
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: false,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
    '__tests__/**',
  ],
})

