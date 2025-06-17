import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
<<<<<<< HEAD
=======
import virtualTools from './src/plugins/virtual-tools';
>>>>>>> origin/main

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    virtualTools(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'virtual:tools': path.resolve(__dirname, 'src/plugins/virtual-tools.ts'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  server: {
    port: 3000,
    open: true,
  },
<<<<<<< HEAD
=======
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
>>>>>>> origin/main
});
