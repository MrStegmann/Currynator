import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.join(import.meta.dirname, 'src', 'renderer'),
  base: './',
  build: {
    outDir: path.join(import.meta.dirname, 'dist', 'renderer'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});
