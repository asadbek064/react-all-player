import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-vid-player']
  },
  build: {
    commonjsOptions: { exclude: ['react-vid-player'], include: [] }
  },
  server: {
    watch: {
      ignored: ['!**/node_modules/react-vid-player/**']
    }
  }
})
