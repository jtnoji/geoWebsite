import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the static export in out/ (npm run build first), or against a
 * deploy preview via BASE_URL=https://... npm test
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

  /**
   * Chromium alone was hiding a whole class of risk: BottomBar is
   * position:fixed on every page and the ground is a background-attachment:
   * fixed gradient, both of which WebKit and iOS Safari handle differently.
   *
   * visual.spec.ts runs on chromium ONLY. It writes to fixed paths in
   * tests/screenshots/ for the design-critique loop, so running it in three
   * projects would just have them overwrite each other's output.
   */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Runs visual.spec too, into tests/screenshots/webkit/, so there is a
      // Safari reference to diff against when touching fixed positioning.
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 15"] },
      testIgnore: /visual\.spec\.ts/,
    },
  ],

  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "python3 -m http.server 4317 -d out",
        url: BASE_URL,
        reuseExistingServer: true,
      },
});
