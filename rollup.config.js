import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const packageJson = require("./package.json");

export default [
  {
    onwarn(warning, warn) {
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        (warning.message.includes(`"use client"`) || warning.message.includes(`'use client'`))
      ) {
        return;
      }
      warn(warning);
    },
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({tsconfig: "./tsconfig.json"}),
      terser(),
    ],
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
  },
  {
    input: "src/index.ts",
    output: [{file: "dist/types.d.ts", format: "es"}],
    plugins: [dts.default()],
  },
];
