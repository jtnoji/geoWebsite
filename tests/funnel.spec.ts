import { test, expect } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * The funnel rule (website-plan.md §1): every page reaches /free-check in
 * ≤1 click, and the form submits through to the confirmation state.
 */

for (const page of PAGES) {
  test(`${page.path} links to /free-check/ in one click`, async ({ page: pw }) => {
    await pw.goto(page.path);
    const links = pw.locator('a[href*="/free-check"]');
    await expect(
      links.first(),
      `${page.path} should have a visible link to /free-check/`
    ).toBeVisible();
  });
}

test("free-check form fills, submits, and confirms", async ({ page }) => {
  await page.goto("/free-check/");

  await page.fill("#business", "Acme Test Plumbing");
  await page.fill("#website", "https://acme-test.example.com");
  await page.fill("#area", "Berkeley, CA");
  await page.fill("#description", "Residential plumbing repairs and water heaters.");
  await page.fill("#email", "owner@acme-test.example.com");
  await page.getByRole("button", { name: "Run my free check" }).click();

  const confirmation = page.getByTestId("free-check-confirmation");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toContainText("running your check");
  await expect(confirmation).toContainText("1–2 business days");
});
