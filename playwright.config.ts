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
    // Scroll-reveal (globals.css + ScrollReveal.tsx) honours this by showing
    // every [data-reveal] element immediately. Without it, full-page
    // screenshots would capture below-the-fold sections still at opacity 0,
    // since they never scrolled into view.
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "python3 -m http.server 4317 -d out",
        url: BASE_URL,
        reuseExistingServer: true,
      },
});
