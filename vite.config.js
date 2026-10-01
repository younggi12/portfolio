import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    // "@/styles/variables"처럼 src 기준 절대 경로로 import
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  css: {
    preprocessorOptions: {
      // Sass 최신 API 사용 (구버전 API 경고 제거)
      scss: { api: "modern-compiler" },
    },
  },
});
