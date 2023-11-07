import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import typescript2 from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { dts } from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };
import tsc from './tsconfig.json' assert { type: 'json' };
// PostCSS
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import postcssCustomProperties from 'postcss-custom-properties';
// Utils
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const extensions = ['.ts', '.js', '.es', '.es6', '.mjs'];

/** @type {import('postcss-preset-env').pluginOptions} */
const postcssEnv = {
  autoprefixer: { grid: 'autoplace' },
  browsers: '> 5% in KR, defaults, not IE < 11',
};

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/style/index.css',
    output: {
      file: 'dist/hui-grid.css',
      format: 'es',
    },
    plugins: [
      postcss({
        include: '**/*.css',
        extract: true,
        plugins: [postcssImport, postcssPresetEnv(postcssEnv), postcssCustomProperties, autoprefixer, cssnano],
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      alias({
        entries: [
          { find: '@/', replacement: resolve(__dirname, 'src/') },
          { find: '@t/', replacement: resolve(__dirname, 'types/') },
        ],
      }),
      json(),
      nodeResolve({ extensions }),
      commonjs({ include: 'node_modules/**' }),
      terser(),
      peerDepsExternal(),
      typescript2({
        useTsconfigDeclarationDir: true,
        tsconfig: 'tsconfig.json',
        clean: true,
      }),
      babel({
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-flow'],
        exclude: 'node_modules/**',
        include: 'src/**/*.(ts|js)',
        extensions,
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
    external: [/@babel\/runtime/],
  },
  {
    input: 'dist/es/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      alias({
        entries: [
          { find: '@/', replacement: resolve(__dirname, 'src/') },
          { find: '@t/', replacement: resolve(__dirname, 'types/') },
        ],
      }),
      dts({
        compilerOptions: {
          baseUrl: tsc.compilerOptions.baseUrl,
          paths: tsc.compilerOptions.paths,
        },
      }),
    ],
    external: [/\.css$/],
  },
];
