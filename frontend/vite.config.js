import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks(id) {
  if (id.includes('node_modules')) {
    // KEEP ALL REACT TOGETHER
    if (
      id.includes('react') ||
      id.includes('react-dom') ||
      id.includes('react-router-dom') ||
      id.includes('react/jsx-runtime')
    ) {
      return 'react'
    }

    // Heavy libs only
    if (id.includes('chart.js')) {
      return 'charts'
    }

    // Everything else
    return 'vendor'
  }
}
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})