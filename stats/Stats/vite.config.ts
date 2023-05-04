import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path';

const SRC_DIR = path.resolve(__dirname, './src');
const PUBLIC_DIR = path.resolve(__dirname, './public');
const BUILD_DIR = path.resolve(__dirname, './www');
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  publicDir: PUBLIC_DIR,
  build: {
    outDir: BUILD_DIR,
    assetsInlineLimit: 0,
    emptyOutDir: true,
    rollupOptions: {
      treeshake: false
    }
  }
})
