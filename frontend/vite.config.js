import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuracion minima de Vite para trabajar con React.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
