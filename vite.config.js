import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If your Express API runs on another port during dev, proxy it here
// so fetch("/api/...") works without CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
