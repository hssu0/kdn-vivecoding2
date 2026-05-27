import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포: /kdn-vivecoding2/ 경로 기준
export default defineConfig({
  plugins: [react()],
  base: '/kdn-vivecoding2/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5175,
    open: true,
  },
})
