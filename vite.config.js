import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true, // Abre o navegador automaticamente
    watch: {
      usePolling: true, // Melhora o hot reload no Windows
      interval: 1000,
    },
  },
  hmr: {
    overlay: true, // Mostra erros na tela
  },
});
