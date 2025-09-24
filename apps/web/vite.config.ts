import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@bunstack/api": path.resolve(__dirname, "../api/src"),
      "@bunstack/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@bunstack/ui/": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Host attendu par Hono pour matcher api routes
            proxyReq.setHeader("host", "api.localhost:4000");
          });
        },
      },
    },
  },
});
