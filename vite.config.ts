import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import tsConfigPaths from 'vite-tsconfig-paths'
import EsLint from 'vite-plugin-linter'

const {EsLinter, linterPlugin} = EsLint


// https://vitejs.dev/config/
export default defineConfig(configEnv => ({
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({configEnv})],
    }),
    dts({
      include: 'src/',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '8pixels',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "styled-components",
        '@mui/material',
        '@mui/lab',
        '@mui/icons-material',
        '@mui/types',
        '@mui/x-date-pickers',
        '@emotion/styled',
        '@emotion/react',
        'swr',
        'deepmerge-ts',
      ],
      input: path.resolve(__dirname, 'src/index.ts'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
          '@emotion/styled': 'styled',
        },
      },
    },
  },
}));
