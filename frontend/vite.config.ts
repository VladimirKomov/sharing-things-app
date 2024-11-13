import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // port for development
    host: true, // allow external access
    watch: {
      usePolling: true, // for WSL2
    },
  },
})
