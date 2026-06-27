import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from "@rollup/plugin-inject";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      inject({
        $: "jquery",
        jQuery: "jquery"
      }),
      react()
  ],
    server: {
      proxy: {
          "/api": {
              target: "http://localhost:7566",
              changeOrigin: true,
          }
      }
    }
})
