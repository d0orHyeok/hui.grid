import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';
import postcssCustomProperties from 'postcss-custom-properties';
import { fileURLToPath } from 'url';

/** @type {import('postcss-preset-env').pluginOptions} */
const postcssEnv = {
  autoprefixer: { grid: 'autoplace' },
  browsers: '> 5% in KR, defaults, not IE < 11',
};

export const postcsssPlugins = [
  postcssImport,
  postcssPresetEnv(postcssEnv),
  postcssCustomProperties,
  autoprefixer,
  cssnano,
];

export const __dirname = fileURLToPath(new URL('.', import.meta.url));
