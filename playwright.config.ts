import { defineConfig } from "@playwright/test";

/**
 * Runs against the static export in out/ (npm run build first), or against a
 * deploy preview via BASE_URL=https://... npx playwright test
 */
const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:4317";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "python3 -m http.server 4317 -d out",
        url: BASE_URL,
        reuseExistingServer: true,
      },
});
