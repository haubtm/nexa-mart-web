import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
    strictPort: true,
    allowedHosts: ['localhost', '127.0.0.1'],
    watch: {
      ignored: ['**/.git/**'],
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
