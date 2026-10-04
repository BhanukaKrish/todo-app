import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  // Requests keep their `/api` prefix, so the target must be the server origin only.
  const apiTarget = (env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000').replace(/\/api\/?$/, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: {
      port: 5173,
      // Lets the app call `/api/*` without CORS during local development.
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
