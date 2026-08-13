import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: Number(env.PORT) || 5173,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Stable vendor chunks: heavy libs cache independently of app code
          advancedChunks: {
            groups: [
              { name: 'charts', test: /node_modules[\\/](recharts|d3-|victory-vendor)/ },
              { name: 'motion', test: /node_modules[\\/](motion|framer-motion)/ },
              { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            ],
          },
        },
      },
    },
  }
})
