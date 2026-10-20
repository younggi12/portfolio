import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// 개발 서버(npm run dev)에서도 /api/chat이 동작하게 — 배포(Vercel)에서는 api/chat.js가 서버 함수로 바로 실행됨
// 키는 .env.local의 OPENAI_API_KEY (VITE_ 접두사 금지 — 붙이면 브라우저 코드에 들어감)
const devApi = () => ({
  name: "dev-api",
  configureServer(server) {
    const env = loadEnv("development", process.cwd(), "");
    if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
    server.middlewares.use("/api/chat", async (req, res) => {
      const { default: handler } = await server.ssrLoadModule("/api/chat.js");
      handler(req, res);
    });
  },
});

export default defineConfig({
  plugins: [react(), devApi()],
  base: "/",
  resolve: {
    // "@/styles/variables"처럼 src 기준 절대 경로로 import
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    // 첫 화면 3D(Three.js, heroScene)는 따로 나뉜 파일로 나중에 불러오므로 경고 기준만 올림
    chunkSizeWarningLimit: 700,
  },
  css: {
    preprocessorOptions: {
      // Sass 최신 API 사용 (구버전 API 경고 제거)
      scss: { api: "modern-compiler" },
    },
  },
});
