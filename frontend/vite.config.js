import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function removeCrossoriginFromCss() {
  return {
    name: 'remove-crossorigin-css',
    transformIndexHtml(html) {
      return html.replace(/<link rel="stylesheet" crossorigin/g, '<link rel="stylesheet"')
    },
  }
}

export default defineConfig({
  plugins: [react(), removeCrossoriginFromCss()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
