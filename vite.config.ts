import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const SENTINEL_URL = env.SENTINEL_URL;
  const SENTINEL_USERNAME = env.SENTINEL_USERNAME;
  const SENTINEL_PASSWORD = env.SENTINEL_PASSWORD;
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/sentinel": {
          target: SENTINEL_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sentinel/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              const username = SENTINEL_USERNAME;
              const password = SENTINEL_PASSWORD;

              if (username && password) {
                const basicAuth =
                  "Basic " +
                  Buffer.from(`${username}:${password}`).toString("base64");
                proxyReq.setHeader("Authorization", basicAuth);
              }
            });
          },
        },
      },
    },
  };
});
