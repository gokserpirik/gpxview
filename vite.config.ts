import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'astryx', test: /node_modules[\\/]@astryxdesign[\\/]core/ }],
        },
      },
    },
  },
})
