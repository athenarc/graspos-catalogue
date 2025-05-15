import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    
    define: {
      "process.env.REACT_APP_BACKEND_HOST": JSON.stringify(
        env.REACT_APP_BACKEND_HOST
      ),
      "process.env.REACT_APP_BASE_PATH": JSON.stringify(
        env.REACT_APP_BASE_PATH
      ),
    },
    base: env.REACT_APP_BASE_PATH,
    server: {
      host: true,
    },
    plugins: [react()],
  };
});
