import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: 'tools/chrome-extension',
  envDir: workspaceRoot,
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
