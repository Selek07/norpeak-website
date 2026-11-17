const { test, expect } = require("@playwright/test");

/**
 * Smoke tests for the portfolio homepage.
 *
 * The UI is React Native Web, which renders to <div>s rather than semantic
 * <nav>/<button> elements, so these assertions target stable, user-visible text
 * (page title, nav CTA, footer) instead of ARIA roles.
 */
test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with the correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Norpeak/);
  });

  test("shows the navigation call-to-action", async ({ page }) => {
    // The "LET'S TALK" CTA lives in the sticky SectionNav header.
    await expect(page.getByText("LET'S TALK")).toBeVisible();
  });

  test("renders the page footer", async ({ page }) => {
    await expect(
      page.getByText("Norpeak. Built for the summit.")
    ).toBeVisible();
  });
});
