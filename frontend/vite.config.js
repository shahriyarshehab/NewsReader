import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/feed': {
        target: 'https://headlinehub-api.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
