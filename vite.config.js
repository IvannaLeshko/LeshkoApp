import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE потрібен лише для публікації не в корені домену (GitHub Pages: /назва-репозиторію/).
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
});
