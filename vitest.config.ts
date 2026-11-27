import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["src/test/smoke/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/lib/**",
        "src/components/tools/**",
        "src/components/hero/**",
        "src/components/profile/**",
        "src/components/onboarding/**",
      ],
      exclude: [
        "src/types/**",
        "src/test/**",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 75,
        functions: 70,
        branches: 50,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
