import { defineConfig, loadEnv, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const { VITE_WEB_PORT, VITE_WSTARGET_PORT } = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfigExport = {
    root: '.',
    publicDir: 'static',
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
