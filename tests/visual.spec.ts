import { test } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * Full-page screenshots at phone / tablet / desktop widths — the artifact for
 * the design-critique loop (scaffold §5). Not assertions; output lands in
 * tests/screenshots/.
 */

const WIDTHS = [390, 768, 1440] as const;

for (const page of PAGES) {
  for (const width of WIDTHS) {
    test(`screenshot ${page.path} @ ${width}px`, async ({ page: pw }) => {
      await pw.setViewportSize({ width, height: 900 });
      await pw.goto(page.path);
      await pw.waitForLoadState("networkidle");
      const slug =
        page.path === "/" ? "home" : page.path.replaceAll("/", " ").trim().replaceAll(" ", "-");
      await pw.screenshot({
        path: `tests/screenshots/${slug}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
