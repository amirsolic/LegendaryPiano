import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.glb'],
  
  server: {
    port: 5173,
    strictPort: true,
  }
})

