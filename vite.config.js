import { defineConfig } from 'vite';
import { resolve } from 'path';
import { __dirname, postcsssPlugins } from './options';

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
  } else {
    // command === 'build'
  }

  return {
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        { find: '@t', replacement: resolve(__dirname, 'types') },
      ],
    },
    css: {
      postcss: {
        plugins: postcsssPlugins,
      },
    },
  };
});
