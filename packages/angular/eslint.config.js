/**
 * ESLint Configuration for @ldesign/color-angular
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
  ],
})

