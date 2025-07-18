import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

//https://vitest.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    // this points to the setup file
    setupFiles: "./src/setupTests.js",
  },
});
