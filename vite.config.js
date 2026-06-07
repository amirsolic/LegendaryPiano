import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.mp3'],
  
  server: {
    port: 5173,
    strictPort: true,
  }
})

