import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Split vendor chunks for better caching and parallel loading.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['motion'],
          'ogl-vendor': ['ogl'],
          'icons': ['lucide-react'],
          'lenis': ['lenis'],
        },
      },
    },
    // Target modern browsers — smaller, faster output.
    target: 'es2020',
    cssMinify: 'esbuild',
    // Increase chunk size warning threshold — the gallery bundle is
    // legitimately large due to OGL but is code-split and lazy-loaded.
    chunkSizeWarningLimit: 100,
    // Enable source maps for production debugging without exposing
    // to users (served only when explicitly requested).
    sourcemap: false,
    // Report compressed sizes in build output.
    reportCompressedSize: true,
  },
  // Pre-bundle large dependencies for faster dev server startup.
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion', 'lucide-react', 'lenis'],
  },
});
