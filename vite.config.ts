import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("three") || id.includes("@react-three/fiber")) return "three-engine";
          if (id.includes("framer-motion")) return "motion";
          return undefined;
        },
      },
    },
  },
});
