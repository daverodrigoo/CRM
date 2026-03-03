import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    watch: {
      usePolling: true, // This forces Vite to watch for changes in Docker
    },
    host: true, // Ensures it's accessible at localhost:5173
    port: 5173,
  },
})