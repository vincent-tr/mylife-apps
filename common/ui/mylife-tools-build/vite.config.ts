//import path from 'path';
//import fs from 'fs';
import { defineConfig, loadEnv, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const { VITE_WEB_PORT, VITE_WSTARGET_PORT } = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfigExport = {
    root: 'public',
    publicDir: 'images',
    server: {
      host: true,
      port: parseInt(VITE_WEB_PORT),
      allowedHosts: true,
      strictPort: true,
      proxy: {
        '/socket.io': {
          target: `ws://localhost:${VITE_WSTARGET_PORT}`,
          ws: true,
        },
      },
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
    plugins: [ react() ],
  };

  return config;
});
/*
// https://github.com/uber/baseweb/issues/4129
function fixReactVirtualized() {
  return {
    name: 'my:react-virtualized',
    configResolved() {
      fix('../mylife-tools-ui/node_modules/react-virtualized');
      fix('node_modules/react-virtualized');
    },
  }

  function fix(relPath) {
    const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
    const absPath = path.join(path.resolve(process.cwd()), relPath, 'dist/es/WindowScroller/utils/onScroll.js');
    
    if (!fs.existsSync(absPath)) {
      return;
    }

    const code = fs.readFileSync(absPath, 'utf-8');
    const modified = code.replace(WRONG_CODE, '');
    fs.writeFileSync(absPath, modified);
  }
}
*/