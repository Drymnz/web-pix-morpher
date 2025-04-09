import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'pixmorpher.online',
    allowedHosts: ['pixmorpher.online', 'localhost'],
  }
});