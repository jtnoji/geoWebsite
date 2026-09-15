import { test } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * Full-page screenshots at phone / tablet / desktop / wide widths — the
 * artifact for the design-critique loop (scaffold §5). Not assertions; output
 * lands in tests/screenshots/.
 *
 * 1920 was added 2026-09-14 when the site went full width: the layout only
 * changes past 1600px, so without a wide shot nothing in the loop would show a
 * regression back to a boxed-in page.
 */

const WIDTHS = [390, 768, 1440, 1920] as const;

for (const page of PAGES) {
  for (const width of WIDTHS) {
    test(`screenshot ${page.path} @ ${width}px`, async ({ page: pw }, testInfo) => {
      await pw.setViewportSize({ width, height: 900 });
      await pw.goto(page.path);
      await pw.waitForLoadState("networkidle");
      const slug =
        page.path === "/" ? "home" : page.path.replaceAll("/", " ").trim().replaceAll(" ", "-");
      // Chromium keeps the flat paths the design-critique loop expects;
      // WebKit lands in its own directory so the two never overwrite each
      // other. Compare the pair when touching anything position:fixed.
      const dir =
        testInfo.project.name === "chromium"
          ? "tests/screenshots"
          : `tests/screenshots/${testInfo.project.name}`;
      await pw.screenshot({ path: `${dir}/${slug}-${width}.png`, fullPage: true });
    });
  }
}
