import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

if (!globalThis.crypto?.subtle) {
  const nodeCrypto = await import("node:crypto");
  globalThis.crypto = nodeCrypto.webcrypto;
}


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    port: 5173,
  },
});
