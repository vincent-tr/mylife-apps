import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import fs from 'fs';


export default defineConfig(({ command, mode }) => {
  const { VITE_WEB_PORT, VITE_WSTARGET_PORT } = loadEnv(mode, process.cwd(), '');
  
  return {
    root: 'public',
    publicDir: 'images',
    server: {
      host: true,
      port: parseInt(VITE_WEB_PORT),
      strictPort: true,
      proxy: {
        '/socket.io': {
          target: `ws://localhost:${VITE_WSTARGET_PORT}`,
          ws: true,
        },
      }
    },
    build: {
      outDir: '../dist/prod/static',
      emptyOutDir: true,
      rollupOptions: {
        // Seems side effects are dropped else
        // on Money changes size from 3.4Mb to 3.7Mb
        treeshake: false 
      }
    },
    plugins: [ reactVirtualized() ]
  };
});

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
function reactVirtualized() {
  return {
    name: 'my:react-virtualized',
    configResolved() {
      const file = require
        .resolve('../../mylife-tools-ui/node_modules/react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        );
      const code = fs.readFileSync(file, 'utf-8');
      const modified = code.replace(WRONG_CODE, '');
      fs.writeFileSync(file, modified);
    },
  }
}