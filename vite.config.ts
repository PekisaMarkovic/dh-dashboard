import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), tsConfigPaths(), svgr({ svgrOptions: { expandProps: 'end' } })],
  build: {
    minify: 'esbuild', // Ensures minification and optimizes for production
    sourcemap: false, // You can disable sourcemaps in production
  },
  server: {
    host: '0.0.0.0',
    port: 4300,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
