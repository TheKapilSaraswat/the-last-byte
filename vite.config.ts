import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base keeps asset URLs working on any host root or sub-path
  // (GitHub Pages project sites, Netlify, Vercel, custom domain).
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
