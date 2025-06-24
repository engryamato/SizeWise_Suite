import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import virtualTools from './src/plugins/virtual-tools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtualTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  server: {
    port: 3000,
    open: true,
  },
  // Enable better error messages for dynamic imports
  optimizeDeps: {
    include: ['**/*'],
  },
  build: {
    rollupOptions: {
      // This ensures dynamic imports work in production
      output: {
        manualChunks: undefined,
      },
    },
  },
});
