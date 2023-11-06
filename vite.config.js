import { defineConfig } from 'vite';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

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
        plugins: [autoprefixer, cssnano],
      },
    },
  };
});
