/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    checker({
      eslint: {
        dev: {
          logLevel: ["error"],
        },
        lintCommand:
          "eslint . --report-unused-disable-directives --max-warnings 0",
        useFlatConfig: true,
      },
      overlay: {
        initialIsOpen: false,
      },
      typescript: true,
    }),
  ],
  server: {
    // to match server expectation
    port: 3000,
    // exit if port 3000 is in use (to avoid CORS errors)
    strict: true,
  },
  resolve: {
    alias: {
      "@shared": path.join(__dirname, "../shared/"),
      "@": path.join(__dirname, "src/"),
    },
  },
});
