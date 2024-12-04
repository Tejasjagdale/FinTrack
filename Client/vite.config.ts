import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Target modern browsers
    minify: 'esbuild', // Use esbuild for faster and efficient minification
    sourcemap: true,   // Generate sourcemaps for easier debugging
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group dependencies by their top-level package for better caching
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://groww.in/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});


