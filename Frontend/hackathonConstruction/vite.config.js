import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: '10.2.1.77', // ваш хост из package.json
    proxy: {
  '/apartments': {
    target: 'http://10.2.1.83:8000',
    changeOrigin: true,
    //rewrite: (path) => path.replace(/^\/test/, ''),
  },
}

  },
})
