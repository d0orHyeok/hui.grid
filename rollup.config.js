import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import typescript2 from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' assert { type: 'json' };
import cssnanoPlugin from 'cssnano';
import autoprefixer from 'autoprefixer';

/** @type {import('rollup').RollupOptions} */
export default {
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
    json(),
    postcss({ extract: true, plugins: [autoprefixer, cssnanoPlugin] }),
    nodeResolve(),
    commonjs(),
    typescript2({
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-flow'],
      // exclude: 'node_modules/**/*.(ts|tsx|js|jsx)',
      include: 'src/**/*.(ts|js)',
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.es', '.es6', '.mjs'],
    }),
  ],
};
