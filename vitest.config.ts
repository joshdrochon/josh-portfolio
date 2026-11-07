import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
    // Node 25+ puts its own localStorage over jsdom's; turn it off so tests get the browser one.
    execArgv: ["--no-experimental-webstorage"],
  },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
});
