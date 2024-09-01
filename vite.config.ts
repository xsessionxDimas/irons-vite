import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', 'css', 'scss'],
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '~bootstrap', replacement: fileURLToPath(new URL('node_modules/bootstrap', import.meta.url)) },
      { find: '~sweetalert2', replacement: fileURLToPath(new URL('node_modules/sweetalert2', import.meta.url)) },
      { find: '~@fortawesome', replacement: fileURLToPath(new URL('node_modules/@fortawesome', import.meta.url)) },
      { find: '~dropzone', replacement: fileURLToPath(new URL('node_modules/dropzone', import.meta.url)) },
      { find: '~element-plus', replacement: fileURLToPath(new URL('node_modules/element-plus', import.meta.url)) },
    ]
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000, 
  }
})
