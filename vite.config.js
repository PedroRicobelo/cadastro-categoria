import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/cadastro-categoria/",
  server: {
    port: 5173,
    host: true,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  hmr: {
    overlay: true,
  },
});
