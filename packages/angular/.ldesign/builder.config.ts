import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs'],
    dir: {
      esm: 'es',
      cjs: 'lib',
    },
  },
  external: [
    '@angular/core',
    '@angular/common',
    'rxjs',
    /^rxjs\//,
    '@ldesign/color-core',
    /^@ldesign\/color-core\//,
  ],
  declaration: true,
  minify: false,
  sourcemap: true,
})

