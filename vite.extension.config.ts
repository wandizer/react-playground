import { defineConfig } from 'vite'

export default defineConfig({
  root: 'tools/chrome-extension',
  publicDir: 'public',
  build: {
    outDir: '../../dist/chrome-extension',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: 'tools/chrome-extension/popup.html',
      },
    },
  },
})
