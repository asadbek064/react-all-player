import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-all-player']
  },
  build: {
    commonjsOptions: { exclude: ['react-all-player'], include: [] }
  },
  server: {
    watch: {
      ignored: ['!**/node_modules/react-all-player/**']
    }
  }
})
