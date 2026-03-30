import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self'; frame-src 'self' https://chat.openai.com https://chatgpt.com https://*.openai.com https://*.chatgpt.com *;"
    }
  }
})

