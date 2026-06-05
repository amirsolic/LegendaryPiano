import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.exr'],
  
  server: {
    port: 5173,
    strictPort: true,
  }
})

