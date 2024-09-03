import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {

    proxy:{
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }, 
      "/socket": {
        target: "ws://localhost:3000",
        changeOrigin:true
      }
  }
    //  '/socket.io': {
    //     target: 'http://localhost:4000',
    //     ws: true,
    //     changeOrigin: true,
    //   },
    }
})