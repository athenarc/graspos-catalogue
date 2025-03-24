import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/catalogue/",
    server: {
      host: true,
    },
    define: {
      "process.env.REACT_APP_BACKEND_HOST": JSON.stringify(
        env.REACT_APP_BACKEND_HOST
      ),
    },
    plugins: [react()],
  };
});
