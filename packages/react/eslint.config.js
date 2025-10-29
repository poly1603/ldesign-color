/**
 * ESLint Configuration for @ldesign/color-react
 */

import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  ignores: [
    'dist',
    'es',
    'lib',
    'node_modules',
    '*.md',
    'examples/**',
  ],
})

