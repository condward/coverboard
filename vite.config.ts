import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/coverboard/',
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      components: `${path.resolve(__dirname, './src/components/')}`,
      api: `${path.resolve(__dirname, './src/api/')}`,
      CoverBoard: `${path.resolve(__dirname, './src/CoverBoard/')}`,
      store: `${path.resolve(__dirname, './src/store/')}`,
      types: `${path.resolve(__dirname, './src/types/')}`,
      utils: `${path.resolve(__dirname, './src/utils/')}`,
    },
  },
});
