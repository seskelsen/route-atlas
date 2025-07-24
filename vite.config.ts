import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/route-atlas/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Removed lovable-tagger due to dependency conflicts
    // mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
