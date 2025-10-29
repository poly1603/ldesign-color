/**
 * ESLint Configuration for @ldesign/color-svelte
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  svelte: true,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
  ],
})

