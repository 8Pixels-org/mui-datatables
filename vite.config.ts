import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import tsConfigPaths from 'vite-tsconfig-paths'
import EsLint from 'vite-plugin-linter'
import packageJson from "./package.json";

const {EsLinter, linterPlugin} = EsLint

console.log("packageJson.peerDependencies", packageJson.peerDependencies)

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
      formats: ['es'],
      // formats: ['es', 'umd'],
      fileName: (format) => `index.js`,
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies).map(k => k),
      input: path.resolve(__dirname, 'src/index.ts'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
          '@emotion/styled': 'styled',
          '@mui/icons-material': '@mui/icons-material',
          '@mui/material': '@mui/material',
        },
      },
    },
  },
}));
