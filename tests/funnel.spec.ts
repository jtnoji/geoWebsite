import { test, expect } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * The funnel rule (website-plan.md §1): every page reaches /free-check in
 * ≤1 click, and the form submits through to the confirmation state.
 */

for (const page of PAGES) {
  test(`${page.path} links to /free-check/ in one click`, async ({ page: pw }) => {
    await pw.goto(page.path);
    // Filter to visible BEFORE .first(): in DOM order the first /free-check
    // link is Header's desktop `btn-pill`, which is correctly hidden behind
    // the hamburger at mobile width. Asserting on it failed all 15 pages on
    // mobile-safari while BottomBar's CTA sat visible further down the page.
    // The rule is "≤1 click from every page", so ANY visible link satisfies
    // it; zero visible links still fails, which is the regression we want.
    const links = pw.locator('a[href*="/free-check"]').filter({ visible: true });
    await expect(
      links.first(),
      `${page.path} should have a visible link to /free-check/`
    ).toBeVisible();
  });
}

test("free-check form fills, submits, and confirms", async ({ page }) => {
  // Stub the Supabase insert so CI runs never write real rows to the leads
  // queue; the form's real submit path is still exercised.
  await page.route("**/rest/v1/leads", (route) =>
    route.fulfill({ status: 201, body: "" })
  );
  await page.goto("/free-check/");

  await page.fill("#business", "Bluequarry Growth (test)");
  await page.fill("#website", "https://bluequarry-test.example.com");
  await page.fill("#area", "Oakland, CA");
  await page.fill("#description", "B2B marketing for seed-stage startups.");
  await page.fill("#email", "founder@bluequarry-test.example.com");
  await page.getByRole("button", { name: "Run my free AI visibility check" }).click();

  const confirmation = page.getByTestId("free-check-confirmation");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toContainText("running your check");
  await expect(confirmation).toContainText("1–2 business days");
});
